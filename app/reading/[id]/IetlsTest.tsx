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
import dynamic from "next/dynamic";
import SkeletonLoader from "@/app/components/SkeletonLoader";

const TestResultView = dynamic(() => import("./TestResultView"), {
  ssr: false,
  loading: () => <SkeletonLoader />,
});

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
      className="mb-6 prose prose-sm max-w-none text-foreground bg-background p-5 rounded-xl border border-border/60 shadow-sm"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});

interface IELTSTestProps {
  testData: IeltsReadingTest;
  user?: any;
}

import { useState } from "react";

const IELTSTest: React.FC<IELTSTestProps> = ({ testData, user }) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [mobileTab, setMobileTab] = useState<'passage' | 'questions'>('passage');

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
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    );
  }

  if (isSubmitted) {
    return <TestResultView testData={testData} user={user} />;
  }

  const renderInput = (qNumber: number) => {
    return (
      <div className="flex items-center gap-3 w-full">
        <input
          type="text"
          value={userAnswers[`passage_${currentPassage}_q${qNumber}`] || ""}
          onChange={(e) => handleAnswerChange(qNumber, e.target.value)}
          className="flex-1 px-4 py-2.5 border rounded-lg text-sm bg-background border-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-colors outline-none"
          placeholder="Your answer"
        />
      </div>
    );
  };

  const renderGroup = (group: IeltsQuestionGroup) => {
    return (
      <div className="bg-background p-6 md:p-8 rounded-2xl border border-border shadow-sm">
        <div className="mb-6 pb-4 border-b border-border/50">
          <p className="text-base font-bold text-foreground/90 uppercase tracking-wider mb-3">
            Questions {group.questions.length > 1 ? `${group.questions[0]?.number} - ${group.questions[group.questions.length - 1]?.number}` : group.questions[0]?.number}
          </p>
          <div
            className="text-base text-foreground/80 font-medium italic border-l-4 border-foreground/30 pl-4 py-2 bg-black/[0.02]"
            dangerouslySetInnerHTML={{ __html: group.instructions }}
          />
        </div>

        {group.sharedOptions && group.type !== "MULTIPLE_CHOICE" && (
          <div className="mb-8 p-5 bg-black/[0.02] rounded-xl border border-border/50">
            <ul className="flex flex-col gap-3 text-sm text-foreground/90">
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
            {group.type === "MULTIPLE_CHOICE" && group.sharedOptions && group.sharedOptions.length > 0 ? (
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 items-center">
                  <span className="font-bold text-foreground min-w-[24px]">
                    {group.questions.length > 1
                      ? `${group.questions[0].number}-${group.questions[group.questions.length - 1].number}.`
                      : `${group.questions[0].number}.`}
                  </span>
                  {group.questions[0].text && (
                    <div
                      className="text-foreground/90 text-sm leading-relaxed flex-1"
                      dangerouslySetInnerHTML={{ __html: group.questions[0].text }}
                    />
                  )}
                </div>
                
                <div className="flex flex-col gap-3 ml-9 mt-1">
                  {group.sharedOptions.map((opt, i) => {
                    const val = String.fromCharCode(65 + i);
                    const cleanOpt = opt.replace(/^[A-Z][\.\)\s]+/, "");
                    
                    const isSelected = group.questions.some(
                      q => userAnswers[`passage_${currentPassage}_q${q.number}`] === val
                    );
                    
                    return (
                      <label
                        key={i}
                        className="flex items-start gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          value={val}
                          checked={isSelected}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            const currentSelected = group.questions
                              .map(q => userAnswers[`passage_${currentPassage}_q${q.number}`])
                              .filter(Boolean);
                            
                            let newSelected;
                            if (checked) {
                              if (currentSelected.length < group.questions.length) {
                                newSelected = [...currentSelected, val].sort();
                              } else {
                                newSelected = [...currentSelected.slice(1), val].sort();
                              }
                            } else {
                              newSelected = currentSelected.filter(v => v !== val);
                            }
                            
                            group.questions.forEach(q => {
                              setAnswer(`passage_${currentPassage}_q${q.number}`, "");
                            });
                            newSelected.forEach((selectedVal, idx) => {
                              const q = group.questions[idx];
                              if (q) {
                                setAnswer(`passage_${currentPassage}_q${q.number}`, selectedVal);
                              }
                            });
                          }}
                          className="mt-1 w-4 h-4 text-foreground focus:ring-foreground rounded border-border"
                        />
                        <div className="text-sm text-foreground/90 leading-relaxed flex gap-2">
                          <span className="font-semibold">{val}.</span>
                          <span dangerouslySetInnerHTML={{ __html: cleanOpt }} />
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ) : (
            group.questions.map((q) => {
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
                      <span className="font-bold text-foreground min-w-[24px]">
                        {q.number}.
                      </span>
                      <div
                        className="text-foreground/90 text-sm leading-relaxed"
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
                            className="w-4 h-4 text-foreground focus:ring-foreground border-border"
                          />
                          <span className="text-sm font-medium text-foreground/90">{opt}</span>
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
                        <span className="font-bold text-foreground min-w-[24px]">
                          {q.number}.
                        </span>
                        <div
                          className="text-foreground/90 text-sm leading-relaxed"
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
                                className="mt-1 w-4 h-4 text-foreground focus:ring-foreground border-border"
                              />
                              <div className="text-sm text-foreground/90 leading-relaxed flex gap-2">
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
                      <span className="font-bold text-foreground min-w-[24px]">
                        {q.number}.
                      </span>
                      <div
                        className="text-foreground/90 text-sm flex-1"
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
                              className="w-4 h-4 text-foreground focus:ring-foreground border-border"
                            />
                            <span className="text-sm font-medium">{opt}</span>
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
                  <span className="font-bold text-foreground min-w-[24px]">
                    {q.number}.
                  </span>
                  {q.text && (
                    <span className="text-foreground/90 text-sm flex-1">
                      {q.text}
                    </span>
                  )}
                  <div className="flex-1 mt-2 mb-2 font-medium">
                    {renderInput(q.number)}
                  </div>
                </div>
              );
            })
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background font-body text-foreground">
      {/* Header */}
      <header className="flex-none z-50 bg-background border-b border-border px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0">
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="cursor-pointer flex-none flex items-center gap-1 sm:gap-2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => router.push("/reading")}>
            <BookOpen className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">Exit Test</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-5">
          {showWarning && (
            <span className="hidden sm:inline-block bg-red-50 text-red-600 px-3 py-1 rounded-md text-sm font-semibold animate-pulse border border-red-200">
              ⚠️ 10 minutes remaining
            </span>
          )}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-black/5 px-2 sm:px-4 py-1 sm:py-2 rounded-lg border border-black/5">
            <Clock size={16} className="text-muted-foreground" />
            <span className="font-mono font-bold text-foreground text-sm sm:text-base">
              {formatTime(timeLeft)}
            </span>
          </div>
          <button className="hidden sm:flex px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-black/5 rounded-lg transition-colors items-center gap-2 font-medium">
            <HelpCircle size={16} /> Help
          </button>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex border-b border-border bg-background shrink-0">
        <button
          onClick={() => setMobileTab('passage')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${mobileTab === 'passage' ? 'border-b-2 border-foreground text-foreground' : 'text-muted-foreground'}`}
        >
          <BookOpen className="w-4 h-4" /> Passage
        </button>
        <button
          onClick={() => setMobileTab('questions')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${mobileTab === 'questions' ? 'border-b-2 border-foreground text-foreground' : 'text-muted-foreground'}`}
        >
          <HelpCircle className="w-4 h-4" /> Questions
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden flex-col lg:flex-row">
        {/* Passage Column */}
        <div className={`w-full lg:w-1/2 bg-background p-5 md:p-8 lg:p-12 overflow-y-auto lg:border-r border-border custom-scrollbar ${mobileTab === 'passage' ? 'block' : 'hidden lg:block'}`}>
          <div className="max-w-2xl mx-auto">
            <div
              className="prose prose-sm sm:prose-base prose-neutral max-w-none text-foreground/90 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: passage.contentHTML }}
            />
          </div>
        </div>

        {/* Questions Column */}
        <div className={`w-full lg:w-1/2 bg-secondary/30 p-5 md:p-8 lg:p-12 overflow-y-auto custom-scrollbar ${mobileTab === 'questions' ? 'block' : 'hidden lg:block'}`}>
          <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
            {passage.questionGroups.map((group) => (
              <React.Fragment key={group.id}>
                {renderGroup(group)}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <footer className="bg-background border-t border-border px-4 sm:px-8 py-3 sm:py-5 flex items-center justify-between sticky bottom-0 z-50 gap-4">
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 custom-scrollbar shrink-0 max-w-[60%] lg:max-w-none">
          {testData.passages.map((p, idx) => {
            const totalQ = p.questionGroups.reduce((acc, g) => acc + g.questions.length, 0);
            const answeredQ = p.questionGroups.reduce((acc, g) => {
              return acc + g.questions.filter(q => userAnswers[`passage_${idx}_q${q.number}`]?.trim()).length;
            }, 0);

            return (
              <button
                key={idx}
                onClick={() => setCurrentPassage(idx)}
                className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1 sm:gap-3 border whitespace-nowrap shrink-0 ${
                  currentPassage === idx
                    ? "bg-foreground text-background border-foreground shadow-md"
                    : "bg-background text-foreground hover:bg-black/5 border-border shadow-sm"
                }`}
              >
                <span>Passage {idx + 1}</span>
                <span className={`text-[10px] sm:text-xs font-normal ${currentPassage === idx ? "text-background/50" : "text-muted-foreground/30"}`}>|</span>
                <span className={`font-bold ${currentPassage === idx ? "text-background" : "text-muted-foreground"}`}>
                  {answeredQ}/{totalQ}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 sm:gap-8 shrink-0">
          <span className="hidden sm:inline-block text-sm font-medium text-muted-foreground">
            Progress: <strong className="text-foreground">{answeredCount}/{totalQuestionsInPassage}</strong> answered
          </span>
          <button
            onClick={async () => {
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

                try {
                  const { saveTestAttempt } = await import("@/lib/actions/attempt.actions");
                  await saveTestAttempt({
                    testId: testData.id,
                    score,
                    totalQuestions: totalQ,
                    timeTakenSeconds: 3600 - timeLeft,
                    mode: "Full test",
                    userAnswers, // Add userAnswers to DB
                  });
                } catch (e) {
                  console.error("Failed to save attempt to DB", e);
                }

                // Keep local store for optimistic updates or backward compatibility
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
            className="px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-base bg-foreground text-background rounded-full hover:bg-foreground/90 font-semibold shadow-md transition-all active:scale-95 whitespace-nowrap"
          >
            Submit Test
          </button>
        </div>
      </footer>
    </div>
  );
};

export default IELTSTest;
