import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  async getAllReadingTests() {
    const tests = await this.prisma.test.findMany({
      where: { type: 'READING' },
      orderBy: { createdAt: 'desc' },
    });
    return tests.map(t => t.content);
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
    return tests.map(t => t.content);
  }

  async getListeningTestById(id: string) {
    const test = await this.prisma.test.findUnique({
      where: { id, type: 'LISTENING' },
    });
    if (!test) throw new NotFoundException('Test not found');
    return test.content;
  }
}
