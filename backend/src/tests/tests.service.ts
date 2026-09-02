import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  async getAllReadingTests() {
    const tests = await this.prisma.test.findMany({
      where: { type: 'READING' },
      orderBy: { createdAt: 'desc' },
    });
    return tests.map((t) => t.content);
  }

  async getReadingTestById(id: string) {
    const test = await this.prisma.test.findUnique({
      where: { id, type: 'READING' },
    });
    if (!test) throw new NotFoundException('Test not found');
    return test.content;
  }

  async getAllListeningTests() {
    const tests = await this.prisma.test.findMany({
      where: { type: 'LISTENING' },
      orderBy: { createdAt: 'desc' },
    });
    return tests.map((t) => t.content);
  }

  async getAllTestsPage(type: string, query: PaginationQueryDto) {
    const tests = await this.prisma.test.findMany({
      where: { type },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: query.limit + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      select: { id: true, content: true },
    });
    const hasNextPage = tests.length > query.limit;
    const page = hasNextPage ? tests.slice(0, query.limit) : tests;
    return {
      data: page.map((test) => test.content),
      pageInfo: {
        hasNextPage,
        endCursor: page.at(-1)?.id ?? null,
      },
    };
  }

  async getListeningTestById(id: string) {
    const test = await this.prisma.test.findUnique({
      where: { id, type: 'LISTENING' },
    });
    if (!test) throw new NotFoundException('Test not found');
    return test.content;
  }
}
