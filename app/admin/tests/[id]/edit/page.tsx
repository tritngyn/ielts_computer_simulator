import { notFound } from "next/navigation";
import { getReadingTestById } from "@/lib/data";
import EditTestClient from "./EditTestClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTestPage({ params }: PageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  const testData = await getReadingTestById(decodedId);

  if (!testData) {
    notFound();
  }

  return <EditTestClient testData={testData} />;
}
