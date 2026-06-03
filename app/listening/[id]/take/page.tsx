import { notFound } from "next/navigation";
import ListeningTest from "../../ListeningTest";
import { getListeningTestById } from "@/lib/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TakeTestPage({ params }: PageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  const testData = await getListeningTestById(decodedId);

  if (!testData) {
    notFound();
  }

  return <ListeningTest testData={testData} />;
}
