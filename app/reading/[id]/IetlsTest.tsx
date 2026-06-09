"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock, HelpCircle, BookOpen } from "lucide-react";
import { useTestStore } from "@/store/useTestScore";
import { useHistoryStore } from "@/store/useHistoryStore";
import {
  IeltsReadingTest,
  IeltsQuestionGroup,
  IeltsPassage,
  IeltsQuestion,
} from "@/types/ielts";
import TestResultView from "./TestResultView";

// Memoized component to prevent React from touching the DOM once rendered.
// This is critical for raw HTML inputs so they don't lose focus or reset values
// when the parent re-renders (e.g., due to the timer ticking down).
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

interface IELTSTestProps {
  testData: IeltsReadingTest;
}

import { useState } from "react";

const IELTSTest: React.FC<IELTSTestProps> = ({ testData }) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const processGapFillHTML = (rawHtml: string, questions: IeltsQuestion[]) => {
    if (!rawHtml || !questions || questions.length === 0) return rawHtml;
    
    // Only match the EXACT question numbers belonging to this group
    const qNumbers = questions.map(q => q.number).join('|');

    // Matches: 
    // 1. Exact Question number (e.g., 24|25|26) with optional bold/spaces around it
    // 2. Middle text (any characters except block boundaries like </p>)
    // 3. Gap sequence (strictly pure dots, underscores, ellipses)
    const gapRegex = new RegExp(
      `(?:<strong[^>]*>|<b>|\\s|&nbsp;|\\xA0)*(?<![a-zA-Z0-9])(${qNumbers})(?![a-zA-Z0-9])(?:</strong>|</b>|\\s|&nbsp;|\\xA0)*((?:(?!</p>|<br\\s*/?>|</?div>|</?table>).)*?)(_{2,}|\\.{2,}|\\u2026+|(?:\\.\\s*){3,})`,
      "gi"
    );

    let html = rawHtml.replace(gapRegex, (match, qNum, middleText) => {
      return `<strong class="ml-1 mr-2 text-blue-700">${qNum}</strong> ${middleText} <input type="text" data-qnum="${qNum}" class="gap-input border-b-2 border-gray-400 bg-transparent inline-block w-32 px-2 py-1 text-center font-semibold text-gray-800 focus:outline-none focus:border-blue-600 transition-colors" />`;
    });

    // Post-processing: Cleanup grammar anomalies introduced by OCR artifacts
    // 1. Double dots (e.g. `<input /> . . It` -> `<input />. It`)
    html = html.replace(/(<input[^>]*>)\s*\.\s*\.\s*/g, '$1. ');
    
    // 2. Rogue dot before a lowercase letter (e.g. `<input /> . are` -> `<input /> are`)
    html = html.replace(/(<input[^>]*>)\s*\.\s+([a-z])/g, '$1 $2');
    
    // 3. Space before period (e.g. `<input /> . It` -> `<input />. It`)
    html = html.replace(/(<input[^>]*>)\s+\.\s*/g, '$1. ');
    
    // 4. Rogue commas (e.g. `<input /> ,` -> `<input />, `)
    html = html.replace(/(<input[^>]*>)\s+,\s*/g, '$1, ');

    return html;
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

  // Native event listener using EVENT DELEGATION
  // This is bulletproof: it attaches ONE listener to the document.
  // Even if React completely destroys and recreates the inputs, the listener still catches the typing!
  useEffect(() => {
    const handleDelegatedInput = (e: Event) => {
      const target = e.target as HTMLInputElement;

      // Only process events from our specific gap inputs
      if (
        target &&
        target.tagName === "INPUT" &&
        target.classList.contains("gap-input")
      ) {
        const qNum = target.getAttribute("data-qnum");
        if (qNum) {
          setAnswer(`passage_${currentPassage}_q${qNum}`, target.value);
        }
      }
    };

    document.addEventListener("input", handleDelegatedInput);

    return () => {
      document.removeEventListener("input", handleDelegatedInput);
    };
  }, [currentPassage, setAnswer]);

  if (!isMounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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

        {group.sharedOptions && group.type !== "MULTIPLE_CHOICE" && (
          <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
            <ul className="flex flex-col gap-3 text-sm text-gray-700">
              {group.sharedOptions.map((opt, i) => {
                const match = opt.trim().match(/^(TRUE|FALSE|NOT GIVEN|YES|NO)(?:\s+(.*))?/i);
                if (match) {
                  const keyword = match[1].toUpperCase();
                  let desc = match[2];

                  if (!desc || desc.trim() === "") {
                    if (keyword === "TRUE") desc = "if the statement agrees with the information";
                    else if (keyword === "FALSE") desc = "if the statement contradicts the information";
                    else if (keyword === "YES") desc = "if the statement agrees with the claims of the writer";
                    else if (keyword === "NO") desc = "if the statement contradicts the claims of the writer";
                    else if (keyword === "NOT GIVEN") {
                      desc = group.type === "YES_NO_NOT_GIVEN" 
                        ? "if it is impossible to say what the writer thinks about this"
                        : "if there is no information on this";
                    }
                  }

                  return (
                    <li key={i} className="flex gap-4">
                      <span className="font-bold w-24 shrink-0">{keyword}</span>
                      <span>{desc}</span>
                    </li>
                  );
                }
                return <li key={i}>{opt}</li>;
              })}
            </ul>
          </div>
        )}

        {group.groupContentHTML && (
          <StaticHTMLRenderer
            html={
              group.type === "GAP_FILL"
                ? processGapFillHTML(group.groupContentHTML, group.questions)
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
                      <div
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
                        <div
                          className="text-gray-800 text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: q.text }}
                        />
                      </div>
                      <div className="flex flex-col gap-3 ml-9 mt-1">
                        {q.options.map((optHtml, i) => {
                          const letter = String.fromCharCode(65 + i);
                          // Remove leading "A.", "B ", "C)", etc., from the data to prevent duplication
                          const cleanOpt = optHtml.replace(/^[A-Z][\.\)\s]+/, "");
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
                              <div className="text-sm text-gray-700 leading-relaxed flex gap-2">
                                <span className="font-semibold">{letter}.</span>
                                <span dangerouslySetInnerHTML={{ __html: cleanOpt }} />
                              </div>
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
                      <div
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
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <header className="flex-none z-50 bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between sticky top-0">
        <div className="flex items-center gap-4">
          <div className="cursor-pointer flex-none flex items-center gap-2 text-gray-500 hover:text-gray-800 transition" onClick={() => router.push("/reading")}>
            <BookOpen className="w-5 h-5" />
            <span className="text-sm font-medium">Exit</span>
          </div>
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
          {testData.passages.map((p, idx) => {
            const totalQ = p.questionGroups.reduce((acc, g) => acc + g.questions.length, 0);
            const answeredQ = p.questionGroups.reduce((acc, g) => {
              return acc + g.questions.filter(q => userAnswers[`passage_${idx}_q${q.number}`]?.trim()).length;
            }, 0);

            return (
              <button
                key={idx}
                onClick={() => setCurrentPassage(idx)}
                className={`px-4 py-2 rounded-md text-sm font-bold transition flex items-center gap-2 border ${
                  currentPassage === idx
                    ? "bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200 shadow-sm"
                }`}
              >
                <span>Passage {idx + 1}</span>
                <span className={`text-xs font-normal ${currentPassage === idx ? "text-blue-300" : "text-gray-300"}`}>|</span>
                <span className={`font-medium ${currentPassage === idx ? "text-blue-600" : "text-gray-600"}`}>
                  {answeredQ}/{totalQ}
                </span>
              </button>
            );
          })}
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
