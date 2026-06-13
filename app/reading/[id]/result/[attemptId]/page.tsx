import { notFound, redirect } from "next/navigation";
import { getReadingTestById } from "@/lib/data";
import { getAttemptById } from "@/lib/actions/attempt.actions";
import { createClient } from "@/utils/supabase/server";
import TestResultView from "../../TestResultView";

interface PageProps {
  params: Promise<{ id: string; attemptId: string }>;
}

export default async function PastAttemptResultPage({ params }: PageProps) {
  const { id, attemptId } = await params;
  const decodedId = decodeURIComponent(id);

  const testData = await getReadingTestById(decodedId);
  if (!testData) {
    notFound();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const pastAttempt = await getAttemptById(attemptId);

  if (!pastAttempt) {
    notFound();
  }

  return <TestResultView testData={testData} user={user} pastAttempt={pastAttempt} />;
}
