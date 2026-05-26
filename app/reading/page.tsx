import { getAllReadingTests } from "@/lib/data";
import ReadingListClient from "./ReadingListClient";

export default async function ReadingPage() {
  const tests = await getAllReadingTests();

  return <ReadingListClient tests={tests} />;
}
