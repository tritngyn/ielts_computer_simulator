import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { SupabaseGuard } from '../auth/supabase.guard';
import { CurrentUser } from '../common/auth/current-user.decorator';
import type { SupabaseJwtClaims } from '../common/auth/supabase-user';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@Controller('api/v1/users')
@UseGuards(SupabaseGuard)
export class UsersV1Controller {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@CurrentUser() user: SupabaseJwtClaims) {
    return this.usersService.getProfile(user.sub);
  }

  @Post('sync')
  async syncUser(@CurrentUser() user: SupabaseJwtClaims) {
    const result = await this.usersService.syncUser(
      user.sub,
      user.email,
      user.user_metadata,
    );
    return result.user;
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: SupabaseJwtClaims,
    @Body() body: UpdateProfileDto,
  ) {
    const result = await this.usersService.updateProfile(
      user.sub,
      body.fullName,
      body.avatarUrl,
    );
    return result.user;
  }
}
