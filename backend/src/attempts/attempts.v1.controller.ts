import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SupabaseGuard } from '../auth/supabase.guard';
import { CurrentUser } from '../common/auth/current-user.decorator';
import type { SupabaseJwtClaims } from '../common/auth/supabase-user';
import { AttemptsService } from './attempts.service';
import { AttemptQueryDto } from './dto/attempt-query.dto';
import { SaveAttemptDto } from './dto/save-attempt.dto';

@Controller('api/v1/attempts')
@UseGuards(SupabaseGuard)
export class AttemptsV1Controller {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Post()
  async saveTestAttempt(
    @CurrentUser() user: SupabaseJwtClaims,
    @Body() body: SaveAttemptDto,
  ) {
    const result = await this.attemptsService.saveTestAttempt(user.sub, body);
    return result.attempt;
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
