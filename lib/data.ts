import fs from "fs";
import path from "path";
import { IeltsReadingTest } from "../types/ielts";

const DATA_DIR = path.join(process.cwd(), "data");

export function getAllReadingTests(): IeltsReadingTest[] {
  try {
    const files = fs.readdirSync(DATA_DIR);
    const tests: IeltsReadingTest[] = [];

    for (const file of files) {
      // Avoid reading the old aggregate file if it's still there
      if (file.endsWith(".json") && file !== "ielts_reading_tests.json") {
        const filePath = path.join(DATA_DIR, file);
        const fileContents = fs.readFileSync(filePath, "utf8");
        const data = JSON.parse(fileContents) as IeltsReadingTest;
        tests.push(data);
      }
    }

    return tests;
  } catch (error) {
    console.error("Error reading tests data:", error);
    return [];
  }
}

export function getReadingTestById(id: string): IeltsReadingTest | null {
  const tests = getAllReadingTests();
  return tests.find((test) => test.id === id) || null;
}
