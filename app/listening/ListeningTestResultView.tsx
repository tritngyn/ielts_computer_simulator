"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  MessageSquare,
  Headphones,
} from "lucide-react";
import { IeltsListeningTest } from "@/types/listening";
import CommentSection from "@/app/components/CommentSection";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useHistoryStore } from "@/store/useHistoryStore"; // If listening store is same

interface Props {
  testData: IeltsListeningTest;
  user?: SupabaseUser | null;
  pastAttempt?: any; // The attempt data from DB
  currentAnswers?: Record<string, string>; // if passed from active test
  currentTimeTaken?: number;
}

export default function ListeningTestResultView({ testData, user, pastAttempt, currentAnswers, currentTimeTaken }: Props) {
  const [activeTab, setActiveTab] = useState<number | "all">("all");

  const userAnswers = pastAttempt?.userAnswers || currentAnswers || {};
  const timeTakenSeconds = pastAttempt ? pastAttempt.timeTakenSeconds : (currentTimeTaken || 0);

  const timeTakenFormatted = `${Math.floor(timeTakenSeconds / 60)
    .toString()
    .padStart(2, "0")}:${(timeTakenSeconds % 60).toString().padStart(2, "0")}`;

  let totalCorrect = 0;
  let totalIncorrect = 0;
  let totalSkipped = 0;
  let totalQuestions = 0;

  // Part-level stats
  const partStats = testData.parts.map((p, pIndex) => {
    let pCorrect = 0;
    let pIncorrect = 0;
    let pSkipped = 0;

    const groupStats = p.questionGroups.map((group) => {
      let gCorrect = 0;
      let gIncorrect = 0;
      let gSkipped = 0;

      const questionDetails = group.questions.map((q) => {
        const userAnswer = userAnswers[q.id || ""]?.trim() || "";
        const correctAnswers = testData.answers[q.number.toString()] || [];

        let status: "correct" | "incorrect" | "skipped" = "skipped";

        if (!userAnswer) {
          status = "skipped";
          gSkipped++;
        } else {
          const isCorrect = correctAnswers.some(
            (ans) => ans.toLowerCase() === userAnswer.toLowerCase(),
          );
          if (isCorrect) {
            status = "correct";
            gCorrect++;
          } else {
            status = "incorrect";
            gIncorrect++;
          }
        }

        return {
          number: q.number,
          userAnswer: userAnswer || "chưa trả lời",
          acceptedAnswers: correctAnswers,
          status,
        };
      });

      pCorrect += gCorrect;
      pIncorrect += gIncorrect;
      pSkipped += gSkipped;

      return {
        type: group.type,
        correct: gCorrect,
        incorrect: gIncorrect,
        skipped: gSkipped,
        total: group.questions.length,
        questions: questionDetails,
      };
    });

    totalCorrect += pCorrect;
    totalIncorrect += pIncorrect;
    totalSkipped += pSkipped;
    totalQuestions += p.questionGroups.reduce(
      (sum, g) => sum + g.questions.length,
      0,
    );

    return {
      title: p.title || `Part ${pIndex + 1}`,
      correct: pCorrect,
      incorrect: pIncorrect,
      skipped: pSkipped,
      total: pCorrect + pIncorrect + pSkipped,
      groupStats,
    };
  });

  return (
    <div className="min-h-screen bg-paper-cream py-10 px-4 font-body text-text-heading">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/listening"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 transition font-medium"
        >
          <Headphones size={20} />
          <span>Về thư viện Listening</span>
        </Link>

        {/* Score Summary */}
        <div
          className="bg-paper-white shadow-[6px_6px_16px_rgba(0,0,0,0.08)] p-8 relative torn-bottom"
          style={{ transform: "rotate(-0.5deg)" }}
        >
          <div className="tape tape-blue absolute -top-3 left-1/2 -translate-x-1/2 rotate-[2deg] w-32" />

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Kết quả bài làm</h1>
            <h2 className="text-xl text-gray-600 font-medium">{testData.title}</h2>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-12 text-center">
            <div className="flex flex-col items-center">
              <span className="text-6xl font-black font-hand text-accent-blue mb-2">
                {totalCorrect}
              </span>
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                Câu đúng
              </span>
            </div>
            <div className="w-px bg-gray-200 hidden sm:block"></div>
            <div className="flex flex-col items-center">
              <span className="text-6xl font-black font-hand text-gray-400 mb-2">
                {totalIncorrect}
              </span>
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                Câu sai
              </span>
            </div>
            <div className="w-px bg-gray-200 hidden sm:block"></div>
            <div className="flex flex-col items-center">
              <span className="text-6xl font-black font-hand text-gray-300 mb-2">
                {totalSkipped}
              </span>
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                Bỏ qua
              </span>
            </div>
            <div className="w-px bg-gray-200 hidden sm:block"></div>
            <div className="flex flex-col items-center">
              <span className="text-6xl font-black font-hand text-accent-orange mb-2">
                {timeTakenFormatted}
              </span>
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                Thời gian làm
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Review */}
        <div
          className="bg-paper-white shadow-[6px_6px_16px_rgba(0,0,0,0.08)] p-6 relative"
          style={{ transform: "rotate(0.3deg)" }}
        >
          <div className="tape tape-pink absolute -top-2 left-10 rotate-[-4deg] w-24" />

          <div className="flex gap-4 border-b border-gray-100 mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-3 px-4 font-bold whitespace-nowrap transition-colors ${activeTab === "all" ? "border-b-2 border-accent-blue text-accent-blue" : "text-gray-500 hover:text-gray-800"}`}
            >
              Tất cả
            </button>
            {partStats.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`pb-3 px-4 font-bold whitespace-nowrap transition-colors ${activeTab === idx ? "border-b-2 border-accent-blue text-accent-blue" : "text-gray-500 hover:text-gray-800"}`}
              >
                {p.title} ({p.correct}/{p.total})
              </button>
            ))}
          </div>

          <div className="space-y-8">
            {partStats.map((p, pIndex) => {
              if (activeTab !== "all" && activeTab !== pIndex) return null;

              return (
                <div key={pIndex} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 border-l-4 border-accent-blue pl-3">
                    {p.title}
                  </h3>

                  <div className="bg-gray-50 rounded-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="bg-gray-100/50 border-b border-gray-200 text-gray-600">
                          <th className="p-3 font-bold w-16 text-center">Câu</th>
                          <th className="p-3 font-bold">Bài làm của bạn</th>
                          <th className="p-3 font-bold">Đáp án đúng</th>
                          <th className="p-3 font-bold w-24 text-center">Kết quả</th>
                        </tr>
                      </thead>
                      <tbody>
                        {p.groupStats.map((g) =>
                          g.questions.map((q, qIndex) => (
                            <tr
                              key={`${pIndex}-${q.number}`}
                              className="border-b border-gray-100 hover:bg-white transition-colors"
                            >
                              <td className="p-3 text-center font-bold text-gray-700">
                                {q.number}
                              </td>
                              <td className="p-3 font-mono text-[15px]">
                                <span
                                  className={`${q.status === "correct" ? "text-green-600 font-bold" : q.status === "incorrect" ? "text-red-600 line-through" : "text-gray-400 italic"}`}
                                >
                                  {q.userAnswer}
                                </span>
                              </td>
                              <td className="p-3 font-mono text-[15px] font-bold text-gray-800">
                                {q.acceptedAnswers.join(" / ")}
                              </td>
                              <td className="p-3 text-center">
                                {q.status === "correct" ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                                ) : q.status === "incorrect" ? (
                                  <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                                ) : (
                                  <MinusCircle className="w-5 h-5 text-gray-300 mx-auto" />
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comment Section */}
        <CommentSection testId={testData.id} user={user || null} />
      </div>
    </div>
  );
}
