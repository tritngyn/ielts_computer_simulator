"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, FileText, Clock, ChevronRight, ChevronLeft } from "lucide-react";
import { IeltsReadingTest } from "@/types/ielts";

const TESTS_PER_PAGE = 6;

const cardIn = {
  hidden: { opacity: 0, y: 16, rotate: -1 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" },
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
      paper: "bg-blue-50",
      rotation: "rotate-[-1deg]",
    },
    {
      label: "Test Duration",
      value: "60 min",
      icon: Clock,
      paper: "bg-pink-50",
      rotation: "rotate-[0.5deg]",
    },
    {
      label: "Questions per Test",
      value: "40",
      icon: BookOpen,
      paper: "bg-green-50",
      rotation: "rotate-[-0.5deg]",
    },
  ];

  return (
    <div className="min-h-screen bg-paper-cream py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-10 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="inline-block bg-paper-white p-6 pr-12 shadow-[6px_6px_16px_rgba(0,0,0,0.1)]"
            style={{ transform: "rotate(-0.8deg)" }}
          >
            <div className="tape tape-blue absolute -top-2 left-6 rotate-[-10deg] w-16" />
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-accent-blue p-2.5 rounded-sm shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl text-text-heading">Reading Tests</h1>
            </div>
            <p className="text-text-secondary text-lg font-body pl-1">
              Official Cambridge IELTS Reading tests — 3 passages, 40 questions each
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className={`${stat.paper} p-6 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] ${stat.rotation} transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)]`}
                custom={index}
                variants={cardIn}
                initial="hidden"
                animate="visible"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-sm font-body mb-1">{stat.label}</p>
                    <p className="text-3xl text-text-heading">{stat.value}</p>
                  </div>
                  <Icon className="w-12 h-12 text-accent-blue opacity-20" />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="space-y-4">
          {paginatedTests.map((test, index) => (
            <motion.div key={test.id} custom={index} variants={cardIn} initial="hidden" animate="visible">
              <Link
                href={`/reading/${test.id}`}
                className="block bg-paper-white p-6 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] group transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_16px_rgba(0,0,0,0.14)]"
                style={{ transform: `rotate(${index % 2 === 0 ? "-0.3" : "0.3"}deg)` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,0.06)]">
                      <BookOpen className="w-6 h-6 text-accent-blue" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl text-text-heading mb-2">{test.book}</h3>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className="paper-tag bg-blue-100 text-blue-700">
                          <FileText className="w-3.5 h-3.5 mr-1 inline" />
                          {test.passages} passages
                        </span>
                        <span className="paper-tag bg-yellow-100 text-yellow-800">
                          <BookOpen className="w-3.5 h-3.5 mr-1 inline" />
                          {test.questions} questions
                        </span>
                        <span className="paper-tag bg-green-100 text-green-700">
                          <Clock className="w-3.5 h-3.5 mr-1 inline" />
                          {test.time} minutes
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-accent-blue group-hover:translate-x-1 transition-all duration-150" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="paper-btn bg-paper-white text-text-heading rounded-sm text-base disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <span className="paper-tag bg-paper-kraft text-text-heading px-6">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="paper-btn bg-paper-white text-text-heading rounded-sm text-base disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <motion.div
          className="mt-10 relative bg-paper-kraft p-8 shadow-[6px_6px_16px_rgba(0,0,0,0.1)] torn-bottom pb-14"
          style={{ transform: "rotate(0.3deg)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="tape tape-pink absolute -top-2 right-8 rotate-[6deg] w-16" />
          <h3 className="text-2xl text-text-heading mb-4">📖 About Reading Tests</h3>
          <div className="text-text-secondary font-body space-y-2 leading-relaxed">
            <p>✦ Each test consists of 3 reading passages with increasing difficulty</p>
            <p>✦ You have 60 minutes to complete 40 questions</p>
            <p>✦ Question types include multiple choice, true/false/not given, matching, and more</p>
            <p>✦ Tests are from official Cambridge IELTS preparation materials</p>
            <p>✦ Your score will be calculated based on the number of correct answers</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
