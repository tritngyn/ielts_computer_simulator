"use client";

import Link from "next/link";
import { Instrument_Serif, Inter } from "next/font/google";
import { motion, Variants } from "framer-motion";
import {
  BookOpen,
  Mic,
  Headphones,
  PenTool,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
  Star,
  MessageCircle,
} from "lucide-react";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  weight: ["400", "500"],
  subsets: ["latin"],
});

const skills = [
  {
    id: "reading",
    title: "Reading",
    icon: BookOpen,
    description: "Master reading comprehension with 3-passage exams",
    path: "/reading",
  },
  {
    id: "listening",
    title: "Listening",
    icon: Headphones,
    description: "Improve audio focus with simulated environments",
    path: "/listening",
  },
  {
    id: "writing",
    title: "Writing",
    icon: PenTool,
    description: "Refine expression with AI-scored task analysis",
    path: "/writing",
  },
  {
    id: "speaking",
    title: "Speaking",
    icon: Mic,
    description: "Conquer interview anxiety with real-time feedback",
    path: "/speaking",
  },
];

const features = [
  { icon: Sparkles, text: "AI-powered feedback & precise scoring" },
  { icon: Target, text: "Realistic CBT exam simulations" },
  { icon: TrendingUp, text: "Progress analytics over time" },
  { icon: Zap, text: "Expert strategies & insights" },
  { icon: Star, text: "Comprehensive 4-skill mastery" },
  { icon: MessageCircle, text: "24/7 AI tutor guidance" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Home() {
  return (
    <div className={`${inter.className} min-h-screen relative`}>
      {/* ====== HERO SECTION ====== */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
        />

        {/* Small gradient only at the very bottom edge to blend with the next section */}
        <div className="absolute bottom-0 inset-x-0 h-4 z-0 bg-gradient-to-t from-background to-transparent" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20">
          <h1
            className={`text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-5xl font-normal  text-foreground ${instrumentSerif.className}`}
          >
            Master your{" "}
            <em className="not-italic text-muted-foreground">language.</em>
            <br />
            Conquer your{" "}
            <em className="not-italic text-muted-foreground">limits.</em>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed ">
            A comprehensive computer-delivered IELTS simulator. Designed for
            deep thinkers and bold creators. Build sharp focus and achieve your
            target band.
          </p>
          <Link
            href="/reading"
            className="liquid-glass rounded-full px-12 py-4 text-base text-foreground mt-12 hover:scale-[1.03] cursor-pointer transition-transform "
          >
            Take a Free Test
          </Link>
        </div>
      </section>

      {/* ====== FEATURES SECTION ====== */}
      <section className="relative z-10 py-32 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2
              className={`text-4xl md:text-5xl mb-4 text-foreground ${instrumentSerif.className}`}
            >
              Tools for Deep Thinkers
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Everything you need to ace the IELTS exam, refined into a
              distraction-free digital space.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="p-8 liquid-glass rounded-2xl group cursor-default"
                  custom={index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <div className="mb-6 w-12 h-12 flex items-center justify-center rounded-full bg-black/5 border border-black/5 group-hover:bg-black/10 group-hover:border-black/10 transition-colors">
                    <Icon className="w-6 h-6 text-foreground" />
                  </div>
                  <p className="text-lg text-foreground/90 leading-relaxed font-medium">
                    {feature.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== SKILLS SECTION ====== */}
      <section className="relative z-10 py-32 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2
                className={`text-4xl md:text-5xl mb-4 text-foreground ${instrumentSerif.className}`}
              >
                Conquer Your Test
              </h2>
              <p className="text-muted-foreground text-lg">
                Practice all four IELTS skills in a highly realistic, minimalist
                interface. No distractions, just results.
              </p>
            </div>
            <Link
              href="/reading"
              className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors border-b border-border hover:border-transparent pb-1"
            >
              View All Tests →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <motion.div
                  key={skill.id}
                  custom={index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <Link href={skill.path} className="block group">
                    <div className="liquid-glass p-8 rounded-2xl h-full flex flex-col justify-between">
                      <div>
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-accent/30 text-accent-blue mb-6 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3
                          className={`text-3xl text-foreground mb-3 ${instrumentSerif.className}`}
                        >
                          {skill.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                          {skill.description}
                        </p>
                      </div>
                      <div className="flex items-center text-sm font-medium text-foreground opacity-50 group-hover:opacity-100 transition-opacity">
                        Begin{" "}
                        <span className="ml-2 transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== CTA & FOOTER ====== */}
      <section className="relative z-10 py-32 px-6 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className={`text-5xl md:text-6xl mb-8 text-foreground ${instrumentSerif.className}`}
          >
            Ready to achieve 9.0 Overall?
          </h2>
          <p className="text-xl mb-12 text-muted-foreground max-w-xl mx-auto">
            Join thousands of deep thinkers who have shattered their limits.
          </p>
          <Link
            href="/reading"
            className="inline-block liquid-glass rounded-full px-12 py-4 text-base text-foreground hover:scale-[1.03] transition-transform"
          >
            Start Your Journey
          </Link>
        </div>
      </section>

      <footer className="relative z-10 bg-background border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div
            className={`text-2xl text-foreground ${instrumentSerif.className}`}
          >
            IELTS Master<sup className="text-[10px]">®</sup>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 IELTS Master. Built for focus.
          </p>
        </div>
      </footer>
    </div>
  );
}
