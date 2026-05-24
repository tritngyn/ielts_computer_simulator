import { getAllReadingTests } from "@/lib/data";
import AdminTestListClient from "./AdminTestListClient";

export default function AdminTestsPage() {
  const tests = getAllReadingTests();

  return <AdminTestListClient tests={tests} />;
}
