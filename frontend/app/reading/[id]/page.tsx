import { notFound } from "next/navigation";
import TestLandingClient from "./TestLandingClient";
import { getReadingTestById } from "@/lib/data";
import { createClient } from "@/utils/supabase/server";
import { getUserAttempts } from "@/lib/actions/attempt.actions";

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

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch attempts from DB if user is logged in
  const attempts = await getUserAttempts(testData.id);

  return <TestLandingClient testData={testData} user={user} dbAttempts={attempts} />;
}
