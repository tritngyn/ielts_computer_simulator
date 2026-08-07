import { getAllListeningTests } from "@/lib/data";
import ListeningTestsClient from "./ListeningTestsClient";

export default async function ListeningTestsPage() {
  const tests = await getAllListeningTests();
  return <ListeningTestsClient tests={tests} />;
}
