"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, Github, ArrowRight } from "lucide-react";
import { signInWithOAuth, syncUser } from "../actions";
import { createClient } from "@/utils/supabase/client";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (authError) {
      setError(authError.message);
      setIsLoading(false);
    } else {
      await syncUser();
      window.location.href = "/";
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-paper-cream py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="paper-card p-8 md:p-10 rotate-[-0.5deg]">
          {/* Tape decoration */}
          <div className="tape tape-pink absolute -top-3 right-8 rotate-[8deg] w-20" />

          <div className="text-center mb-8">
            <div className="inline-block bg-pink-100 p-3 rounded-full mb-4 shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
              <UserPlus className="w-8 h-8 text-accent-pink" />
            </div>
            <h2 className="text-3xl font-hand text-text-heading">Create Account</h2>
            <p className="text-text-secondary font-body mt-2">Join IELTS Master today</p>
          </div>

          <form action={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-text-main mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-sm focus:border-accent-pink focus:ring-0 outline-none font-body transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-main mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-sm focus:border-accent-pink focus:ring-0 outline-none font-body transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-main mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-sm focus:border-accent-pink focus:ring-0 outline-none font-body transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-sm border border-red-200 text-sm font-body">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full paper-btn bg-accent-pink text-white justify-center disabled:opacity-70 mt-2"
            >
              {isLoading ? "Signing up..." : "Sign Up"}
              {!isLoading && <ArrowRight className="w-5 h-5 ml-1" />}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-paper-white text-gray-500 font-body">Or sign up with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                onClick={() => signInWithOAuth("google")}
                className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-sm hover:bg-gray-50 transition-colors font-body font-bold text-text-main shadow-[2px_2px_0px_rgba(0,0,0,0.05)]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Google
              </button>
              <button
                onClick={() => signInWithOAuth("github")}
                className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-sm hover:bg-gray-50 transition-colors font-body font-bold text-text-main shadow-[2px_2px_0px_rgba(0,0,0,0.05)]"
              >
                <Github className="w-5 h-5" />
                GitHub
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm font-body text-text-secondary">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-accent-pink hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
