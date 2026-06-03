import prisma from "./prisma";
import { IeltsReadingTest } from "../types/ielts";
import { IeltsListeningTest } from "../types/listening";

export async function getAllReadingTests(): Promise<IeltsReadingTest[]> {
  try {
    const tests = await prisma.test.findMany({
      where: { type: 'READING' },
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

export async function getAllListeningTests(): Promise<IeltsListeningTest[]> {
  try {
    const tests = await prisma.test.findMany({
      where: { type: 'LISTENING' },
      orderBy: { createdAt: 'desc' }
    });
    return tests.map(t => t.content as unknown as IeltsListeningTest);
  } catch (error) {
    console.error("Error fetching listening tests from DB:", error);
    return [];
  }
}

export async function getListeningTestById(id: string): Promise<IeltsListeningTest | null> {
  try {
    const test = await prisma.test.findUnique({
      where: { id }
    });
    return test ? (test.content as unknown as IeltsListeningTest) : null;
  } catch (error) {
    console.error("Error fetching listening test by ID:", error);
    return null;
  }
}
