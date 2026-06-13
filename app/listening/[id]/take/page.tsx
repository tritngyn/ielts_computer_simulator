import { notFound, redirect } from "next/navigation";
import ListeningTest from "../../ListeningTest";
import { getListeningTestById } from "@/lib/data";
import { createClient } from "@/utils/supabase/server";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TakeListeningTestPage({ params }: PageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  const testData = await getListeningTestById(decodedId);

  if (!testData) {
    notFound();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <ListeningTest testData={testData} user={user} />;
}
