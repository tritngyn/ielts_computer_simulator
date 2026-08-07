"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getCommentsByTestId(testId: string) {
  try {
    const response = await fetch(`${API_URL}/comments/test/${testId}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error("Failed to get comments:", error);
    return [];
  }
}

export async function createComment(testId: string, content: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("You must be logged in to comment.");
  }

  try {
    const response = await fetch(`${API_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ testId, content }),
    });

    if (!response.ok) {
      throw new Error("Failed to create comment");
    }

    const result = await response.json();
    revalidatePath(`/reading/${testId}`);
    return result;
  } catch (error) {
    console.error("Failed to create comment:", error);
    return { error: "Failed to create comment." };
  }
}

