import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { User, Clock, Award, BookOpen, Target, Calendar, History } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Profile | IELTS Master",
};

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

  const displayName = dbUser?.fullName || user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const email = dbUser?.email || user.email;
  const avatar = dbUser?.avatarUrl || user.user_metadata?.avatar_url || null;
  const attempts = dbUser?.attempts || [];
  
  // Calculate some stats
  const totalTests = attempts.length;
  const avgScore = totalTests > 0 
    ? Math.round(attempts.reduce((acc, curr) => acc + curr.score, 0) / totalTests * 10) / 10 
    : 0;

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <User className="w-8 h-8 text-accent-blue" />
        <h1 className="text-4xl text-text-heading">Hồ Sơ Của Bạn</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: User Info */}
        <div className="md:col-span-1 space-y-8">
          <div className="paper-card p-6 rotate-[-1deg]">
            <div className="tape tape-yellow absolute -top-3 left-1/2 -translate-x-1/2 rotate-[-2deg]" />
            
            <div className="flex flex-col items-center text-center mt-4">
              <div className="w-28 h-28 rounded-full overflow-hidden mb-4 photo-frame">
                {avatar ? (
                  <Image 
                    src={avatar} 
                    alt={displayName} 
                    width={112}
                    height={112}
                    unoptimized
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-amber-100 flex items-center justify-center text-amber-600 text-4xl font-hand">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-text-heading mb-1">{displayName}</h2>
              <p className="text-text-secondary font-body break-all">{email}</p>
              
              <div className="w-full h-px bg-amber-200/50 my-6" />
              
              <div className="w-full space-y-4">
                <div className="flex justify-between items-center px-2">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-body">Tổng bài làm</span>
                  </div>
                  <span className="font-bold text-lg font-hand text-accent-blue">{totalTests}</span>
                </div>
                <div className="flex justify-between items-center px-2">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Award className="w-4 h-4" />
                    <span className="font-body">Điểm trung bình</span>
                  </div>
                  <span className="font-bold text-lg font-hand text-accent-green">{avgScore}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: History */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl text-text-heading flex items-center gap-2">
              <History className="w-6 h-6 text-accent-orange" />
              Lịch sử làm bài gần đây
            </h2>
          </div>

          {attempts.length === 0 ? (
            <div className="paper-card p-10 text-center flex flex-col items-center justify-center bg-paper-white/50 border-2 border-dashed border-amber-200">
              <Target className="w-12 h-12 text-amber-300 mb-4 opacity-50" />
              <p className="text-lg text-text-secondary mb-4 font-body">Bạn chưa làm bài test nào.</p>
              <Link href="/" className="paper-btn bg-accent-blue text-white hover:-rotate-1">
                Bắt đầu luyện tập ngay
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {attempts.map((attempt) => (
                <div key={attempt.id} className="paper-card-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                  <div className="flex items-start gap-4">
                    <div className="bg-paper-kraft p-3 rounded-full group-hover:rotate-12 transition-transform">
                      <BookOpen className="w-6 h-6 text-text-main" />
                    </div>
                    <div>
                      <h3 className="text-xl text-text-heading font-hand group-hover:text-accent-blue transition-colors">
                        {attempt.test.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary mt-1 font-body">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(attempt.createdAt).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {Math.floor(attempt.timeTakenSeconds / 60)}:{(attempt.timeTakenSeconds % 60).toString().padStart(2, '0')}
                        </span>
                        <span className="paper-tag bg-amber-100 text-amber-800 scale-90 origin-left">
                          {attempt.mode}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
                    <div className="text-2xl font-bold font-hand text-accent-green">
                      {attempt.score} <span className="text-sm text-text-secondary font-normal font-body">/ {attempt.totalQuestions}</span>
                    </div>
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
