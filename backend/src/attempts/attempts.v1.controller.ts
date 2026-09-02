import {
  Body,
  BadRequestException,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { SupabaseGuard } from '../auth/supabase.guard';
import { CurrentUser } from '../common/auth/current-user.decorator';
import type { SupabaseJwtClaims } from '../common/auth/supabase-user';
import { AttemptsService } from './attempts.service';
import { AttemptQueryDto } from './dto/attempt-query.dto';
import { SubmitAttemptDto } from './dto/submit-attempt.dto';

@Controller('api/v1/attempts')
@UseGuards(SupabaseGuard)
export class AttemptsV1Controller {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Post()
  async saveTestAttempt(
    @CurrentUser() user: SupabaseJwtClaims,
    @Body() body: SubmitAttemptDto,
    @Headers('idempotency-key')
    idempotencyKey: string,
  ) {
    if (!idempotencyKey || !isUUID(idempotencyKey, '4')) {
      throw new BadRequestException('Idempotency-Key must be a UUID v4');
    }
    return this.attemptsService.saveTestAttempt(user.sub, body, idempotencyKey);
  }

  @Get()
  getUserAttempts(
    @CurrentUser() user: SupabaseJwtClaims,
    @Query() query: AttemptQueryDto,
  ) {
    return this.attemptsService.getUserAttemptsPage(user.sub, query);
  }

  @Get(':id')
  getAttemptById(
    @CurrentUser() user: SupabaseJwtClaims,
    @Param('id') id: string,
  ) {
    return this.attemptsService.getAttemptById(user.sub, id);
  }
}
