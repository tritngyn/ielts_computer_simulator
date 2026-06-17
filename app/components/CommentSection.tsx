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
    <div className="relative mt-2">
      <div className="flex items-center gap-3 mb-8 border-b border-border pb-4">
        <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-foreground/70" />
        </div>
        <h2 className="text-2xl font-display text-foreground">Comments</h2>
        <span className="bg-black/5 text-foreground/70 text-xs py-1 px-3 rounded-full font-semibold border border-black/5">
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
                className="w-12 h-12 rounded-full border border-border object-cover shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center text-foreground font-semibold shrink-0 border border-black/5 text-lg">
                {getInitial(user.user_metadata?.full_name || user.email || "")}
              </div>
            )}
            <div className="flex-1">
              <textarea
                className="w-full bg-background border border-border rounded-xl p-4 text-sm focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-colors min-h-[100px] resize-y"
                placeholder="Write your comment here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !newComment.trim()}
                  className="bg-foreground text-background hover:bg-foreground/90 transition-colors px-6 py-2.5 rounded-full font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full text-center py-10 bg-black/5 border border-black/5 rounded-2xl">
            <p className="text-muted-foreground mb-4">You need to sign in to post a comment.</p>
            <Link href="/login" className="inline-block bg-foreground text-background hover:bg-foreground/90 transition-colors px-8 py-3 rounded-full font-medium text-sm">
              Sign In
            </Link>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-4 text-muted-foreground text-sm">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-10 bg-black/[0.02] rounded-2xl border border-black/5 text-muted-foreground text-sm">No comments yet. Be the first to share your thoughts!</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 group">
              {comment.user?.avatarUrl ? (
                <Image 
                  src={comment.user.avatarUrl} 
                  alt="Profile" 
                  width={40}
                  height={40}
                  unoptimized
                  className="w-10 h-10 rounded-full border border-border object-cover shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-foreground font-medium shrink-0 border border-black/5 text-sm">
                  {getInitial(comment.user?.fullName || comment.authorName)}
                </div>
              )}
              <div className="flex-1">
                <div className="bg-black/[0.02] p-4 rounded-2xl rounded-tl-sm border border-black/5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-foreground text-sm">
                      {comment.user?.fullName || comment.authorName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {timeSince(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
