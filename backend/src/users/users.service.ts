import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        attempts: {
          include: { test: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async syncUser(userId: string, email: string, userMetadata: any) {
    try {
      const user = await this.prisma.user.upsert({
        where: { id: userId },
        update: { email },
        create: {
          id: userId,
          email,
          avatarUrl: userMetadata?.avatar_url || null,
          fullName: userMetadata?.full_name || null,
        },
      });
      return { success: true, user };
    } catch (error) {
      throw new InternalServerErrorException('Failed to sync user');
    }
  }

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

