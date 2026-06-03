"use client";

import { motion, Variants } from "framer-motion";
import { Headphones, FileText, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import { IeltsListeningTest } from "@/types/listening";

interface Props {
  tests: IeltsListeningTest[];
}

const cardIn: Variants = {
  hidden: { opacity: 0, y: 16, rotate: -1 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" },
  }),
};

export default function ListeningTestsClient({ tests }: Props) {
  const statCards = [
    {
      label: "Total Tests",
      value: tests.length,
      icon: FileText,
      paper: "bg-purple-50",
      rotation: "rotate-[0.5deg]",
    },
    {
      label: "Test Duration",
      value: "30 min",
      icon: Clock,
      paper: "bg-pink-50",
      rotation: "rotate-[-1deg]",
    },
    {
      label: "Questions per Test",
      value: "40",
      icon: Headphones,
      paper: "bg-blue-50",
      rotation: "rotate-[0.8deg]",
    },
  ];

  return (
    <div className="min-h-screen bg-paper-cream py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header — paper strip */}
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
            <div className="tape tape-pink absolute -top-2 left-6 rotate-[-10deg] w-16" />
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-accent-purple p-2.5 rounded-sm shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
                <Headphones className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl text-text-heading">
                Listening Tests
              </h1>
            </div>
            <p className="text-text-secondary text-lg font-body pl-1">
              Official Cambridge IELTS Listening tests — 4 sections, 40
              questions each
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
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
                    <p className="text-text-secondary text-sm font-body mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl text-text-heading">{stat.value}</p>
                  </div>
                  <Icon className="w-12 h-12 text-accent-purple opacity-20" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Test List */}
        <div className="space-y-4">
          {tests.map((test, index) => {
            // Count total questions
            const totalQuestions = test.parts.reduce((acc, part) => {
              return acc + part.questionGroups.reduce((gAcc, group) => gAcc + group.questions.length, 0);
            }, 0);

            return (
              <motion.div
                key={test.id}
                custom={index}
                variants={cardIn}
                initial="hidden"
                animate="visible"
              >
                <Link href={`/listening/${encodeURIComponent(test.id)}`} className="block">
                  <div
                    className="block bg-paper-white p-6 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] group transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_16px_rgba(0,0,0,0.14)]"
                    style={{
                      transform: `rotate(${index % 2 === 0 ? "-0.3" : "0.3"}deg)`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,0.06)]">
                          <Headphones className="w-6 h-6 text-accent-purple" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl text-text-heading mb-2">
                            {test.title}
                          </h3>
                          <div className="flex flex-wrap gap-3 text-sm">
                            <span className="paper-tag bg-purple-100 text-purple-700">
                              <FileText className="w-3.5 h-3.5 mr-1 inline" />
                              {test.parts.length} sections
                            </span>
                            <span className="paper-tag bg-yellow-100 text-yellow-800">
                              <Headphones className="w-3.5 h-3.5 mr-1 inline" />
                              {totalQuestions} questions
                            </span>
                            <span className="paper-tag bg-green-100 text-green-700">
                              <Clock className="w-3.5 h-3.5 mr-1 inline" />
                              30 minutes
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-accent-purple group-hover:translate-x-1 transition-all duration-150" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Information Section — kraft paper note */}
        <motion.div
          className="mt-10 relative bg-purple-50 p-8 shadow-[6px_6px_16px_rgba(0,0,0,0.1)] torn-bottom pb-14"
          style={{ transform: "rotate(0.3deg)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="tape tape-green absolute -top-2 right-8 rotate-[6deg] w-16" />
          <h3 className="text-2xl text-text-heading mb-4">
            🎧 About Listening Tests
          </h3>
          <div className="text-text-secondary font-body space-y-2 leading-relaxed">
            <p>
              ✦ Each test consists of 4 sections with increasing difficulty
            </p>
            <p>✦ You will hear the audio only once — listen carefully!</p>
            <p>
              ✦ You have 30 minutes for the test plus 10 minutes to transfer
              answers
            </p>
            <p>
              ✦ Question types include multiple choice, form completion, map
              labeling, and more
            </p>
            <p>
              ✦ Tests are from official Cambridge IELTS preparation materials
            </p>
            <p>
              ✦ Make sure your audio is working properly before starting
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
