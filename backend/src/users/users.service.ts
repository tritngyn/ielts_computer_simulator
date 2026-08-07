import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async updateProfile(userId: string, fullName?: string, avatarUrl?: string) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...(fullName && { fullName }),
          ...(avatarUrl && { avatarUrl }),
        },
      });
      return { success: true, user: updatedUser };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update profile');
    }
  }
}
