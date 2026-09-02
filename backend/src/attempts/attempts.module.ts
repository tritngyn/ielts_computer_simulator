import { Module } from '@nestjs/common';
import { AttemptsController } from './attempts.controller';
import { AttemptsService } from './attempts.service';
import { AttemptsV1Controller } from './attempts.v1.controller';

@Module({
  controllers: [AttemptsController, AttemptsV1Controller],
  providers: [AttemptsService],
})
export class AttemptsModule {}
