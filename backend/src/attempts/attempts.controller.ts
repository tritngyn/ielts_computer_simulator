import { Controller, Post, Get, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { AttemptsService } from './attempts.service';
import { SupabaseGuard } from '../auth/supabase.guard';

@Controller('attempts')
@UseGuards(SupabaseGuard)
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Post()
  saveTestAttempt(@Request() req, @Body() body: any) {
    return this.attemptsService.saveTestAttempt(req.user.sub, body);
  }

  @Get()
  getUserAttempts(@Request() req, @Query('testId') testId?: string) {
    return this.attemptsService.getUserAttempts(req.user.sub, testId);
  }

  @Get(':id')
  getAttemptById(@Request() req, @Param('id') id: string) {
    return this.attemptsService.getAttemptById(req.user.sub, id);
  }
}
