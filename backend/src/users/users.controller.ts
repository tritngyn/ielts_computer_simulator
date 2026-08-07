import { Controller, Get, Post, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { SupabaseGuard } from '../auth/supabase.guard';

@Controller('users')
@UseGuards(SupabaseGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.sub);
  }

  @Post('sync')
  syncUser(@Request() req) {
    return this.usersService.syncUser(
      req.user.sub,
      req.user.email,
      req.user.user_metadata,
    );
  }

  @Patch('profile')
  updateProfile(@Request() req, @Body() body: { fullName?: string; avatarUrl?: string }) {
    return this.usersService.updateProfile(req.user.sub, body.fullName, body.avatarUrl);
  }
}

