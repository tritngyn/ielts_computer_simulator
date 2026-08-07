import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async getCommentsByTestId(testId: string) {
    return this.prisma.comment.findMany({
      where: { testId },
      include: {
        user: {
          select: {
            fullName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createComment(userId: string, testId: string, content: string, email: string, userMetadata: any) {
    // Fetch the user from prisma to get the authorName
    const dbUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const authorName =
      dbUser?.fullName ||
      userMetadata?.full_name ||
      email?.split('@')[0] ||
      'Unknown User';

    try {
      const comment = await this.prisma.comment.create({
        data: {
          testId,
          userId,
          content,
          authorName,
        },
      });
      return { success: true, comment };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create comment.');
    }
  }
}
