import { Module } from '@nestjs/common';
import { TestsService } from './tests.service';
import { TestsV1Controller } from './tests.v1.controller';
import { TestsController } from './tests.controller';

@Module({
  controllers: [TestsController, TestsV1Controller],
  providers: [TestsService],
})
export class TestsModule {}
