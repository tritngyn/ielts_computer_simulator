import {
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class SaveAttemptDto {
  @IsString()
  @MaxLength(128)
  testId!: string;

  @IsInt()
  @Min(0)
  score!: number;

  @IsInt()
  @Min(1)
  totalQuestions!: number;

  @IsInt()
  @Min(0)
  timeTakenSeconds!: number;

  @IsString()
  @MaxLength(50)
  mode!: string;

  @IsOptional()
  @IsObject()
  userAnswers?: Record<string, string>;
}
