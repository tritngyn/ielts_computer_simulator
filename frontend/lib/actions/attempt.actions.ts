"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function saveTestAttempt(data: {
  testId: string;
  score: number;
  totalQuestions: number;
  timeTakenSeconds: number;
  mode: string;
  userAnswers?: Record<string, string>;
}) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("You must be logged in to save an attempt.");
  }

  try {
    const response = await fetch(`${API_URL}/attempts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to save attempt");
    }

    const result = await response.json();
    
    revalidatePath(`/reading/${data.testId}`);
    revalidatePath(`/profile`);
    return result;
  } catch (error) {
    console.error("Failed to save test attempt:", error);
    return { error: "Failed to save attempt." };
  }
}

export async function getUserAttempts(testId?: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return [];
  }

  try {
    const url = testId ? `${API_URL}/attempts?testId=${testId}` : `${API_URL}/attempts`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      },
      cache: 'no-store'
    });

    if (!response.ok) return [];
    return response.json();
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
    const response = await fetch(`${API_URL}/attempts/${attemptId}`, {
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

