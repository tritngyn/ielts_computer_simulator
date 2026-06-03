import { notFound } from "next/navigation";
import ListeningTestLandingClient from "./ListeningTestLandingClient";
import { getListeningTestById } from "@/lib/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TestPage({ params }: PageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  const testData = await getListeningTestById(decodedId);

  if (!testData) {
    notFound();
  }

  return <ListeningTestLandingClient testData={testData} />;
}
