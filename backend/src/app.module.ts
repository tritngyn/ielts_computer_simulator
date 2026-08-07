import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { TestsModule } from './tests/tests.module';
import { AttemptsModule } from './attempts/attempts.module';
import { CommentsModule } from './comments/comments.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, TestsModule, AttemptsModule, CommentsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
