import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Get environment variables (Node 20+ supports --env-file=.env)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)
const BUCKET_NAME = 'test-media'

function getMimeType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase()
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.png':
      return 'image/png'
    case '.mp3':
      return 'audio/mpeg'
    case '.svg':
      return 'image/svg+xml'
    default:
      return 'application/octet-stream'
  }
}

// Tìm đệ quy tất cả các file media (.mp3, .jpg, .png...)
function getAllMediaFiles(dirPath: string, arrayOfFiles: string[] = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles

  const files = fs.readdirSync(dirPath)

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file)
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllMediaFiles(fullPath, arrayOfFiles)
    } else {
      const ext = path.extname(file).toLowerCase()
      if (['.jpg', '.jpeg', '.png', '.mp3', '.svg'].includes(ext)) {
        arrayOfFiles.push(fullPath)
      }
    }
  })

  return arrayOfFiles
}

async function main() {
  const dataDir = path.join(process.cwd(), 'data')
  
  // Lấy tất cả các file ảnh/audio trong thư mục data
  const mediaFiles = getAllMediaFiles(dataDir)

  for (const filePath of mediaFiles) {
    // filePath dạng: ...\data\CAMBRIDGE_IELTS_16_LISTENING_TEST_1\media\audio_part1.mp3
    // Cần trích xuất để đường dẫn trên bucket là: CAMBRIDGE_IELTS_16_LISTENING_TEST_1/audio_part1.mp3
    
    // Tìm thư mục gốc của bài test (nằm ngay dưới thư mục data)
    const relativePath = path.relative(dataDir, filePath)
    const parts = relativePath.split(path.sep)
    const testCode = parts[0]
    const fileName = parts[parts.length - 1]
    
    // Định dạng: CAMBRIDGE_IELTS_16_LISTENING_TEST_1/img_part1.jpg
    const storagePath = `${testCode}/${fileName}`

    const fileBuffer = fs.readFileSync(filePath)
    const mimeType = getMimeType(filePath)

    console.log(`Uploading ${storagePath}...`)

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType: mimeType,
        upsert: true // Ghi đè nếu file đã tồn tại
      })

    if (error) {
      console.error(`Failed to upload ${storagePath}:`, error.message)
    } else {
      console.log(`✅ Success: ${storagePath}`)
    }
  }
  
  console.log("🎉 Hoàn tất quá trình upload media!")
}

main().catch(console.error)
