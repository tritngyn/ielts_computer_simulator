import { notFound } from "next/navigation";
import ListeningTestLandingClient from "./ListeningTestLandingClient";
import { getListeningTestById } from "@/lib/data";
import { createClient } from "@/utils/supabase/server";
import { getUserAttempts } from "@/lib/actions/attempt.actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ListeningTestPage({ params }: PageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  const testData = await getListeningTestById(decodedId);

  if (!testData) {
    notFound();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const attempts = await getUserAttempts(testData.id);

  return <ListeningTestLandingClient testData={testData} user={user} dbAttempts={attempts} />;
}
