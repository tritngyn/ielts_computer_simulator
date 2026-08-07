import { Controller, Get, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { SupabaseGuard } from '../auth/supabase.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('test/:testId')
  getCommentsByTestId(@Param('testId') testId: string) {
    return this.commentsService.getCommentsByTestId(testId);
  }

  @Post()
  @UseGuards(SupabaseGuard)
  createComment(@Request() req, @Body() body: { testId: string; content: string }) {
    return this.commentsService.createComment(
      req.user.sub,
      body.testId,
      body.content,
      req.user.email,
      req.user.user_metadata
    );
  }
}
