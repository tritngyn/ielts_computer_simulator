"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { BookOpen, FileText, Clock, ChevronRight, ChevronLeft } from "lucide-react";
import { IeltsReadingTest } from "@/types/ielts";
import { Instrument_Serif } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
});

const TESTS_PER_PAGE = 6;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

interface Props {
  tests: IeltsReadingTest[];
}

export default function ReadingListClient({ tests }: Props) {
  const [page, setPage] = useState(1);
  
  const mappedTests = tests.map((item) => ({
    id: item.id,
    book: item.title,
    test: item.testCode,
    passages: item.passages.length,
    questions: item.passages.reduce((total, p) => total + p.questionGroups.reduce((sum, g) => sum + g.questions.length, 0), 0),
    time: 60,
  }));

  const totalPages = Math.ceil(mappedTests.length / TESTS_PER_PAGE);
  const paginatedTests = mappedTests.slice((page - 1) * TESTS_PER_PAGE, page * TESTS_PER_PAGE);

  const statCards = [
    {
      label: "Total Tests",
      value: mappedTests.length,
      icon: FileText,
    },
    {
      label: "Test Duration",
      value: "60 min",
      icon: Clock,
    },
    {
      label: "Questions per Test",
      value: "40",
      icon: BookOpen,
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-black/5 border border-black/5 p-3 rounded-full">
                  <BookOpen className="w-6 h-6 text-foreground" />
                </div>
                <h1 className={`text-4xl md:text-6xl text-foreground ${instrumentSerif.className}`}>
                  Reading Tests
                </h1>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Official Cambridge IELTS Reading tests. Sharpen your focus and improve your comprehension with full-length simulations.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="liquid-glass p-8 rounded-2xl flex items-center justify-between"
                custom={index}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                <div>
                  <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
                  <p className={`text-4xl text-foreground ${instrumentSerif.className}`}>{stat.value}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center border border-black/5">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginatedTests.map((test, index) => (
            <motion.div key={test.id} custom={index} variants={fadeUp} initial="hidden" animate="visible">
              <Link
                href={`/reading/${test.id}`}
                className="block liquid-glass p-6 md:p-8 rounded-2xl group transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-5 flex-1">
                    <div className="w-12 h-12 bg-black/5 border border-black/5 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-black/10 group-hover:border-black/10 transition-colors">
                      <BookOpen className="w-5 h-5 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-2xl text-foreground mb-3 ${instrumentSerif.className}`}>{test.book}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-4 h-4 opacity-70" />
                          {test.passages} passages
                        </span>
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 opacity-70" />
                          {test.questions} questions
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 opacity-70" />
                          {test.time} mins
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                    <ChevronRight className="w-5 h-5 text-foreground" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-6 mt-16">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-black/10 text-foreground hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>
            <span className="text-muted-foreground text-sm">
              Page <span className="text-foreground font-medium">{page}</span> of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-black/10 text-foreground hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <motion.div
          className="mt-24 liquid-glass p-8 md:p-12 rounded-2xl relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Subtle gradient glow inside the card */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-accent/20 rounded-full blur-[80px] pointer-events-none" />
          
          <h3 className={`text-3xl text-foreground mb-6 ${instrumentSerif.className}`}>About Reading Tests</h3>
          <div className="text-muted-foreground space-y-3 leading-relaxed max-w-3xl">
            <p>— Each test consists of 3 reading passages with increasing difficulty.</p>
            <p>— You have 60 minutes to complete 40 questions in a focused environment.</p>
            <p>— Question types include multiple choice, true/false/not given, matching, and more.</p>
            <p>— Tests are sourced from official preparation materials for maximum realism.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
