"use server";

import prisma from "./prisma";
import { revalidatePath } from "next/cache";
import { IeltsReadingTest } from "@/types/ielts";

export async function createTestAction(jsonString: string) {
  try {
    const data = JSON.parse(jsonString) as IeltsReadingTest;
    if (!data.id || !data.title || !data.passages) {
      return { error: "Invalid JSON structure: missing id, title, or passages." };
    }
    
    const existing = await prisma.test.findUnique({ where: { id: data.id } });
    if (existing) {
      return { error: "A test with this ID already exists." };
    }

    await prisma.test.create({
      data: {
        id: data.id,
        title: data.title,
        testCode: data.testCode || '',
        content: data as any
      }
    });

    revalidatePath("/admin/tests");
    revalidatePath("/reading");
    return { success: true, id: data.id };
  } catch (err: any) {
    return { error: "Failed to parse JSON or save to database: " + err.message };
  }
}

export async function deleteTestAction(id: string) {
  try {
    await prisma.test.delete({ where: { id } });
    revalidatePath("/admin/tests");
    revalidatePath("/reading");
    return { success: true };
  } catch (err: any) {
    return { error: "Failed to delete test: " + err.message };
  }
}

export async function updateTestAction(id: string, jsonString: string) {
  try {
    const data = JSON.parse(jsonString) as IeltsReadingTest;
    if (!data.id || !data.title || !data.passages) {
      return { error: "Invalid JSON structure: missing id, title, or passages." };
    }

    await prisma.test.update({
      where: { id },
      data: {
        title: data.title,
        testCode: data.testCode || '',
        content: data as any
      }
    });

    revalidatePath("/admin/tests");
    revalidatePath(`/admin/tests/${id}/edit`);
    revalidatePath(`/reading/${id}`);
    revalidatePath("/reading");
    return { success: true };
  } catch (err: any) {
    return { error: "Failed to parse JSON or update database: " + err.message };
  }
}
