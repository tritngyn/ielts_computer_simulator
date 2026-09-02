import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { AttemptQueryDto } from './dto/attempt-query.dto';
import { SubmitAttemptDto } from './dto/submit-attempt.dto';
import { GradingService } from './grading.service';

@Injectable()
export class AttemptsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gradingService: GradingService,
  ) {}

  async saveTestAttempt(
    userId: string,
    data: SubmitAttemptDto,
    idempotencyKey: string,
  ) {
    this.validateUserAnswers(data.userAnswers);
    const existing = await this.prisma.attempt.findUnique({
      where: { idempotencyKey },
    });
    if (existing)
      return this.resolveExistingAttempt(existing, userId, data.testId);

    const test = await this.prisma.test.findUnique({
      where: { id: data.testId },
      select: { content: true, publicContent: true, answerKey: true },
    });
    if (!test) throw new NotFoundException('Test not found');

    const legacyContent = this.asObject(test.content);
    const publicContent =
      test.publicContent ?? this.withoutAnswers(legacyContent);
    const answerKey = test.answerKey ?? legacyContent.answers;
    if (!answerKey)
      throw new BadRequestException('Test answer key is not configured');
    const grading = this.gradingService.grade(
      publicContent,
      answerKey,
      data.userAnswers,
    );

    try {
      return await this.prisma.$transaction((transaction) =>
        transaction.attempt.create({
          data: {
            testId: data.testId,
            userId,
            score: grading.score,
            totalQuestions: grading.totalQuestions,
            timeTakenSeconds: data.timeTakenSeconds,
            mode: data.mode,
            userAnswers: data.userAnswers,
            gradingDetails: grading.details as unknown as Prisma.InputJsonValue,
            idempotencyKey,
          },
        }),
      );
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const racedAttempt = await this.prisma.attempt.findUnique({
          where: { idempotencyKey },
        });
        if (racedAttempt) {
          return this.resolveExistingAttempt(racedAttempt, userId, data.testId);
        }
      }
      throw error;
    }
  }

  async getUserAttempts(userId: string, testId?: string) {
    const whereClause = testId ? { userId, testId } : { userId };
    return this.prisma.attempt.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserAttemptsPage(userId: string, query: AttemptQueryDto) {
    const attempts = await this.prisma.attempt.findMany({
      where: { userId, ...(query.testId ? { testId: query.testId } : {}) },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: query.limit + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
    });
    const hasNextPage = attempts.length > query.limit;
    const data = hasNextPage ? attempts.slice(0, query.limit) : attempts;
    return {
      data,
      pageInfo: {
        hasNextPage,
        endCursor: data.at(-1)?.id ?? null,
      },
    };
  }

  async getAttemptById(userId: string, attemptId: string) {
    const attempt = await this.prisma.attempt.findUnique({
      where: { id: attemptId },
      include: {
        test: { select: { id: true, title: true, testCode: true, type: true } },
      },
    });

    if (attempt && attempt.userId === userId) {
      return attempt;
    }
    throw new NotFoundException('Attempt not found or unauthorized');
  }

  private resolveExistingAttempt<
    T extends { userId: string | null; testId: string },
  >(attempt: T, userId: string, testId: string): T {
    if (attempt.userId !== userId || attempt.testId !== testId) {
      throw new ConflictException('Idempotency key is already in use');
    }
    return attempt;
  }

  private validateUserAnswers(answers: Record<string, string>): void {
    const entries = Object.entries(answers);
    if (entries.length > 200) {
      throw new BadRequestException('Too many submitted answers');
    }
    if (
      entries.some(
        ([key, value]) =>
          key.length > 128 || typeof value !== 'string' || value.length > 500,
      )
    ) {
      throw new BadRequestException('Submitted answers are invalid');
    }
  }

  private asObject(value: Prisma.JsonValue): Prisma.JsonObject {
    if (!value || Array.isArray(value) || typeof value !== 'object') {
      throw new BadRequestException('Test content is invalid');
    }
    return value;
  }

  private withoutAnswers(content: Prisma.JsonObject): Prisma.JsonObject {
    const publicContent = { ...content };
    delete publicContent.answers;
    return publicContent;
  }
}
