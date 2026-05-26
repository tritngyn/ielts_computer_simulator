import { notFound } from "next/navigation";
import IELTSTest from "../IetlsTest";
import { getReadingTestById } from "@/lib/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TakeTestPage({ params }: PageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  const testData = await getReadingTestById(decodedId);

  if (!testData) {
    notFound();
  }

  return <IELTSTest testData={testData} />;
}
