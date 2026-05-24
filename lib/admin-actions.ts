"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { IeltsReadingTest } from "@/types/ielts";

const DATA_DIR = path.join(process.cwd(), "data");

async function findFileById(id: string): Promise<string | null> {
  try {
    const files = await fs.readdir(DATA_DIR);
    for (const file of files) {
      if (file.endsWith(".json")) {
        const filePath = path.join(DATA_DIR, file);
        const content = await fs.readFile(filePath, "utf-8");
        try {
          const data = JSON.parse(content);
          if (data.id === id) return filePath;
        } catch (e) {
          console.error("Parse error on file:", file, e);
        }
      }
    }
  } catch (e) {
    console.error("Error reading dir:", e);
  }
  return null;
}

export async function createTestAction(jsonString: string) {
  try {
    const data = JSON.parse(jsonString) as IeltsReadingTest;
    if (!data.id || !data.title || !data.passages) {
      return { error: "Invalid JSON structure: missing id, title, or passages." };
    }
    
    const existing = await findFileById(data.id);
    if (existing) {
      return { error: "A test with this ID already exists." };
    }

    const filename = data.title.replace(/[^a-z0-9]/gi, '_') + '_Data.json';
    const filePath = path.join(DATA_DIR, filename);

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    revalidatePath("/admin/tests");
    revalidatePath("/reading");
    return { success: true, id: data.id };
  } catch (err: any) {
    return { error: "Failed to parse JSON or write file: " + err.message };
  }
}

export async function deleteTestAction(id: string) {
  const filePath = await findFileById(id);
  if (!filePath) {
    return { error: "Test not found." };
  }
  try {
    await fs.unlink(filePath);
    revalidatePath("/admin/tests");
    revalidatePath("/reading");
    return { success: true };
  } catch (err: any) {
    return { error: "Failed to delete file: " + err.message };
  }
}

export async function updateTestAction(id: string, jsonString: string) {
  const filePath = await findFileById(id);
  if (!filePath) {
    return { error: "Test not found." };
  }
  try {
    const data = JSON.parse(jsonString) as IeltsReadingTest;
    if (!data.id || !data.title || !data.passages) {
      return { error: "Invalid JSON structure: missing id, title, or passages." };
    }

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    revalidatePath("/admin/tests");
    revalidatePath(`/admin/tests/${id}/edit`);
    revalidatePath(`/reading/${id}`);
    revalidatePath("/reading");
    return { success: true };
  } catch (err: any) {
    return { error: "Failed to parse JSON or write file: " + err.message };
  }
}
