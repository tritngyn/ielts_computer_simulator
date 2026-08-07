import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function updateData() {
  const filePath = path.join(process.cwd(), 'data', 'Cambridge_Ielts_16_Reading_Test_1_Data2.json');
  const fileData = fs.readFileSync(filePath, 'utf-8');
  const testData = JSON.parse(fileData);

  // Xóa test cũ nếu có
  await prisma.test.deleteMany({
    where: { testCode: testData.testCode }
  });

  // Tạo test mới
  const test = await prisma.test.create({
    data: {
      id: testData.id,
      testCode: testData.testCode,
      title: testData.title,
      content: testData, 
    },
  });

  console.log('Update success!', test.id);
}

updateData()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
