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
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('api/v1/comments')
export class CommentsV1Controller {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('test/:testId')
  getCommentsByTestId(
    @Param('testId') testId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.commentsService.getCommentsPage(testId, query);
  }

  @Post()
  @UseGuards(SupabaseGuard)
  async createComment(
    @CurrentUser() user: SupabaseJwtClaims,
    @Body() body: CreateCommentDto,
  ) {
    const result = await this.commentsService.createComment(
      user.sub,
      body.testId,
      body.content,
      user.email,
      user.user_metadata,
    );
    return result.comment;
  }
}
