"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Headphones,
  Clock,
  Play,
  Pause,
  Volume2,
  Volume1,
  VolumeX,
  HelpCircle,
} from "lucide-react";
import { IeltsListeningTest, IeltsListeningQuestion } from "@/types/listening";
import { getSupabaseMediaUrl } from "@/utils/storage";
import { useHistoryStore } from "@/store/useHistoryStore";

const StaticHTMLRenderer = React.memo(function StaticHTMLRenderer({
  html,
}: {
  html: string;
}) {
  return (
    <div
      className="mb-6 prose prose-sm max-w-none text-gray-800 bg-white p-4 rounded border border-gray-100"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});

interface Props {
  testData: IeltsListeningTest;
}

const formatTime = (time: number) => {
  if (isNaN(time)) return "00:00";
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export default function ListeningTest({ testData }: Props) {
  const router = useRouter();

  // Navigation State
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const currentPart = testData.parts[currentPartIndex];

  // Audio State
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const progressRef = useRef<HTMLDivElement>(null);

  // Time remaining for test (e.g., 30 mins)
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Audio Handlers
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const newTime = pos * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newVol = Math.max(0, Math.min(1, pos));
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  // Reset audio when part changes
  useEffect(() => {
    if (audioRef.current) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      audioRef.current.load();
    }
  }, [currentPartIndex]);

  const audioUrl = getSupabaseMediaUrl(
    testData.testCode,
    currentPart.audioPath,
  );

  // Answers State
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswerChange = React.useCallback(
    (questionId: string, value: string) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    },
    [],
  );

  const processHTML = (html: string) => {
    if (!html) return html;
    return html.replace(/src="([^"]+)"/g, (match, p1) => {
      const fullUrl = getSupabaseMediaUrl(testData.testCode, p1);
      return `src="${fullUrl}"`;
    });
  };

  const processGapFillHTML = (
    rawHtml: string,
    questions: IeltsListeningQuestion[],
  ) => {
    if (!rawHtml || !questions || questions.length === 0) return rawHtml;

    const qNumbers = questions.map((q) => q.number).join("|");

    const gapRegex = new RegExp(
      `(?:<strong[^>]*>|<b>|\\s|&nbsp;|\\xA0)*(?<![a-zA-Z0-9])(${qNumbers})(?![a-zA-Z0-9])(?:</strong>|</b>|\\s|&nbsp;|\\xA0)*((?:(?!</p>|<br\\s*/?>|</?div>|</?table>).)*?)(_{2,}|\\.{2,}|\\u2026+|(?:\\.\\s*){3,})`,
      "gi",
    );

    let html = rawHtml.replace(gapRegex, (match, qNum, middleText) => {
      const qId =
        questions.find((q) => q.number.toString() === qNum.toString())?.id ||
        "";
      return `<strong class="ml-1 mr-2 text-blue-700">${qNum}</strong> ${middleText} <input type="text" data-qid="${qId}" class="gap-input border-b-2 border-gray-400 bg-transparent inline-block w-32 px-2 py-1 text-center font-semibold text-gray-800 focus:outline-none focus:border-blue-600 transition-colors" />`;
    });

    html = html.replace(/(<input[^>]*>)\\s*\\.\\s*\\.\\s*/g, "$1. ");
    html = html.replace(/(<input[^>]*>)\\s*\\.\\s+([a-z])/g, "$1 $2");
    html = html.replace(/(<input[^>]*>)\\s+\\.\\s*/g, "$1. ");
    html = html.replace(/(<input[^>]*>)\\s+,\\s*/g, "$1, ");

    return html;
  };

  // Sync state to DOM values on EVERY render to ensure inputs never desync
  useEffect(() => {
    const gapInputs = document.querySelectorAll(".gap-input");
    gapInputs.forEach((el) => {
      const input = el as HTMLInputElement;
      const qId = input.getAttribute("data-qid");
      if (qId) {
        const val = answers[qId] || "";
        if (input.value !== val) {
          input.value = val;
        }
      }
    });
  });

  // Native event listener using EVENT DELEGATION
  useEffect(() => {
    const handleDelegatedInput = (e: Event) => {
      const target = e.target as HTMLInputElement;

      if (
        target &&
        target.tagName === "INPUT" &&
        target.classList.contains("gap-input")
      ) {
        const qId = target.getAttribute("data-qid");
        if (qId) {
          handleAnswerChange(qId, target.value);
        }
      }
    };

    document.addEventListener("input", handleDelegatedInput);

    return () => {
      document.removeEventListener("input", handleDelegatedInput);
    };
  }, [handleAnswerChange]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 font-sans text-gray-900">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Merged Header & Audio Player Bar */}
      <header className="flex-none z-50 bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between sticky top-0">
        {/* Left: Audio Controls (Replacing Test Title) */}
        <div className="flex items-center gap-5 flex-1 max-w-2xl">
          <div className="cursor-pointer mr-2 flex-none flex items-center gap-2 text-gray-500 hover:text-gray-800 transition" onClick={() => router.push("/listening")}>
            <Headphones className="w-5 h-5" />
            <span className="text-sm font-medium">Exit</span>
          </div>
          <button
            onClick={togglePlayPause}
            className="flex-none size-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-1" />
            )}
          </button>

          <div className="flex-1 flex flex-col justify-center gap-1.5">
            <div className="flex justify-between items-end">
              <span className="text-xs font-semibold text-gray-800 uppercase tracking-wide">
                {currentPart.title}
              </span>
              <span className="text-xs font-mono font-bold text-gray-600">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            <div
              ref={progressRef}
              onClick={handleSeek}
              className="h-1.5 w-full bg-gray-200 rounded-full relative cursor-pointer group"
            >
              <div
                className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                style={{
                  width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow border border-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </div>

          <div className="flex-none flex items-center gap-2 pl-4 border-l border-gray-200 hidden md:flex">
            <div className="text-gray-500">
              {volume > 0.5 ? (
                <Volume2 className="w-4 h-4" />
              ) : volume > 0 ? (
                <Volume1 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </div>
            <div
              onClick={handleVolumeChange}
              className="w-16 h-1.5 bg-gray-200 rounded-full cursor-pointer relative group"
            >
              <div
                className="absolute top-0 left-0 h-full bg-gray-400 group-hover:bg-blue-500 transition-colors rounded-full"
                style={{ width: `${volume * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Right: Time and Help */}
        <div className="flex items-center gap-4 ml-6">
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-md border border-gray-200">
            <Clock size={18} className="text-gray-500" />
            <span className="font-mono font-bold text-gray-700">
              {formatTime(timeLeft)}
            </span>
          </div>
          <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition flex items-center gap-2">
            <HelpCircle size={16} /> Help
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Questions Area (Using Reading Test Question Column Style) */}
        <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-8 scroll-smooth pb-32">
          <div className="max-w-2xl mx-auto space-y-8">
            {currentPart.questionGroups.map((group, gIdx) => {
              const hasInlineGaps =
                group.groupContentHTML &&
                group.groupContentHTML.match(/(?:_{2,}|\.{2,}|\u2026+)/);

              return (
                <div
                  key={gIdx}
                  className="mb-10 bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
                >
                  {/* Instruction Box (Matches Reading Test) */}
                  <div className="mb-6 pb-4 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-2">
                      Questions {group.questions[0]?.number} -{" "}
                      {group.questions[group.questions.length - 1]?.number}
                    </p>
                    <div
                      className="text-sm text-gray-600 italic border-l-4 border-blue-500 pl-3 py-1 bg-blue-50/50"
                      dangerouslySetInnerHTML={{ __html: group.instructions }}
                    />
                  </div>

                  {group.sharedOptions && group.type !== "MULTIPLE_CHOICE" && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                      <ul className="flex flex-col gap-3 text-sm text-gray-700">
                        {group.sharedOptions.map((opt, i) => (
                          <li key={i}>{opt}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Group Context HTML */}
                  {group.groupContentHTML && (
                    <StaticHTMLRenderer
                      html={
                        hasInlineGaps
                          ? processGapFillHTML(
                              processHTML(group.groupContentHTML),
                              group.questions,
                            )
                          : processHTML(group.groupContentHTML)
                      }
                    />
                  )}

                  {/* Questions List (Matches Reading Test List Style) */}
                  {(!group.groupContentHTML || !hasInlineGaps) && (
                    <div className="space-y-5">
                      {group.questions.map((q) => (
                        <div key={q.id} className="flex flex-col gap-3">
                          <div className="flex gap-3 items-center">
                            <span className="font-bold text-gray-700 min-w-[24px]">
                              {q.number}.
                            </span>
                            {(() => {
                              if (!q.text) return null;
                              const parts = q.text.split(
                                /(_{2,}|\.{2,}|\u2026+)/,
                              );
                              if (parts.length === 1) {
                                return (
                                  <div
                                    className="text-gray-800 text-sm leading-relaxed flex-1"
                                    dangerouslySetInnerHTML={{ __html: q.text }}
                                  />
                                );
                              }
                              return (
                                <div className="text-gray-800 text-sm leading-relaxed flex-1 leading-8">
                                  {parts.map((part, i) => {
                                    if (
                                      part.match(/^(_{2,}|\.{2,}|\u2026+)$/)
                                    ) {
                                      return (
                                        <input
                                          key={i}
                                          type="text"
                                          value={answers[q.id || ""] || ""}
                                          onChange={(e) =>
                                            handleAnswerChange(
                                              q.id || "",
                                              e.target.value,
                                            )
                                          }
                                          className="border-b-2 border-gray-400 bg-transparent inline-block w-32 px-2 py-1 mx-1 text-center font-semibold text-gray-800 focus:outline-none focus:border-blue-600 transition-colors"
                                        />
                                      );
                                    }
                                    return (
                                      <span
                                        key={i}
                                        dangerouslySetInnerHTML={{
                                          __html: part,
                                        }}
                                      />
                                    );
                                  })}
                                </div>
                              );
                            })()}

                            {/* Standard Input for non-multiple choice and non-matching if no shared options */}
                            {group.type !== "MULTIPLE_CHOICE" &&
                              group.type !== "MATCHING" &&
                              !(
                                q.text &&
                                q.text.match(/(?:_{2,}|\.{2,}|\u2026+)/)
                              ) && (
                                <div className="flex-1 mt-0 mb-2 font-medium">
                                  <input
                                    className="w-full max-w-sm px-3 py-2 border rounded text-sm bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="Your answer"
                                    type="text"
                                    value={answers[q.id || ""] || ""}
                                    onChange={(e) =>
                                      handleAnswerChange(
                                        q.id || "",
                                        e.target.value,
                                      )
                                    }
                                  />
                                </div>
                              )}
                          </div>

                          {/* Multiple Choice Options */}
                          {group.type === "MULTIPLE_CHOICE" &&
                            q.options &&
                            q.options.length > 0 && (
                              <div className="flex flex-col gap-3 ml-9 mt-1">
                                {q.options.map((opt, i) => {
                                  const val = String.fromCharCode(65 + i);
                                  // Remove leading "A.", "B ", "C)", etc., from the data to prevent duplication
                                  const cleanOpt = opt.replace(
                                    /^[A-Z][\.\)\s]+/,
                                    "",
                                  );
                                  return (
                                    <label
                                      key={i}
                                      className="flex items-start gap-3 cursor-pointer"
                                    >
                                      <input
                                        type="radio"
                                        name={`q_${q.id}`}
                                        value={val}
                                        checked={answers[q.id || ""] === val}
                                        onChange={(e) =>
                                          handleAnswerChange(
                                            q.id || "",
                                            e.target.value,
                                          )
                                        }
                                        className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                                      />
                                      <div className="text-sm text-gray-700 leading-relaxed flex gap-2">
                                        <span className="font-semibold">
                                          {val}.
                                        </span>
                                        <span
                                          dangerouslySetInnerHTML={{
                                            __html: cleanOpt,
                                          }}
                                        />
                                      </div>
                                    </label>
                                  );
                                })}
                              </div>
                            )}

                          {/* Multiple Choice with Shared Options Fallback */}
                          {group.type === "MULTIPLE_CHOICE" &&
                            (!q.options || q.options.length === 0) &&
                            group.sharedOptions && (
                              <div className="flex flex-wrap gap-4 ml-9 mt-1">
                                {group.sharedOptions.map((_, i) => {
                                  const val = String.fromCharCode(65 + i);
                                  return (
                                    <label
                                      key={i}
                                      className="flex items-center gap-2 cursor-pointer"
                                    >
                                      <input
                                        type="radio"
                                        name={`q_${q.id}`}
                                        value={val}
                                        checked={answers[q.id || ""] === val}
                                        onChange={(e) =>
                                          handleAnswerChange(
                                            q.id || "",
                                            e.target.value,
                                          )
                                        }
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                      />
                                      <span className="text-sm font-semibold">
                                        {val}
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            )}

                          {/* Matching Select or Input */}
                          {group.type === "MATCHING" && (
                            <div className="ml-9">
                              {group.sharedOptions ? (
                                <select
                                  className="w-full max-w-sm px-3 py-2 border rounded text-sm bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  value={answers[q.id || ""] || ""}
                                  onChange={(e) =>
                                    handleAnswerChange(
                                      q.id || "",
                                      e.target.value,
                                    )
                                  }
                                >
                                  <option value="" disabled>
                                    Select...
                                  </option>
                                  {group.sharedOptions.map((opt, i) => {
                                    const val = String.fromCharCode(65 + i);
                                    return (
                                      <option key={i} value={val}>
                                        {val}. {opt}
                                      </option>
                                    );
                                  })}
                                </select>
                              ) : (
                                <input
                                  className="w-full max-w-sm px-3 py-2 border rounded text-sm bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  placeholder="Your answer"
                                  type="text"
                                  value={answers[q.id || ""] || ""}
                                  onChange={(e) =>
                                    handleAnswerChange(
                                      q.id || "",
                                      e.target.value,
                                    )
                                  }
                                />
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer Navigation - Exactly Matches Reading Test */}
      <footer className="flex-none bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between sticky bottom-0 z-50">
        <div className="flex gap-2">
          {testData.parts.map((part, idx) => {
            const partQuestions = part.questionGroups.reduce((acc, g) => acc.concat(g.questions), [] as IeltsListeningQuestion[]);
            const totalQ = partQuestions.length;
            const answeredQ = partQuestions.filter(q => answers[q.id || ""]?.trim()).length;

            return (
              <button
                key={idx}
                onClick={() => setCurrentPartIndex(idx)}
                className={`px-4 py-2 rounded-md text-sm font-bold transition flex items-center gap-2 border ${
                  currentPartIndex === idx
                    ? "bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200 shadow-sm"
                }`}
              >
                <span>Part {idx + 1}</span>
                <span className={`text-xs font-normal ${currentPartIndex === idx ? "text-blue-300" : "text-gray-300"}`}>|</span>
                <span className={`font-medium ${currentPartIndex === idx ? "text-blue-600" : "text-gray-600"}`}>
                  {answeredQ}/{totalQ}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-gray-600">
            Progress: {Object.keys(answers).length}/
            {testData.parts.reduce(
              (acc, p) =>
                acc +
                p.questionGroups.reduce(
                  (gAcc, g) => gAcc + g.questions.length,
                  0,
                ),
              0,
            )}{" "}
            answered
          </span>
          <button
            onClick={() => {
              if (!isSubmitted) {
                let score = 0;
                let totalQ = 0;
                testData.parts.forEach((p) => {
                  p.questionGroups.forEach((group) => {
                    group.questions.forEach((q) => {
                      totalQ++;
                      const userAnswer = answers[q.id]?.trim().toLowerCase();
                      const correctAnswers =
                        testData.answers[q.number.toString()] || [];
                      if (
                        userAnswer &&
                        correctAnswers.some(
                          (ans) => ans.toLowerCase() === userAnswer,
                        )
                      ) {
                        score++;
                      }
                    });
                  });
                });

                useHistoryStore.getState().addAttempt({
                  testId: testData.id,
                  score,
                  totalQuestions: totalQ,
                  timeTakenSeconds: 30 * 60 - timeLeft,
                  mode: "Full test",
                });
                setIsSubmitted(true);
                alert(`Test submitted! Your score: ${score}/${totalQ}`);
              }
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold shadow-sm transition"
          >
            {isSubmitted ? "Submitted" : "Submit Test"}
          </button>
        </div>
      </footer>
    </div>
  );
}
