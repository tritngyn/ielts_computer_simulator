"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Clock,
  Users,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { IeltsReadingTest } from "@/types/ielts";
import { useTestStore } from "@/store/useTestScore";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import CommentSection from "@/app/components/CommentSection";

interface Props {
  testData: IeltsReadingTest;
  user: SupabaseUser | null;
  dbAttempts: any[];
}

export default function TestLandingClient({ testData, user, dbAttempts }: Props) {
  const router = useRouter();
  const resetTestStore = useTestStore((state) => state.reset);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const history = !isMounted ? [] : dbAttempts;

  const totalQuestions = testData.passages.reduce(
    (sum, p) =>
      sum + p.questionGroups.reduce((gSum, g) => gSum + g.questions.length, 0),
    0,
  );

  const startTest = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    resetTestStore();
    router.push(`/reading/${testData.id}/take`);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-paper-cream py-10 px-4 font-body text-text-heading">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          className="bg-paper-white p-8 shadow-[6px_6px_16px_rgba(0,0,0,0.08)] relative torn-bottom"
          style={{ transform: "rotate(-0.5deg)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="tape tape-blue absolute -top-3 left-10 rotate-[-8deg] w-20" />

          <div className="flex gap-3 mb-4">
            <span className="bg-gray-100 text-gray-600 px-3 py-1 text-xs font-bold rounded-sm border border-gray-200">
              #IELTS Academic
            </span>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 text-xs font-bold rounded-sm border border-gray-200">
              #Reading
            </span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold">{testData.title}</h1>
            <CheckCircle2 className="w-8 h-8 text-green-500 shrink-0" />
          </div>

          <div className="flex border-b border-gray-200 mb-6">
            <button className="px-6 py-2 border-b-2 border-blue-600 text-blue-700 font-bold bg-blue-50/50">
              Thông tin đề thi
            </button>
            {user ? (
              <button 
                onClick={() => router.push(`/reading/${testData.id}/take`)} 
                className="px-6 py-2 text-gray-500 font-medium hover:bg-gray-50 transition-colors"
              >
                Đáp án/transcript
              </button>
            ) : (
              <button 
                onClick={() => router.push("/login")} 
                className="px-6 py-2 text-gray-500 font-medium hover:bg-gray-50 transition-colors"
                title="Đăng nhập để xem"
              >
                Đáp án/transcript
              </button>
            )}
          </div>

          <div className="space-y-3 text-text-secondary text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> Thời gian làm bài: 60 phút |{" "}
              {testData.passages.length} phần thi | {totalQuestions} câu hỏi
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" /> 1,570,503 người đã luyện tập đề thi
              này
            </div>
          </div>

          <div className="mt-6 p-3 bg-red-50 text-red-700 text-sm border-l-4 border-red-500 italic">
            Chú ý: để được quy đổi sang scaled score (ví dụ trên thang điểm 990
            cho TOEIC hoặc 9.0 cho IELTS), vui lòng chọn chế độ làm FULL TEST.
          </div>

          <div className="mt-8 flex gap-4 items-center">
            <button
              onClick={startTest}
              className="paper-btn bg-accent-blue text-white shadow-[4px_4px_0px_#1e40af] hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all px-10 py-3 text-lg"
            >
              Làm bài (Luyện tập)
            </button>
            {!user && (
              <span className="text-red-500 text-sm italic font-medium ml-2">
                * Vui lòng đăng nhập để làm bài
              </span>
            )}
          </div>
        </motion.div>

        {/* Test History Section */}
        {user ? (
          <motion.div
            className="bg-paper-white shadow-[4px_4px_12px_rgba(0,0,0,0.06)] p-8 relative"
            style={{ transform: "rotate(0.3deg)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-xl font-bold mb-6">Kết quả làm bài của bạn:</h2>

            {history.length > 0 ? (
              <div className="overflow-x-auto border border-gray-200 rounded-sm">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                      <th className="p-4 font-bold">Ngày làm</th>
                      <th className="p-4 font-bold">Kết quả</th>
                      <th className="p-4 font-bold">Thời gian làm bài</th>
                      <th className="p-4 font-bold"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((attempt) => (
                      <tr
                        key={attempt.id}
                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="font-medium text-gray-800">
                            {new Date(attempt.createdAt).toLocaleDateString("vi-VN", {
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </div>
                          <span className="inline-block mt-1 bg-green-100 text-green-700 px-2 py-0.5 text-xs font-bold rounded-sm border border-green-200">
                            {attempt.mode}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-gray-800">
                          {attempt.score}/{attempt.totalQuestions}
                        </td>
                        <td className="p-4 text-gray-600">
                          {formatTime(attempt.timeTakenSeconds)}
                        </td>
                        <td className="p-4">
                          <button className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm">
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-300">
                <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Bạn chưa làm đề thi này lần nào.</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            className="bg-paper-white shadow-[4px_4px_12px_rgba(0,0,0,0.06)] p-8 relative"
            style={{ transform: "rotate(0.3deg)" }}
          >
            <h2 className="text-xl font-bold mb-6">Kết quả làm bài của bạn:</h2>
            <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-300 rounded">
              <p className="text-gray-500 mb-4">Vui lòng đăng nhập để lưu và xem kết quả làm bài của bạn.</p>
              <button onClick={() => router.push("/login")} className="paper-btn bg-gray-800 text-white shadow-[3px_3px_0px_#374151] px-6 py-2">
                Đăng nhập
              </button>
            </div>
          </motion.div>
        )}

        {/* Comment Section */}
        <CommentSection testId={testData.id} user={user} />
      </div>
    </div>
  );
}
