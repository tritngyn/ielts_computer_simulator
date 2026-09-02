import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export enum AttemptMode {
  PRACTICE = 'practice',
  SIMULATION = 'simulation',
}

function normalizeLegacyMode(value: unknown): unknown {
  if (value === 'Luyện tập') return AttemptMode.PRACTICE;
  if (value === 'Full test') return AttemptMode.SIMULATION;
  return value;
}

export class SubmitAttemptDto {
  @IsString()
  @MaxLength(128)
  testId!: string;

  @IsObject()
  userAnswers!: Record<string, string>;

  @IsEnum(AttemptMode)
  mode!: AttemptMode;

  @IsInt()
  @Min(0)
  timeTakenSeconds!: number;
}

/**
 * One-release compatibility DTO. Score fields are accepted only so an older
 * Vercel revision does not fail during rollout; the service never reads them.
 */
export class LegacySubmitAttemptDto extends SubmitAttemptDto {
  @Transform(({ value }) => normalizeLegacyMode(value))
  @IsEnum(AttemptMode)
  declare mode: AttemptMode;

  @IsOptional()
  @IsInt()
  @Min(0)
  score?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalQuestions?: number;
}
