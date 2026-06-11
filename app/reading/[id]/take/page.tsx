import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getReadingTestById } from "@/lib/data";
import SkeletonLoader from "@/app/components/SkeletonLoader";

const IELTSTest = dynamic(() => import("../IetlsTest"), {
  loading: () => <SkeletonLoader />,
});

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
