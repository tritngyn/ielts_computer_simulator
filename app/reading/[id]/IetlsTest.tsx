"use client";
import React, { useEffect } from "react";
import { Clock, HelpCircle } from "lucide-react";
import { useTestStore } from "@/store/useTestScore";
import { useHistoryStore } from "@/store/useHistoryStore";
import {
  IeltsReadingTest,
  IeltsQuestionGroup,
  IeltsPassage,
} from "@/types/ielts";
import TestResultView from "./TestResultView";

// Memoized component to prevent React from touching the DOM once rendered.
// This is critical for raw HTML inputs so they don't lose focus or reset values
// when the parent re-renders (e.g., due to the timer ticking down).
const StaticHTMLRenderer = React.memo(function StaticHTMLRenderer({ html }: { html: string }) {
  return (
    <div
      className="mb-6 prose prose-sm max-w-none text-gray-800 bg-white p-4 rounded border border-gray-100"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});

interface IELTSTestProps {
  testData: IeltsReadingTest;
}

const IELTSTest: React.FC<IELTSTestProps> = ({ testData }) => {
  const {
    userAnswers,
    timeLeft,
    currentPassage,
    isSubmitted,
    showWarning,
    setAnswer,
    decrementTime,
    setCurrentPassage,
    setShowWarning,
    submit,
  } = useTestStore();

  const passage: IeltsPassage = testData.passages[currentPassage];

  // Calculate total questions in this passage
  const totalQuestionsInPassage = passage.questionGroups.reduce(
    (sum, group) => sum + group.questions.length,
    0,
  );

  const answeredCount = Object.keys(userAnswers).filter(
    (key) =>
      key.startsWith(`passage_${currentPassage}_`) && userAnswers[key]?.trim(),
  ).length;

  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      decrementTime();
    }, 1000);
    return () => clearInterval(timer);
  }, [decrementTime, isSubmitted]);

  useEffect(() => {
    if (showWarning) {
      const timeout = setTimeout(() => setShowWarning(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [showWarning, setShowWarning]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionNum: number, value: string) => {
    setAnswer(`passage_${currentPassage}_q${questionNum}`, value);
  };

  const processGapFillHTML = (rawHtml: string) => {
    if (!rawHtml) return "";
    return rawHtml.replace(
      /(?:<strong[^>]*>|\*\*|_|\s)*(\d+)(?:<\/strong>|\*\*|_|\s)*([._\u2026](?:[\s._\u2026]*[._\u2026]))/g,
      '<strong class="ml-1 mr-2 text-blue-700">$1</strong> <input type="text" data-qnum="$1" class="gap-input border-b-2 border-gray-400 bg-transparent inline-block w-32 px-2 py-1 text-center font-semibold text-gray-800 focus:outline-none focus:border-blue-600 transition-colors" />',
    );
  };

  // Sync state to DOM values on EVERY render to ensure inputs never desync
  useEffect(() => {
    const gapInputs = document.querySelectorAll(".gap-input");
    gapInputs.forEach((el) => {
      const input = el as HTMLInputElement;
      const qNum = input.getAttribute("data-qnum");
      if (qNum) {
        const val = userAnswers[`passage_${currentPassage}_q${qNum}`] || "";
        if (input.value !== val) {
          input.value = val;
        }
      }
    });
  });

  // Native event listener for gap-fill inputs
  useEffect(() => {
    const gapInputs = document.querySelectorAll(".gap-input");

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const qNum = target.getAttribute("data-qnum");
      if (qNum) {
        setAnswer(`passage_${currentPassage}_q${qNum}`, target.value);
      }
    };

    gapInputs.forEach((el) => {
      el.addEventListener("input", handleNativeInput);
    });

    return () => {
      gapInputs.forEach((el) => {
        el.removeEventListener("input", handleNativeInput);
      });
    };
  }, [currentPassage, setAnswer]);

  if (isSubmitted) {
    return <TestResultView testData={testData} />;
  }

  const renderInput = (qNumber: number) => {
    return (
      <div className="flex items-center gap-3 w-full">
        <input
          type="text"
          value={userAnswers[`passage_${currentPassage}_q${qNumber}`] || ""}
          onChange={(e) => handleAnswerChange(qNumber, e.target.value)}
          className="flex-1 px-3 py-2 border rounded text-sm bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="Your answer"
        />
      </div>
    );
  };

  const renderGroup = (group: IeltsQuestionGroup) => {
    return (
      <div className="mb-10 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="mb-6 pb-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-2">
            {group.type.replace(/_/g, " ")}
          </p>
          <div
            className="text-sm text-gray-600 italic border-l-4 border-blue-500 pl-3 py-1 bg-blue-50/50"
            dangerouslySetInnerHTML={{ __html: group.instructions }}
          />
        </div>

        {group.sharedOptions && (
          <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
              {group.sharedOptions.map((opt, i) => (
                <li key={i}>{opt}</li>
              ))}
            </ul>
          </div>
        )}

        {group.groupContentHTML && (
          <StaticHTMLRenderer
            html={
              group.type === "GAP_FILL"
                ? processGapFillHTML(group.groupContentHTML)
                : group.groupContentHTML
            }
          />
        )}

        {group.type !== "GAP_FILL" && (
          <div className="space-y-5">
            {group.questions.map((q) => {
              if (
                group.type === "TRUE_FALSE_NOT_GIVEN" ||
                group.type === "YES_NO_NOT_GIVEN"
              ) {
                const options = group.sharedOptions || [
                  "TRUE",
                  "FALSE",
                  "NOT GIVEN",
                ];
                return (
                  <div key={q.number} className="flex flex-col gap-3">
                    <div className="flex gap-3">
                      <span className="font-bold text-gray-700 min-w-[24px]">
                        {q.number}.
                      </span>
                      <span
                        className="text-gray-800 text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: q.text }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-4 ml-9">
                      {options.map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`passage_${currentPassage}_q${q.number}`}
                            value={opt}
                            checked={
                              userAnswers[
                                `passage_${currentPassage}_q${q.number}`
                              ] === opt
                            }
                            onChange={(e) =>
                              handleAnswerChange(q.number, e.target.value)
                            }
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              }

              if (group.type === "MULTIPLE_CHOICE") {
                if (q.options && q.options.length > 0) {
                  return (
                    <div key={q.number} className="flex flex-col gap-3">
                      <div className="flex gap-3">
                        <span className="font-bold text-gray-700 min-w-[24px]">
                          {q.number}.
                        </span>
                        <span
                          className="text-gray-800 text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: q.text }}
                        />
                      </div>
                      <div className="flex flex-col gap-3 ml-9 mt-1">
                        {q.options.map((optHtml, i) => {
                          const letter = String.fromCharCode(65 + i);
                          return (
                            <label
                              key={letter}
                              className="flex items-start gap-3 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name={`passage_${currentPassage}_q${q.number}`}
                                value={letter}
                                checked={
                                  userAnswers[
                                    `passage_${currentPassage}_q${q.number}`
                                  ] === letter
                                }
                                onChange={(e) =>
                                  handleAnswerChange(q.number, e.target.value)
                                }
                                className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                              />
                              <span
                                className="text-sm text-gray-700 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: optHtml }}
                              />
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                } else {
                  const options = group.sharedOptions
                    ? group.sharedOptions.map((_, i) =>
                        String.fromCharCode(65 + i),
                      )
                    : ["A", "B", "C", "D", "E"];
                  return (
                    <div key={q.number} className="flex items-center gap-3">
                      <span className="font-bold text-gray-700 min-w-[24px]">
                        {q.number}.
                      </span>
                      <span
                        className="text-gray-800 text-sm flex-1"
                        dangerouslySetInnerHTML={{ __html: q.text }}
                      />
                      <div className="flex flex-wrap gap-4">
                        {options.map((opt) => (
                          <label
                            key={opt}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={`passage_${currentPassage}_q${q.number}`}
                              value={opt}
                              checked={
                                userAnswers[
                                  `passage_${currentPassage}_q${q.number}`
                                ] === opt
                              }
                              onChange={(e) =>
                                handleAnswerChange(q.number, e.target.value)
                              }
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-semibold">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                }
              }

              // Default for MATCHING_HEADINGS, MATCHING_INFORMATION
              return (
                <div key={q.number} className="flex items-center gap-3">
                  <span className="font-bold text-gray-700 min-w-[24px]">
                    {q.number}.
                  </span>
                  {q.text && (
                    <span className="text-gray-800 text-sm flex-1">
                      {q.text}
                    </span>
                  )}
                  <div className="flex-1 mt-2 mb-2 font-medium">
                    {renderInput(q.number)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-gray-800">{testData.title}</h1>
        </div>
        <div className="flex items-center gap-4">
          {showWarning && (
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-medium animate-pulse border border-red-200">
              ⚠️ 10 minutes remaining!
            </span>
          )}
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

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Passage Column */}
        <div className="w-1/2 bg-white p-8 overflow-y-auto border-r border-gray-200">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-gray-900">
              {passage.title}
            </h2>
            {passage.subtitle && (
              <p className="text-lg text-gray-600 mb-8 italic">
                {passage.subtitle}
              </p>
            )}
            <div
              className="prose prose-blue max-w-none text-gray-800 leading-relaxed text-[15px]"
              dangerouslySetInnerHTML={{ __html: passage.contentHTML }}
            />
          </div>
        </div>

        {/* Questions Column */}
        <div className="w-1/2 bg-[#f8fafc] p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {passage.questionGroups.map((group) => (
              <React.Fragment key={group.id}>
                {renderGroup(group)}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <footer className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between sticky bottom-0 z-50">
        <div className="flex gap-2">
          {testData.passages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPassage(idx)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                currentPassage === idx
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Passage {idx + 1}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-gray-600">
            Passage Progress: {answeredCount}/{totalQuestionsInPassage} answered
          </span>
          <button
            onClick={() => {
              if (!isSubmitted) {
                // Calculate and save to history on first submit
                let score = 0;
                let totalQ = 0;
                testData.passages.forEach((p, pIndex) => {
                  p.questionGroups.forEach((group) => {
                    group.questions.forEach((q) => {
                      totalQ++;
                      const userAnswer = userAnswers[
                        `passage_${pIndex}_q${q.number}`
                      ]
                        ?.trim()
                        .toLowerCase();
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
                  timeTakenSeconds: 3600 - timeLeft,
                  mode: "Full test",
                });
                submit();
              }
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold shadow-sm transition"
          >
            Submit Test
          </button>
        </div>
      </footer>
    </div>
  );
};

export default IELTSTest;
