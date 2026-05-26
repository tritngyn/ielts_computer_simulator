import { notFound } from "next/navigation";
import TestLandingClient from "./TestLandingClient";
import { getReadingTestById } from "@/lib/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TestPage({ params }: PageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  const testData = await getReadingTestById(decodedId);

  if (!testData) {
    notFound();
  }

  return <TestLandingClient testData={testData} />;
}
