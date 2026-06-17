import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import {
  User,
  Clock,
  Award,
  BookOpen,
  Target,
  Calendar,
  History,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Profile | IELTS Master",
};

import ProfileCard from "./ProfileCard";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user || null;

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      attempts: {
        include: { test: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  const displayName =
    dbUser?.fullName ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "User";
  const email = dbUser?.email || user.email;
  const avatar = dbUser?.avatarUrl || user.user_metadata?.avatar_url || null;
  const attempts = dbUser?.attempts || [];

  // Calculate some stats
  const totalTests = attempts.length;
  const avgScore =
    totalTests > 0
      ? Math.round(
          (attempts.reduce((acc, curr) => acc + curr.score, 0) / totalTests) *
            10,
        ) / 10
      : 0;

  return (
    <div className="min-h-screen bg-background pt-12 pb-24 px-4 sm:px-6 max-w-5xl mx-auto font-body">
      <div className="flex items-center gap-4 mb-10 pl-2">
        <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center">
          <User className="w-6 h-6 text-foreground" />
        </div>
        <h1 className="text-4xl text-foreground font-display">Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: User Info */}
        <div className="md:col-span-1 space-y-8">
          <ProfileCard
            initialDisplayName={displayName}
            email={email || "No email provided"}
            initialAvatar={avatar}
            totalTests={totalTests}
            avgScore={avgScore}
          />
        </div>

        {/* Right Column: History */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-2xl text-foreground font-display flex items-center gap-3">
              <History className="w-6 h-6 text-foreground/70" />
              Lịch sử làm bài gần đây
            </h2>
          </div>

          {attempts.length === 0 ? (
            <div className="liquid-glass p-12 text-center flex flex-col items-center justify-center rounded-3xl border border-black/5">
              <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-lg text-muted-foreground mb-6 font-medium">
                Bạn chưa làm bài test nào.
              </p>
              <Link
                href="/"
                className="bg-foreground text-background hover:bg-foreground/90 transition-colors px-8 py-3 rounded-full font-medium"
              >
                Bắt đầu luyện tập ngay
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {attempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="liquid-glass p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:border-black/10 transition-colors"
                >
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-foreground/70" />
                    </div>
                    <div>
                      <h3 className="text-xl text-foreground font-semibold group-hover:text-black/80 transition-colors mb-2">
                        {attempt.test.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5 bg-black/5 px-2.5 py-1 rounded-md">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(attempt.createdAt).toLocaleDateString(
                            "vi-VN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            },
                          )}
                        </span>
                        <span className="flex items-center gap-1.5 bg-black/5 px-2.5 py-1 rounded-md">
                          <Clock className="w-3.5 h-3.5" />
                          {Math.floor(attempt.timeTakenSeconds / 60)}:
                          {(attempt.timeTakenSeconds % 60)
                            .toString()
                            .padStart(2, "0")}
                        </span>
                        <span className="bg-black/5 text-foreground/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-md">
                          {attempt.mode}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2 shrink-0">
                    <div className="text-2xl font-bold text-foreground">
                      {attempt.score}{" "}
                      <span className="text-sm text-muted-foreground font-medium">
                        / {attempt.totalQuestions}
                      </span>
                    </div>
                    <Link
                      href={`/${attempt.test.type.toLowerCase()}/${attempt.testId}/result/${attempt.id}`}
                      className="text-sm font-semibold text-foreground/70 hover:text-foreground hover:bg-black/5 px-3 py-1.5 rounded-full transition-colors"
                    >
                      Xem chi tiết →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
