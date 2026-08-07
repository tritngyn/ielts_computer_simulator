import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const usersCount = await prisma.user.count();
  const attemptsCount = await prisma.attempt.count();
  const commentsCount = await prisma.comment.count();

  console.log(`\n=== DATABASE STATUS ===`);
  console.log(`Users: ${usersCount}`);
  console.log(`Attempts: ${attemptsCount}`);
  console.log(`Comments: ${commentsCount}`);
  
  if (commentsCount > 0) {
    const latestComment = await prisma.comment.findFirst({
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    });
    console.log(`\nLatest Comment:`, latestComment);
  }

  if (attemptsCount > 0) {
    const latestAttempt = await prisma.attempt.findFirst({
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    });
    console.log(`\nLatest Attempt:`, latestAttempt);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
