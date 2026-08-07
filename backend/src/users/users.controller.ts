import { Controller, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { SupabaseGuard } from '../auth/supabase.guard';

@Controller('users')
@UseGuards(SupabaseGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('profile')
  updateProfile(@Request() req, @Body() body: { fullName?: string; avatarUrl?: string }) {
    return this.usersService.updateProfile(req.user.sub, body.fullName, body.avatarUrl);
  }
}
