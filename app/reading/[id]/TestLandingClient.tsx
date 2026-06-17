"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  Users,
  CheckCircle2,
  FileText,
  Play,
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
    <div className="min-h-screen bg-background py-32 px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header Section */}
        <motion.div
          className="liquid-glass p-8 md:p-12 rounded-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex gap-3 mb-6">
            <span className="bg-black/5 text-foreground/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md border border-black/5">
              IELTS Academic
            </span>
            <span className="bg-black/5 text-foreground/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md border border-black/5">
              Reading
            </span>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <h1 className="text-4xl md:text-5xl text-foreground font-display">
              {testData.title}
            </h1>
            <CheckCircle2 className="w-8 h-8 text-green-600 shrink-0" />
          </div>

          <div className="flex gap-6 border-b border-black/10 mb-8">
            <button className="pb-3 border-b-2 border-foreground text-foreground font-semibold">
              Test Information
            </button>
          </div>

          <div className="flex flex-col gap-4 text-muted-foreground text-sm mb-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <span>60 Minutes • {testData.passages.length} Sections • {totalQuestions} Questions</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button
              onClick={startTest}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-foreground text-background hover:bg-foreground/90 transition-colors px-10 py-4 rounded-full font-medium"
            >
              <Play className="w-5 h-5 fill-background" />
              Start Practice
            </button>
            {!user && (
              <span className="text-red-500 text-sm font-medium">
                * Please sign in to practice
              </span>
            )}
          </div>
        </motion.div>

        {/* Test History Section */}
        <motion.div
          className="liquid-glass p-8 md:p-12 rounded-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl text-foreground mb-8 font-display">Your Results</h2>

          {!user ? (
            <div className="text-center py-16 bg-black/5 rounded-2xl border border-black/5">
              <p className="text-muted-foreground mb-6">Sign in to save and track your test progress.</p>
              <button onClick={() => router.push("/login")} className="bg-foreground text-background hover:bg-foreground/90 transition-colors px-8 py-3 rounded-full font-medium">
                Sign In
              </button>
            </div>
          ) : history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[500px]">
                <thead>
                  <tr className="border-b border-black/10 text-muted-foreground">
                    <th className="pb-4 font-medium">Date Taken</th>
                    <th className="pb-4 font-medium">Score</th>
                    <th className="pb-4 font-medium">Time Taken</th>
                    <th className="pb-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {history.map((attempt) => (
                    <tr key={attempt.id} className="hover:bg-black/[0.02] transition-colors group">
                      <td className="py-4">
                        <div className="font-medium text-foreground">
                          {new Date(attempt.createdAt).toLocaleDateString("vi-VN", {
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </div>
                        <span className="inline-block mt-1 bg-black/5 text-foreground/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded border border-black/5">
                          {attempt.mode}
                        </span>
                      </td>
                      <td className="py-4 font-semibold text-foreground">
                        {attempt.score}/{attempt.totalQuestions}
                      </td>
                      <td className="py-4 text-muted-foreground">
                        {formatTime(attempt.timeTakenSeconds)}
                      </td>
                      <td className="py-4 text-right">
                        <Link 
                          href={`/reading/${testData.id}/result/${attempt.id}`}
                          className="text-foreground hover:opacity-70 font-medium text-sm transition-opacity"
                        >
                          View Details →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 bg-black/5 rounded-2xl border border-black/5">
              <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">You haven't attempted this test yet.</p>
            </div>
          )}
        </motion.div>

        {/* Comment Section */}
        <div className="liquid-glass p-8 md:p-12 rounded-3xl">
          <CommentSection testId={testData.id} user={user} />
        </div>
      </div>
    </div>
  );
}
