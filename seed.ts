import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  const dataDir = path.join(process.cwd(), 'data')
  const files = fs.readdirSync(dataDir)
  
  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(dataDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      try {
        const data = JSON.parse(content)
        if (data.id && data.title) {
          await prisma.test.upsert({
            where: { id: data.id },
            update: {
              title: data.title,
              testCode: data.testCode || '',
              content: data
            },
            create: {
              id: data.id,
              title: data.title,
              testCode: data.testCode || '',
              content: data
            }
          })
          console.log(`Seeded: ${data.id}`)
        }
      } catch (e) {
        console.error(`Error processing ${file}:`, e)
      }
    }
  }
}

main().catch(e => {
  console.error(e)
  process.exit(1)
}).finally(() => {
  prisma.$disconnect()
})
