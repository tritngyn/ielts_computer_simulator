import { ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { AttemptsService } from './attempts.service';
import { AttemptMode, SubmitAttemptDto } from './dto/submit-attempt.dto';
import { GradingService } from './grading.service';

describe('AttemptsService idempotency', () => {
  const attemptFindUnique = jest.fn();
  const testFindUnique = jest.fn();
  const transaction = jest.fn();
  const grade = jest.fn();
  const prisma = {
    attempt: { findUnique: attemptFindUnique },
    test: { findUnique: testFindUnique },
    $transaction: transaction,
  } as unknown as PrismaService;
  const grading = { grade } as unknown as GradingService;
  const service = new AttemptsService(prisma, grading);
  const submission: SubmitAttemptDto = {
    testId: 'reading-1',
    userAnswers: { passage_0_q1: 'answer' },
    mode: AttemptMode.SIMULATION,
    timeTakenSeconds: 1200,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the existing owned attempt without creating a duplicate', async () => {
    const existing = {
      id: 'attempt-1',
      userId: 'user-1',
      testId: submission.testId,
    };
    attemptFindUnique.mockResolvedValue(existing);

    await expect(
      service.saveTestAttempt('user-1', submission, 'idempotency-key'),
    ).resolves.toBe(existing);
    expect(testFindUnique).not.toHaveBeenCalled();
    expect(transaction).not.toHaveBeenCalled();
  });

  it('rejects reuse of a key owned by another submission', async () => {
    attemptFindUnique.mockResolvedValue({
      id: 'attempt-1',
      userId: 'another-user',
      testId: submission.testId,
    });

    await expect(
      service.saveTestAttempt('user-1', submission, 'idempotency-key'),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('returns the winning attempt when concurrent inserts race', async () => {
    const winningAttempt = {
      id: 'attempt-1',
      userId: 'user-1',
      testId: submission.testId,
    };
    attemptFindUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(winningAttempt);
    testFindUnique.mockResolvedValue({
      content: { answers: { '1': ['answer'] } },
      publicContent: { passages: [] },
      answerKey: { '1': ['answer'] },
    });
    grade.mockReturnValue({
      score: 1,
      totalQuestions: 1,
      details: { questionResults: {} },
    });
    transaction.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '5.22.0',
      }),
    );

    await expect(
      service.saveTestAttempt('user-1', submission, 'idempotency-key'),
    ).resolves.toBe(winningAttempt);
    expect(attemptFindUnique).toHaveBeenCalledTimes(2);
  });
});
