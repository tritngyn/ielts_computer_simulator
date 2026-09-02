import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { SubmitAttemptDto } from './submit-attempt.dto';

describe('SubmitAttemptDto validation', () => {
  const pipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  const metadata = { type: 'body' as const, metatype: SubmitAttemptDto };

  it('accepts a valid attempt payload', async () => {
    const result: unknown = await pipe.transform(
      {
        testId: 'reading-1',
        timeTakenSeconds: 1800,
        mode: 'simulation',
        userAnswers: { q1: 'answer' },
      },
      metadata,
    );

    expect(result).toBeInstanceOf(SubmitAttemptDto);
  });

  it('rejects unknown client fields', async () => {
    await expect(
      pipe.transform(
        {
          testId: 'reading-1',
          timeTakenSeconds: 1800,
          mode: 'simulation',
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
          timeTakenSeconds: -2,
          mode: 'simulation',
        },
        metadata,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
