import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsV1Controller } from './comments.v1.controller';

@Module({
  controllers: [CommentsController, CommentsV1Controller],
  providers: [CommentsService],
})
export class CommentsModule {}
