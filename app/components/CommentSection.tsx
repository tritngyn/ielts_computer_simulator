"use client";

import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { getCommentsByTestId, createComment } from "@/lib/actions/comment.actions";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";

interface CommentType {
  id: string;
  authorName: string;
  content: string;
  createdAt: Date;
  user: {
    fullName: string | null;
    avatarUrl: string | null;
    email: string;
  } | null;
}

interface CommentSectionProps {
  testId: string;
  user: SupabaseUser | null;
}

export default function CommentSection({ testId, user }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchedComments = await getCommentsByTestId(testId);
        setComments(fetchedComments as any);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComments();
  }, [testId]);

  const handleSubmit = async () => {
    if (!newComment.trim() || !user) return;
    
    setIsSubmitting(true);
    try {
      const result = await createComment(testId, newComment);
      if (result.success && result.comment) {
        // Fetch comments again to get the populated user relation, or manually optimistically update
        const fetchedComments = await getCommentsByTestId(testId);
        setComments(fetchedComments as any);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  const timeSince = (dateInput: Date | string) => {
    const date = new Date(dateInput);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " năm trước";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " tháng trước";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " ngày trước";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " giờ trước";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " phút trước";
    return "Vừa xong";
  };

  return (
    <div
      className="bg-paper-white shadow-[6px_6px_16px_rgba(0,0,0,0.08)] p-8 relative mt-8"
      style={{ transform: "rotate(-0.2deg)" }}
    >
      <div className="tape tape-pink absolute -top-2 right-1/4 rotate-[4deg] w-24" />

      <div className="flex items-center gap-2 mb-8 border-b border-gray-100 pb-4">
        <MessageSquare className="w-6 h-6 text-accent-blue" />
        <h2 className="text-2xl font-bold">Bình luận</h2>
        <span className="bg-gray-100 text-gray-600 text-sm py-0.5 px-3 rounded-full font-bold">
          {comments.length}
        </span>
      </div>

      <div className="mb-10 flex gap-4">
        {user ? (
          <>
            {user.user_metadata?.avatar_url ? (
               <Image 
                src={user.user_metadata.avatar_url} 
                alt="Profile" 
                width={48}
                height={48}
                unoptimized
                className="w-12 h-12 rounded-full border-2 border-accent-blue object-cover shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,0.05)] border border-blue-200 text-xl">
                {getInitial(user.user_metadata?.full_name || user.email || "")}
              </div>
            )}
            <div className="flex-1">
              <textarea
                className="w-full bg-gray-50 border border-gray-200 rounded-sm p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-colors min-h-[100px] resize-y shadow-inner"
                placeholder="Viết bình luận của bạn về đề thi này..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !newComment.trim()}
                  className="paper-btn bg-accent-blue text-white shadow-[3px_3px_0px_#1e40af] text-sm py-2.5 px-8 hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Đang gửi..." : "Gửi bình luận"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-600 mb-4">Bạn cần đăng nhập để gửi bình luận.</p>
            <Link href="/login" className="inline-block paper-btn bg-accent-blue text-white shadow-[3px_3px_0px_#1e40af] px-6 py-2">
              Đăng nhập ngay
            </Link>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">Đang tải bình luận...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-400 italic">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              {comment.user?.avatarUrl ? (
                <Image 
                  src={comment.user.avatarUrl} 
                  alt="Profile" 
                  width={48}
                  height={48}
                  unoptimized
                  className="w-12 h-12 rounded-full border border-gray-200 object-cover shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold shrink-0 text-lg">
                  {getInitial(comment.user?.fullName || comment.authorName)}
                </div>
              )}
              <div className="flex-1">
                <div className="bg-gray-50 p-5 rounded-lg rounded-tl-none border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-800">
                      {comment.user?.fullName || comment.authorName}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {timeSince(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
                {/* <div className="flex gap-4 mt-2 ml-2 text-xs font-bold text-gray-500 uppercase tracking-wide">
                  <button className="hover:text-blue-600 transition-colors">Thích</button>
                  <button className="hover:text-blue-600 transition-colors">Phản hồi</button>
                </div> */}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
