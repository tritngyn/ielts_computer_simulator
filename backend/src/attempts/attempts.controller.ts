import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { AttemptsService } from './attempts.service';
import { SupabaseGuard } from '../auth/supabase.guard';
import { CurrentUser } from '../common/auth/current-user.decorator';
import type { SupabaseJwtClaims } from '../common/auth/supabase-user';
import { LegacySubmitAttemptDto } from './dto/submit-attempt.dto';

@Controller('attempts')
@UseGuards(SupabaseGuard)
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Post()
  saveTestAttempt(
    @CurrentUser() user: SupabaseJwtClaims,
    @Body() body: LegacySubmitAttemptDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.attemptsService
      .saveTestAttempt(user.sub, body, idempotencyKey ?? randomUUID())
      .then((attempt) => ({ success: true, attempt }));
  }

  @Get()
  getUserAttempts(
    @CurrentUser() user: SupabaseJwtClaims,
    @Query('testId') testId?: string,
  ) {
    return this.attemptsService.getUserAttempts(user.sub, testId);
  }

  @Get(':id')
  getAttemptById(
    @CurrentUser() user: SupabaseJwtClaims,
    @Param('id') id: string,
  ) {
    return this.attemptsService.getAttemptById(user.sub, id);
  }
}
