import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

import { NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  // Đã bật lại middleware/proxy của Supabase để session hoạt động chính xác
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
