import data from "@/data/ielts_reading_tests.json";
import Link from "next/link";
export default function Reading() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-800">
        Danh sách bài học IELTS Reading
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-blue-800">
        {data.slice(0, 10).map((item, index) => (
          <Link key={index} href={`/reading/${index}`}>
            {" "}
            <h2> {item.test_id} </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
