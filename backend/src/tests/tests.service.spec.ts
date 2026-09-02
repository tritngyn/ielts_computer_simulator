import { PrismaService } from '../prisma.service';
import { TestsService } from './tests.service';

describe('TestsService public content boundary', () => {
  const findMany = jest.fn();
  const findUnique = jest.fn();
  const prisma = {
    test: { findMany, findUnique },
  } as unknown as PrismaService;
  const service = new TestsService(prisma);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('removes a legacy answer key before returning a test', async () => {
    findUnique.mockResolvedValue({
      content: {
        id: 'reading-1',
        title: 'Reading test',
        answers: { '1': ['private answer'] },
      },
      publicContent: null,
    });

    await expect(service.getReadingTestById('reading-1')).resolves.toEqual({
      id: 'reading-1',
      title: 'Reading test',
    });
  });

  it('defensively removes an answer key from publicContent', async () => {
    findMany.mockResolvedValue([
      {
        id: 'listening-1',
        content: { answers: { '1': ['legacy answer'] } },
        publicContent: {
          id: 'listening-1',
          title: 'Listening test',
          answers: { '1': ['accidentally copied'] },
        },
      },
    ]);

    await expect(
      service.getAllTestsPage('LISTENING', { limit: 20 }),
    ).resolves.toEqual({
      data: [{ id: 'listening-1', title: 'Listening test' }],
      pageInfo: { hasNextPage: false, endCursor: 'listening-1' },
    });
  });
});
