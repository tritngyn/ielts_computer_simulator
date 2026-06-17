"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, ArrowRight } from "lucide-react";

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
    <div className="min-h-[85vh] flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8 font-body">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="liquid-glass p-8 md:p-10 rounded-3xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-black/5 rounded-full mb-6 border border-black/5">
              <UserPlus className="w-6 h-6 text-foreground" />
            </div>
            <h2 className="text-4xl text-foreground mb-3 font-display">Create Account</h2>
            <p className="text-muted-foreground text-sm">Join IELTS Master today</p>
          </div>

          <form action={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-foreground/80 mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3.5 bg-background border border-border rounded-xl focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground/80 mb-2">Password</label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-3.5 bg-background border border-border rounded-xl focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground/80 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                className="w-full px-4 py-3.5 bg-background border border-border rounded-xl focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-foreground text-background hover:bg-foreground/90 transition-colors px-4 py-4 rounded-full font-medium disabled:opacity-70 mt-2"
            >
              {isLoading ? "Signing up..." : "Sign Up"}
              {!isLoading && <ArrowRight className="w-5 h-5 ml-2" />}
            </button>
          </form>

          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground">Or sign up with</span>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => signInWithOAuth("google")}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-border rounded-xl hover:bg-black/5 transition-colors font-medium text-foreground bg-background shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Continue with Google
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-foreground hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
