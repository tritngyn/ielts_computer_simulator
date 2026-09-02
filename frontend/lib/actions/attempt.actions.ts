"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type { GradedAttempt } from "@/types/attempt";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function saveTestAttempt(data: {
  testId: string;
  timeTakenSeconds: number;
  mode: 'practice' | 'simulation';
  userAnswers: Record<string, string>;
}, idempotencyKey: string): Promise<
  | { ok: true; attempt: GradedAttempt }
  | { ok: false; error: string }
> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return { ok: false, error: "You must be logged in to save an attempt." };
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/attempts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json() as GradedAttempt & {
      error?: { message?: string };
    };
    if (!response.ok) {
      throw new Error(result?.error?.message || "Failed to save attempt");
    }
    
    revalidatePath(`/reading/${data.testId}`);
    revalidatePath(`/profile`);
    return { ok: true, attempt: result };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save attempt.";
    console.error("Failed to save test attempt:", message);
    return { ok: false, error: message };
  }
}

export async function getUserAttempts(testId?: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return [];
  }

  try {
    const url = testId
      ? `${API_URL}/api/v1/attempts?testId=${encodeURIComponent(testId)}`
      : `${API_URL}/api/v1/attempts`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      },
      cache: 'no-store'
    });

    if (!response.ok) return [];
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Failed to get user attempts:", error);
    return [];
  }
}

export async function getAttemptById(attemptId: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/attempts/${encodeURIComponent(attemptId)}`, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      },
      cache: 'no-store'
    });

    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Failed to get attempt:", error);
    return null;
  }
}

