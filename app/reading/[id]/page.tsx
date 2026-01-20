import data from "@/data/ielts_reading_tests.json";
import { notFound } from "next/navigation";

export async function generatestaticparams() {
  return data.map((_, index) => ({
    id: index.toString(),
  }));
}
export default async function ReadingDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const lesson = data[parseInt(id)];

  // Nếu không tìm thấy dữ liệu (id quá lớn hoặc không hợp lệ)
  if (!lesson) {
    notFound();
  }
  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-8">
      <header className="mb-8 border-b pb-6">
        <h1 className="text-1xl md:text-2xl font-extrabold text-gray-900 mt-2">
          {lesson.title}
        </h1>
        <h2>Read the text bellow and answer the questions</h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cột 1: Passage Text (Chiếm 7/12 cột) */}
        <div className=" overflow-y-auto lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
            <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
            Reading Passage
          </h2>
          <article
            className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: lesson.passage.join("") }}
          />
        </div>
        {/* Cột 2: Questions (Chiếm 5/12 cột và cố định khi scroll) */}
        <aside className="lg:col-span-5 lg:sticky lg:top-8 overflow-y-auto">
          <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200 min-h-[500px]">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
              <span className="mr-2">📝</span> Questions
            </h3>

            <div className="space-y-6">
              <div className="text-center py-10 text-gray-400 italic text-justify leading-relaxed text-lg whitespace-pre-line">
                {/* Bạn sẽ map dữ liệu lesson.questions vào đây sau */}
              </div>
            </div>
          </div>
          {/* Footer của Sidebar */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center">
            <span className="text-sm text-gray-500">Page 1 of 1</span>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              Submit Test
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
