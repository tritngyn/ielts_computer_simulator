import prisma from "./prisma";
import { IeltsReadingTest } from "../types/ielts";

export async function getAllReadingTests(): Promise<IeltsReadingTest[]> {
  try {
    const tests = await prisma.test.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return tests.map(t => t.content as unknown as IeltsReadingTest);
  } catch (error) {
    console.error("Error fetching tests from DB:", error);
    return [];
  }
}

export async function getReadingTestById(id: string): Promise<IeltsReadingTest | null> {
  try {
    const test = await prisma.test.findUnique({
      where: { id }
    });
    return test ? (test.content as unknown as IeltsReadingTest) : null;
  } catch (error) {
    console.error("Error fetching test by ID:", error);
    return null;
  }
}
