import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { SaveAttemptDto } from './save-attempt.dto';

describe('SaveAttemptDto validation', () => {
  const pipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  const metadata = { type: 'body' as const, metatype: SaveAttemptDto };

  it('accepts a valid attempt payload', async () => {
    const result: unknown = await pipe.transform(
      {
        testId: 'reading-1',
        score: 30,
        totalQuestions: 40,
        timeTakenSeconds: 1800,
        mode: 'Full test',
        userAnswers: { q1: 'answer' },
      },
      metadata,
    );

    expect(result).toBeInstanceOf(SaveAttemptDto);
  });

  it('rejects unknown client fields', async () => {
    await expect(
      pipe.transform(
        {
          testId: 'reading-1',
          score: 30,
          totalQuestions: 40,
          timeTakenSeconds: 1800,
          mode: 'Full test',
          userId: 'another-user',
        },
        metadata,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects invalid numeric ranges', async () => {
    await expect(
      pipe.transform(
        {
          testId: 'reading-1',
          score: -1,
          totalQuestions: 0,
          timeTakenSeconds: -2,
          mode: 'Full test',
        },
        metadata,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
