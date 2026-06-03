import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// Hàm tìm tất cả file .json đệ quy trong thư mục
function getAllJsonFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = fs.readdirSync(dirPath)

  files.forEach((file) => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllJsonFiles(path.join(dirPath, file), arrayOfFiles)
    } else {
      if (file.endsWith('.json')) {
        arrayOfFiles.push(path.join(dirPath, file))
      }
    }
  })

  return arrayOfFiles
}

async function main() {
  const dataDir = path.join(process.cwd(), 'data')
  
  // Tìm tất cả các file .json trong thư mục data và các thư mục con
  const jsonFiles = getAllJsonFiles(dataDir)
  
  for (const filePath of jsonFiles) {
    const content = fs.readFileSync(filePath, 'utf-8')
    try {
      const data = JSON.parse(content)
      
      if (data.id && data.title) {
        // Tự động nhận diện type dựa vào cấu trúc JSON
        // Nếu có "parts", đây là Listening. Nếu có "passages", đây là Reading.
        let testType = "READING"
        if (data.parts) {
          testType = "LISTENING"
        }

        await prisma.test.upsert({
          where: { id: data.id },
          update: {
            title: data.title,
            testCode: data.testCode || '',
            type: testType,
            content: data
          },
          create: {
            id: data.id,
            title: data.title,
            testCode: data.testCode || '',
            type: testType,
            content: data
          }
        })
        console.log(`Seeded: ${data.id} (Type: ${testType})`)
      }
    } catch (e) {
      console.error(`Error processing ${filePath}:`, e)
    }
  }
}

main().catch(e => {
  console.error(e)
  process.exit(1)
}).finally(() => {
  prisma.$disconnect()
})
