import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SaveAttemptDto } from './dto/save-attempt.dto';
import { AttemptQueryDto } from './dto/attempt-query.dto';

@Injectable()
export class AttemptsService {
  constructor(private prisma: PrismaService) {}

  async saveTestAttempt(userId: string, data: SaveAttemptDto) {
    const attempt = await this.prisma.attempt.create({
      data: {
        testId: data.testId,
        userId: userId,
        score: data.score,
        totalQuestions: data.totalQuestions,
        timeTakenSeconds: data.timeTakenSeconds,
        mode: data.mode,
        userAnswers: data.userAnswers || undefined,
      },
    });
    return { success: true, attempt };
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
        test: true,
      },
    });

    if (attempt && attempt.userId === userId) {
      return attempt;
    }
    throw new NotFoundException('Attempt not found or unauthorized');
  }
}
