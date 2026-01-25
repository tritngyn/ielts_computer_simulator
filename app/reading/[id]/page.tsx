import { notFound } from "next/navigation";
import IELTSTest from "./IetlsTest";
import testsData from "../../../data/ielts_reading_tests.json";
import { IELTSTestData } from "../../types/ielts";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TestPage({ params }: PageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  const testData = (testsData as IELTSTestData[]).find(
    (test) => test.test_id === decodedId
  );

  if (!testData) {
    notFound();
  }

  return <IELTSTest testData={testData} />;
}
