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
}: {
  testId: string;
  score: number;
  totalQuestions: number;
  timeTakenSeconds: number;
  mode: string;
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
