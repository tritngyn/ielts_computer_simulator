import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      // Sync user to Prisma database
      const user = data.user;
      try {
        await prisma.user.upsert({
          where: { id: user.id },
          update: {
            email: user.email!,
            avatarUrl: user.user_metadata?.avatar_url || null,
            fullName: user.user_metadata?.full_name || null,
          },
          create: {
            id: user.id,
            email: user.email!,
            avatarUrl: user.user_metadata?.avatar_url || null,
            fullName: user.user_metadata?.full_name || null,
          },
        });
      } catch (err) {
        console.error("Error syncing user to Prisma:", err);
      }

      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
