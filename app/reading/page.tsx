import { getAllReadingTests } from "@/lib/data";
import ReadingListClient from "./ReadingListClient";

export default function ReadingPage() {
  const tests = getAllReadingTests();

  return <ReadingListClient tests={tests} />;
}
