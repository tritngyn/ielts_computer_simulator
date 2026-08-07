"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export async function getCommentsByTestId(testId: string) {
  try {
    const comments = await prisma.comment.findMany({
      where: { testId },
      include: {
        user: {
          select: {
            fullName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return comments;
  } catch (error) {
    console.error("Failed to get comments:", error);
    return [];
  }
}

export async function createComment(testId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to comment.");
  }

  // Fetch the user from prisma to get the authorName
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  const authorName = dbUser?.fullName || user.user_metadata?.full_name || user.email?.split("@")[0] || "Unknown User";

  try {
    const comment = await prisma.comment.create({
      data: {
        testId,
        userId: user.id,
        content,
        authorName,
      },
    });

    revalidatePath(`/reading/${testId}`);
    return { success: true, comment };
  } catch (error) {
    console.error("Failed to create comment:", error);
    return { error: "Failed to create comment." };
  }
}
