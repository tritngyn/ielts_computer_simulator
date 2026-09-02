"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface CommentResponse {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
  user: {
    fullName: string | null;
    avatarUrl: string | null;
  } | null;
}

export async function getCommentsByTestId(testId: string): Promise<CommentResponse[]> {
  try {
    const response = await fetch(`${API_URL}/api/v1/comments/test/${encodeURIComponent(testId)}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) return [];
    const result = await response.json();
    return Array.isArray(result.data) ? result.data as CommentResponse[] : [];
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
    const response = await fetch(`${API_URL}/api/v1/comments`, {
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

