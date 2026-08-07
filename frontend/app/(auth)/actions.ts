"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function syncUserWithBackend(token: string) {
  try {
    const res = await fetch(`${API_URL}/users/sync`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) {
      console.error("Failed to sync user with backend API");
    }
  } catch (err) {
    console.error("Backend API sync error:", err);
  }
}

export async function syncUser() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session?.access_token) {
    await syncUserWithBackend(session.access_token);
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
  
  if (error) {
    return { error: error.message };
  }

  // Sync user to Backend on login
  if (data?.session?.access_token) {
    await syncUserWithBackend(data.session.access_token);
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
  // Sync user to Backend on signup
  if (data?.session?.access_token) {
    await syncUserWithBackend(data.session.access_token);
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

export async function signInWithOAuth(provider: "google") {
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get("origin");
  
  // The redirect callback URL should point to your callback route
  // If origin is present (called from browser), use it. Otherwise fallback to env variable or localhost
  const baseUrl = origin || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const redirectUrl = `${baseUrl}/auth/callback`;
  
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
