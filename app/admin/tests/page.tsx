import { getAllReadingTests } from "@/lib/data";
import AdminTestListClient from "./AdminTestListClient";

export default async function AdminTestsPage() {
  const tests = await getAllReadingTests();

  return <AdminTestListClient tests={tests} />;
}
