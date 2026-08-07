"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export async function saveTestAttempt({
  testId,
  score,
  totalQuestions,
  timeTakenSeconds,
  mode,
  userAnswers,
}: {
  testId: string;
  score: number;
  totalQuestions: number;
  timeTakenSeconds: number;
  mode: string;
  userAnswers?: Record<string, string>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to save an attempt.");
  }

  try {
    const attempt = await prisma.attempt.create({
      data: {
        testId,
        userId: user.id,
        score,
        totalQuestions,
        timeTakenSeconds,
        mode,
        userAnswers: userAnswers || undefined,
      },
    });
    
    revalidatePath(`/reading/${testId}`);
    revalidatePath(`/profile`);
    return { success: true, attempt };
  } catch (error) {
    console.error("Failed to save test attempt:", error);
    return { error: "Failed to save attempt." };
  }
}

export async function getUserAttempts(testId?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  try {
    const whereClause = testId ? { userId: user.id, testId } : { userId: user.id };
    
    const attempts = await prisma.attempt.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });
    
    return attempts;
  } catch (error) {
    console.error("Failed to get user attempts:", error);
    return [];
  }
}

export async function getAttemptById(attemptId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  try {
    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
      include: {
        test: true, // we might need test info
      }
    });

    // Make sure the attempt belongs to the user
    if (attempt && attempt.userId === user.id) {
      return attempt;
    }
    return null;
  } catch (error) {
    console.error("Failed to get attempt:", error);
    return null;
  }
}

