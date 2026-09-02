import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  async getAllReadingTests() {
    const tests = await this.prisma.test.findMany({
      where: { type: 'READING' },
      orderBy: { createdAt: 'desc' },
      select: { content: true, publicContent: true },
    });
    return tests.map((test) => this.toPublicContent(test));
  }

  async getReadingTestById(id: string) {
    const test = await this.prisma.test.findUnique({
      where: { id, type: 'READING' },
      select: { content: true, publicContent: true },
    });
    if (!test) throw new NotFoundException('Test not found');
    return this.toPublicContent(test);
  }

  async getAllListeningTests() {
    const tests = await this.prisma.test.findMany({
      where: { type: 'LISTENING' },
      orderBy: { createdAt: 'desc' },
      select: { content: true, publicContent: true },
    });
    return tests.map((test) => this.toPublicContent(test));
  }

  async getAllTestsPage(type: string, query: PaginationQueryDto) {
    const tests = await this.prisma.test.findMany({
      where: { type },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: query.limit + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      select: { id: true, content: true, publicContent: true },
    });
    const hasNextPage = tests.length > query.limit;
    const page = hasNextPage ? tests.slice(0, query.limit) : tests;
    return {
      data: page.map((test) => this.toPublicContent(test)),
      pageInfo: {
        hasNextPage,
        endCursor: page.at(-1)?.id ?? null,
      },
    };
  }

  async getListeningTestById(id: string) {
    const test = await this.prisma.test.findUnique({
      where: { id, type: 'LISTENING' },
      select: { content: true, publicContent: true },
    });
    if (!test) throw new NotFoundException('Test not found');
    return this.toPublicContent(test);
  }

  private toPublicContent(test: {
    content: Prisma.JsonValue;
    publicContent: Prisma.JsonValue | null;
  }): Prisma.JsonValue {
    if (test.publicContent) return test.publicContent;
    if (
      !test.content ||
      Array.isArray(test.content) ||
      typeof test.content !== 'object'
    ) {
      return test.content;
    }
    const publicContent = { ...test.content };
    delete publicContent.answers;
    return publicContent;
  }
}
