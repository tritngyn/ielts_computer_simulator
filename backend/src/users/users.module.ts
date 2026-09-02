import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersV1Controller } from './users.v1.controller';

@Module({
  controllers: [UsersController, UsersV1Controller],
  providers: [UsersService],
})
export class UsersModule {}
