import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AttemptsService {
  constructor(private prisma: PrismaService) {}

  async saveTestAttempt(userId: string, data: any) {
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
