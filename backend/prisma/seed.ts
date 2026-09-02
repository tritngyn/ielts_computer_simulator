import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const demoReadingTest = {
  id: 'demo-reading-001',
  testCode: 'DEMO-READING-001',
  title: 'Portfolio Demo Reading Test',
  passages: [
    {
      passageNumber: 1,
      title: 'Building Reliable Learning Software',
      subtitle: null,
      contentHTML:
        '<p>Reliable learning software keeps business rules on the server and verifies changes with automated tests.</p>',
      questionGroups: [
        {
          id: 'demo-group-1',
          type: 'TRUE_FALSE_NOT_GIVEN',
          instructions: 'Choose TRUE, FALSE, or NOT GIVEN.',
          groupContentHTML: null,
          sharedOptions: ['TRUE', 'FALSE', 'NOT GIVEN'],
          questions: [
            {
              id: 'demo-question-1',
              number: 1,
              text: 'Business rules should be verified with automated tests.',
              options: ['TRUE', 'FALSE', 'NOT GIVEN'],
            },
          ],
        },
      ],
    },
  ],
  answers: {
    '1': ['TRUE'],
  },
} satisfies Prisma.JsonObject;

const { answers: demoAnswerKey, ...demoPublicContent } = demoReadingTest;

async function main(): Promise<void> {
  await prisma.test.upsert({
    where: { id: demoReadingTest.id },
    update: {
      title: demoReadingTest.title,
      testCode: demoReadingTest.testCode,
      type: 'READING',
      content: demoReadingTest,
      publicContent: demoPublicContent,
      answerKey: demoAnswerKey,
    },
    create: {
      id: demoReadingTest.id,
      title: demoReadingTest.title,
      testCode: demoReadingTest.testCode,
      type: 'READING',
      content: demoReadingTest,
      publicContent: demoPublicContent,
      answerKey: demoAnswerKey,
    },
  });

  console.log(`Seeded ${demoReadingTest.id}`);
}

main()
  .catch((error: unknown) => {
    console.error('Database seed failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
