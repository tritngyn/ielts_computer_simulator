import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY, // Dùng Service Role Key để tránh bị chặn mã hóa
  );

  // Thực hiện một truy vấn bất kỳ lên một bảng có sẵn trong DB của bạn
  // Ví dụ: Lấy thử 1 bản ghi từ bảng 'profiles' hoặc 'ielts_lessons'
  const { data, error } = await supabase.from("profiles").select("id").limit(1);

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, message: "Database is awake!" });
}
