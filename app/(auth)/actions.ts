"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";

export async function syncUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    try {
      await prisma.user.upsert({
        where: { id: user.id },
        update: { email: user.email! },
        create: {
          id: user.id,
          email: user.email!,
          avatarUrl: user.user_metadata?.avatar_url || null,
          fullName: user.user_metadata?.full_name || null,
        },
      });
    } catch (err) {
      console.error("Prisma sync error:", err);
    }
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  console.log("Login action result:", { success: !error, error: error?.message, user: data?.user?.id });

  if (error) {
    return { error: error.message };
  }

  // Sync user to Prisma on login
  if (data?.user) {
    try {
      await prisma.user.upsert({
        where: { id: data.user.id },
        update: {},
        create: {
          id: data.user.id,
          email: data.user.email!,
        },
      });
    } catch (err) {
      console.error("Prisma sync error on login:", err);
    }
  }

  revalidatePath("/", "layout");
  revalidatePath("/");
  return { success: true };
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }
  // Sync user to Prisma on signup
  if (data?.user) {
    try {
      await prisma.user.upsert({
        where: { id: data.user.id },
        update: {},
        create: {
          id: data.user.id,
          email: data.user.email!,
        },
      });
    } catch (err) {
      console.error("Prisma sync error on signup:", err);
    }
  }

  revalidatePath("/", "layout");
  revalidatePath("/");
  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  revalidatePath("/");
  return { success: true };
}

export async function signInWithOAuth(provider: "google" | "github") {
  const supabase = await createClient();
  
  // The redirect callback URL should point to your callback route
  const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`;
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectUrl,
    },
  });

  if (error) {
    console.error("OAuth error:", error);
    return { error: error.message };
  }
  
  if (data.url) {
    redirect(data.url);
  }
}
