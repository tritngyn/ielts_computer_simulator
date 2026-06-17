import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Cấu hình thư mục chứa các file transcript JSON
// Bạn có thể đổi đường dẫn này nếu bạn lưu transcript ở thư mục khác
const TRANSCRIPT_DIR = path.join(process.cwd(), 'data', 'transcripts');

function getAllJsonFiles(dirPath: string, arrayOfFiles: string[] = []) {
  if (!fs.existsSync(dirPath)) {
    return arrayOfFiles;
  }
  
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllJsonFiles(path.join(dirPath, file), arrayOfFiles);
    } else {
      if (file.endsWith('.json')) {
        arrayOfFiles.push(path.join(dirPath, file));
      }
    }
  });

  return arrayOfFiles;
}

async function main() {
  console.log(`Searching for transcript files in: ${TRANSCRIPT_DIR}`);
  const jsonFiles = getAllJsonFiles(TRANSCRIPT_DIR);
  
  if (jsonFiles.length === 0) {
    console.log('Không tìm thấy file JSON nào. Vui lòng đảm bảo các file transcript được đặt trong thư mục data/transcripts (hoặc sửa lại đường dẫn trong file này).');
    return;
  }

  for (const filePath of jsonFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    try {
      const transcriptData = JSON.parse(content);
      
      // Kiểm tra schema cơ bản
      if (!transcriptData.testCode || !transcriptData.parts) {
        console.warn(`Bỏ qua file ${path.basename(filePath)} vì không đúng định dạng Transcript Schema (thiếu testCode hoặc parts).`);
        continue;
      }

      // Tìm bài test tương ứng trong DB bằng testCode
      const testRecord = await prisma.test.findFirst({
        where: { testCode: transcriptData.testCode }
      });

      if (!testRecord) {
        console.warn(`Không tìm thấy bài thi có testCode là "${transcriptData.testCode}" trong Database. Vui lòng seed bài thi trước khi seed transcript.`);
        continue;
      }

      // Lấy content hiện tại và gộp transcript vào
      const currentContent = testRecord.content as Record<string, any>;
      currentContent.transcript = transcriptData;

      // Update lại vào Database
      await prisma.test.update({
        where: { id: testRecord.id },
        data: {
          content: currentContent
        }
      });

      console.log(`✅ Đã merge thành công transcript vào bài thi: ${testRecord.testCode} (ID: ${testRecord.id})`);
    } catch (e) {
      console.error(`Lỗi khi xử lý file ${filePath}:`, e);
    }
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect();
});
