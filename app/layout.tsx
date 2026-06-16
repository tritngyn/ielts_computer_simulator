import type { Metadata } from "next";
import { Patrick_Hand, Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

const patrickHand = Patrick_Hand({
  weight: "400",
  variable: "--font-hand",
  subsets: ["latin"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IELTS Master — Practice & Achieve Your Target Score",
  description:
    "Comprehensive IELTS preparation platform with realistic practice tests for Reading, Listening, Speaking, and Writing. Get instant AI-powered feedback and track your progress.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  // Force hot reload for CSS theme change

  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();



  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${patrickHand.variable} ${nunito.variable} antialiased force-css-reload-1`}
      >
        <Navbar user={user} />
        {children}
      </body>
    </html>
  );
}
