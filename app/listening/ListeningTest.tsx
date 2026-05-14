"use client";

import React from "react";
import { useRouter } from "next/navigation";

const ListeningTest: React.FC = () => {
  const router = useRouter();

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-gray-100 font-display flex flex-col h-screen overflow-hidden">
      <header className="flex-none w-full bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark z-20 shadow-sm relative">
        <div className="px-6 py-3 flex items-center justify-between">
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => router.push("/listening")}
          >
            <div className="flex items-center justify-center size-10 rounded-lg bg-red-500/10 text-red-600">
              <span className="material-symbols-outlined text-2xl">
                headphones
              </span>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">
                IELTS Academic Listening
              </h1>
              <p className="text-xs text-text-secondary dark:text-gray-400 font-medium">
                Test 04 / Vol 12
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden md:flex items-center gap-3 bg-background-light dark:bg-background-dark px-4 py-2 rounded-full border border-border-light dark:border-border-dark">
              <span className="material-symbols-outlined text-red-600">
                timer
              </span>
              <span className="text-xl font-bold font-mono tracking-widest text-red-600">
                28:45
              </span>
              <span className="text-xs text-text-secondary dark:text-gray-400 font-medium uppercase tracking-wider">
                Remaining
              </span>
            </div>
            <div className="h-8 w-px bg-border-light dark:border-border-dark hidden md:block"></div>
            <div className="flex items-center gap-2">
              <button className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-semibold text-text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-lg">help</span>
                Help
              </button>
              <button className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-semibold text-text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-lg">
                  visibility_off
                </span>
                Hide
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Audio Player Bar */}
        <div className="flex-none z-30 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark shadow-md">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-6">
            <button className="flex-none size-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-3xl filled">
                pause
              </span>
            </button>
            <div className="flex-1 flex flex-col justify-center gap-1.5">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-primary tracking-wide">
                  PART 1: MOVING COMPANY INQUIRY
                </span>
                <span className="text-xs font-mono font-medium text-text-secondary dark:text-gray-400">
                  04:12 / 30:00
                </span>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full relative cursor-pointer overflow-hidden group">
                <div className="absolute top-0 left-0 h-full w-[14%] bg-primary rounded-full relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>
            <div className="flex-none flex items-center gap-3 pl-4 border-l border-border-light dark:border-border-dark">
              <button className="text-text-secondary hover:text-text-main dark:hover:text-white transition-colors">
                <span className="material-symbols-outlined">volume_up</span>
              </button>
              <div className="w-20 h-1 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative group">
                <div className="absolute top-0 left-0 h-full w-[70%] bg-text-secondary group-hover:bg-primary transition-colors"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark scroll-smooth pb-32">
          <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8">
            <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl">
              <span className="material-symbols-outlined text-primary text-2xl mt-1">
                info
              </span>
              <div>
                <h2 className="font-bold text-text-main dark:text-white mb-1">
                  Part 1 Instructions
                </h2>
                <p className="text-sm text-text-secondary dark:text-gray-300">
                  You will hear a telephone conversation between a woman and a
                  representative of a moving company. Listen carefully and
                  answer questions 1 to 5.
                </p>
              </div>
            </div>

            {/* Questions 1-5 */}
            <section className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
              <div className="p-6 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
                <div>
                  <h3 className="text-xl font-bold text-text-main dark:text-white">
                    Questions 1-5
                  </h3>
                  <p className="text-sm text-text-secondary mt-1">
                    Complete the form below. Write{" "}
                    <strong className="text-text-main dark:text-gray-200">
                      NO MORE THAN TWO WORDS AND/OR A NUMBER
                    </strong>{" "}
                    for each answer.
                  </p>
                </div>
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-200 text-xs font-bold uppercase rounded-full">
                  Form Completion
                </span>
              </div>
              <div className="p-8">
                <div className="max-w-2xl mx-auto border border-border-light dark:border-gray-600 p-8 rounded-lg bg-white dark:bg-[#1e2636] shadow-sm relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-200 dark:bg-gray-600 rounded-full opacity-50"></div>
                  <h4 className="text-center text-lg font-black uppercase tracking-widest text-gray-400 mb-8 border-b-2 border-dashed border-gray-200 dark:border-gray-700 pb-4">
                    {" "}
                    Moving Services
                  </h4>
                  <div className="space-y-6 font-body">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center group">
                      <div className="md:col-span-4 text-sm font-bold text-gray-500 uppercase tracking-wide">
                        Customer Name:
                      </div>
                      <div className="md:col-span-8 flex items-center gap-3">
                        <span className="text-lg text-text-main dark:text-gray-200">
                          Mrs. Jane
                        </span>
                        <div className="relative flex-1">
                          <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-primary font-bold">
                            1
                          </span>
                          <input
                            className="w-full bg-gray-50 dark:bg-gray-800 border-b-2 border-transparent border-b-gray-300 dark:border-b-gray-600 focus:border-b-primary focus:ring-0 px-2 py-1 text-text-main dark:text-white transition-colors placeholder-gray-400 font-medium"
                            placeholder="Answer..."
                            type="text"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center group">
                      <div className="md:col-span-4 text-sm font-bold text-gray-500 uppercase tracking-wide">
                        Move Distance:
                      </div>
                      <div className="md:col-span-8 flex items-center gap-3">
                        <span className="text-lg text-text-main dark:text-gray-200">
                          Approximately
                        </span>
                        <div className="relative w-24">
                          <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-primary font-bold">
                            2
                          </span>
                          <input
                            className="w-full bg-gray-50 dark:bg-gray-800 border-b-2 border-transparent border-b-gray-300 dark:border-b-gray-600 focus:border-b-primary focus:ring-0 px-2 py-1 text-text-main dark:text-white transition-colors text-center font-medium"
                            type="text"
                          />
                        </div>
                        <span className="text-lg text-text-main dark:text-gray-200">
                          miles
                        </span>
                      </div>
                    </div>
                    {/* Simplified for brevity based on screenshot */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center group">
                      <div className="md:col-span-4 text-sm font-bold text-gray-500 uppercase tracking-wide">
                        Collection Date:
                      </div>
                      <div className="md:col-span-8 flex items-center gap-3">
                        <div className="relative flex-1">
                          <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-primary font-bold">
                            3
                          </span>
                          <input
                            className="w-full bg-gray-50 dark:bg-gray-800 border-b-2 border-transparent border-b-gray-300 dark:border-b-gray-600 focus:border-b-primary focus:ring-0 px-2 py-1 text-text-main dark:text-white transition-colors font-medium"
                            type="text"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center group">
                      <div className="md:col-span-4 text-sm font-bold text-gray-500 uppercase tracking-wide">
                        Items to pack:
                      </div>
                      <div className="md:col-span-8 flex items-center gap-3">
                        <span className="text-lg text-text-main dark:text-gray-200">
                          Large furniture, piano, and
                        </span>
                        <div className="relative flex-1">
                          <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-primary font-bold">
                            4
                          </span>
                          <input
                            className="w-full bg-gray-50 dark:bg-gray-800 border-b-2 border-transparent border-b-gray-300 dark:border-b-gray-600 focus:border-b-primary focus:ring-0 px-2 py-1 text-text-main dark:text-white transition-colors font-medium"
                            type="text"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center group">
                      <div className="md:col-span-4 text-sm font-bold text-gray-500 uppercase tracking-wide">
                        Contact Number:
                      </div>
                      <div className="md:col-span-8 flex items-center gap-3">
                        <div className="relative flex-1">
                          <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-primary font-bold">
                            5
                          </span>
                          <input
                            className="w-full bg-gray-50 dark:bg-gray-800 border-b-2 border-transparent border-b-gray-300 dark:border-b-gray-600 focus:border-b-primary focus:ring-0 px-2 py-1 text-text-main dark:text-white transition-colors font-medium"
                            placeholder="07..."
                            type="text"
                          />
                        </div>
                        <button className="text-xs text-text-secondary hover:text-primary flex items-center gap-1 ml-2">
                          <span className="material-symbols-outlined text-sm">
                            flag
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Questions 6-10 */}
            <section className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
              <div className="p-6 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
                <div>
                  <h3 className="text-xl font-bold text-text-main dark:text-white">
                    Questions 6-10
                  </h3>
                  <p className="text-sm text-text-secondary mt-1">
                    Choose the correct letter,{" "}
                    <strong className="text-text-main dark:text-gray-200">
                      A, B or C
                    </strong>
                    .
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-200 text-xs font-bold uppercase rounded-full">
                  Multiple Choice
                </span>
              </div>
              <div className="p-6 md:p-8 space-y-8">
                <div className="relative pl-8">
                  <span className="absolute left-0 top-0 text-lg font-bold text-primary">
                    6
                  </span>
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-base font-medium text-text-main dark:text-gray-100 leading-relaxed">
                      Which service does the customer decide to add to her
                      package?
                    </p>
                    <button className="text-xs text-text-secondary hover:text-primary flex items-center gap-1 flex-none ml-4">
                      <span className="material-symbols-outlined text-sm">
                        flag
                      </span>{" "}
                      Flag
                    </button>
                  </div>
                  <div className="space-y-3 mt-3">
                    {[
                      "Premium insurance coverage",
                      "Overnight storage",
                      "Cleaning service",
                    ].map((opt, i) => (
                      <label
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border-light dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all group"
                      >
                        <input
                          className="size-4 text-primary focus:ring-primary border-gray-300"
                          name="q6"
                          type="radio"
                        />
                        <span className="text-sm font-semibold text-gray-500 w-6">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-text-main dark:group-hover:text-white">
                          {opt}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>
            <div className="h-12"></div>
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 w-full bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col">
          <div className="flex items-center px-4 md:px-6 py-3 overflow-x-auto scrollbar-hide bg-gray-50 dark:bg-[#151c2a]">
            <div className="flex items-center gap-4 mr-6 flex-none sticky left-0 bg-gray-50 dark:bg-[#151c2a] z-10 pr-2 border-r border-border-light dark:border-gray-700/50">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                Review:
              </span>
            </div>
            <div className="flex gap-2 flex-nowrap min-w-max pr-4">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  className="size-8 flex items-center justify-center rounded bg-primary text-white text-xs font-bold shadow-sm hover:bg-blue-600 transition"
                >
                  {" "}
                  {n}{" "}
                </button>
              ))}
              <button className="relative size-8 flex items-center justify-center rounded bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200 text-xs font-bold border border-orange-200 dark:border-orange-800">
                4
                <span className="absolute -top-1 -right-1 size-2 bg-orange-500 rounded-full border border-white dark:border-gray-800"></span>
              </button>
              <button className="size-8 flex items-center justify-center rounded ring-2 ring-primary ring-offset-2 dark:ring-offset-background-dark bg-white dark:bg-surface-dark text-text-main dark:text-white text-xs font-bold shadow-sm">
                5
              </button>
              {[6, 7, 8, 9, 10].map((n) => (
                <button
                  key={n}
                  className="size-8 flex items-center justify-center rounded bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-secondary dark:text-gray-400 text-xs font-medium hover:border-primary hover:text-primary transition-colors"
                >
                  {n}
                </button>
              ))}
              <div className="w-px h-8 bg-border-light dark:border-gray-700 mx-2"></div>
              <div className="flex items-center gap-1.5 opacity-40">
                <button className="size-8 flex items-center justify-center rounded bg-transparent border border-border-light dark:border-border-dark text-text-secondary text-xs">
                  ...
                </button>
                <button className="size-8 flex items-center justify-center rounded bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-secondary text-xs font-medium">
                  40
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between px-6 py-3 border-t border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-sm font-bold text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-sm">
              <span className="material-symbols-outlined text-lg">
                chevron_left
              </span>{" "}
              Previous
            </button>
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded bg-primary"></span>
                <span className="text-xs font-medium text-text-secondary">
                  Answered
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-3 rounded bg-orange-500"></span>
                <span className="text-xs font-medium text-text-secondary">
                  Flagged
                </span>
              </div>
            </div>
            <button className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">
              Next{" "}
              <span className="material-symbols-outlined text-lg">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ListeningTest;
