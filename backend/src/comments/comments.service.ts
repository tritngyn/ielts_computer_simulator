import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type { SupabaseUserMetadata } from '../common/auth/supabase-user';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

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

  async getCommentsPage(testId: string, query: PaginationQueryDto) {
    const comments = await this.prisma.comment.findMany({
      where: { testId },
      include: {
        user: { select: { fullName: true, avatarUrl: true } },
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: query.limit + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
    });
    const hasNextPage = comments.length > query.limit;
    const data = hasNextPage ? comments.slice(0, query.limit) : comments;
    return {
      data,
      pageInfo: {
        hasNextPage,
        endCursor: data.at(-1)?.id ?? null,
      },
    };
  }

  async createComment(
    userId: string,
    testId: string,
    content: string,
    email?: string,
    userMetadata?: SupabaseUserMetadata,
  ) {
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
    } catch {
      throw new InternalServerErrorException('Failed to create comment.');
    }
  }
}
