export function getSupabaseMediaUrl(testCode: string | undefined, localPath: string): string {
  if (!testCode || !localPath) return localPath;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const bucketName = 'test-media';

  // localPath thường có dạng: "media/audio_part1.mp3" hoặc "media/img_part2_1.jpg"
  // Ta chỉ cần lấy tên file phía sau thư mục "media/"
  const fileName = localPath.split('/').pop();

  if (!fileName) return localPath;

  // Trả về public url: https://[url]/storage/v1/object/public/test-media/[testCode]/[fileName]
  return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${testCode}/${fileName}`;
}
