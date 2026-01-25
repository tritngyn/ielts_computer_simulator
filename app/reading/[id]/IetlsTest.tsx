"use client";

import React, { useEffect } from "react";
import { Clock, HelpCircle, EyeOff, Edit3, ArrowRight } from "lucide-react";
import { useTestStore } from "../../../store/useTestScore";
import { IELTSTestData, QuestionSection, Passage } from "../../types/ielts";

interface IELTSTestProps {
  testData: IELTSTestData;
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

  const passage = testData.passages[currentPassage];
  const totalQuestions = passage.all_answers.length;

  const answeredCount = Object.keys(userAnswers).filter(
    (key) =>
      key.startsWith(`passage_${currentPassage}_`) && userAnswers[key]?.trim(),
  ).length;

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      decrementTime();
    }, 1000);

    return () => clearInterval(timer);
  }, [decrementTime]);

  // Hide warning after 5 seconds
  useEffect(() => {
    if (showWarning) {
      const timeout = setTimeout(() => setShowWarning(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [showWarning, setShowWarning]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    return `${mins} minute${mins !== 1 ? "s" : ""} left`;
  };

  const handleAnswerChange = (questionNum: number, value: string) => {
    setAnswer(`passage_${currentPassage}_q${questionNum}`, value);
  };

  const getAnswerStatus = (
    questionNum: number,
  ): "correct" | "incorrect" | "" => {
    if (!isSubmitted) return "";
    const userAnswer = userAnswers[`passage_${currentPassage}_q${questionNum}`]
      ?.trim()
      .toLowerCase();
    const correctAnswer = passage.all_answers[questionNum - 1]?.toLowerCase();
    return userAnswer === correctAnswer ? "correct" : "incorrect";
  };

  const renderGapFill = (section: QuestionSection) => {
    const questionNumbers: number[] = [];
    for (let i = section.range.start; i <= section.range.end; i++) {
      questionNumbers.push(i);
    }

    return (
      <div className="mb-8">
        <div
          className="mb-4 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: section.instruction_html }}
        />
        <div className="space-y-3">
          {questionNumbers.map((num) => {
            const status = getAnswerStatus(num);
            return (
              <div key={num} className="flex items-center gap-3">
                <span className="font-semibold min-w-[30px]">{num}.</span>
                <input
                  type="text"
                  value={userAnswers[`passage_${currentPassage}_q${num}`] || ""}
                  onChange={(e) => handleAnswerChange(num, e.target.value)}
                  disabled={isSubmitted}
                  className={`flex-1 px-3 py-2 border rounded ${
                    status === "correct"
                      ? "bg-green-100 border-green-500"
                      : status === "incorrect"
                        ? "bg-red-100 border-red-500"
                        : "bg-blue-50 border-blue-300"
                  }`}
                  placeholder="Your answer"
                />
                {isSubmitted && status === "incorrect" && (
                  <span className="text-green-600 font-medium">
                    ✓ {passage.all_answers[num - 1]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSelectorFixed = (section: QuestionSection) => {
    return (
      <div className="mb-8">
        <div
          className="mb-4 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: section.instruction_html }}
        />
        <div className="space-y-4">
          {section.questions.map((q) => {
            const status = getAnswerStatus(q.q_number);
            return (
              <div key={q.q_number} className="flex items-start gap-3">
                <div className="flex-1">
                  <div dangerouslySetInnerHTML={{ __html: q.q_html }} />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={
                      userAnswers[`passage_${currentPassage}_q${q.q_number}`] ||
                      ""
                    }
                    onChange={(e) =>
                      handleAnswerChange(q.q_number, e.target.value)
                    }
                    disabled={isSubmitted}
                    className={`w-24 px-3 py-2 border rounded text-center ${
                      status === "correct"
                        ? "bg-green-100 border-green-500"
                        : status === "incorrect"
                          ? "bg-red-100 border-red-500"
                          : "bg-blue-50 border-blue-300"
                    }`}
                    placeholder="Answer"
                  />
                  {isSubmitted && status === "incorrect" && (
                    <span className="text-green-600 font-medium">
                      ✓ {passage.all_answers[q.q_number - 1]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSelectorMCQ = (section: QuestionSection) => {
    return (
      <div className="mb-8">
        <div
          className="mb-4 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: section.instruction_html }}
        />
        <div className="space-y-6">
          {section.questions.map((q) => {
            const status = getAnswerStatus(q.q_number);
            const options = ["A", "B", "C", "D"];
            return (
              <div
                key={q.q_number}
                className={`p-4 rounded ${
                  status === "correct"
                    ? "bg-green-50"
                    : status === "incorrect"
                      ? "bg-red-50"
                      : "bg-white"
                }`}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: q.q_html }}
                  className="mb-3"
                />
                <div className="space-y-2 ml-4">
                  {options.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`q${q.q_number}`}
                        value={option}
                        checked={
                          userAnswers[
                            `passage_${currentPassage}_q${q.q_number}`
                          ] === option
                        }
                        onChange={(e) =>
                          handleAnswerChange(q.q_number, e.target.value)
                        }
                        disabled={isSubmitted}
                        className="w-4 h-4"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
                {isSubmitted && status === "incorrect" && (
                  <div className="mt-3 text-green-600 font-medium">
                    ✓ Correct answer: {passage.all_answers[q.q_number - 1]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMatching = (section: QuestionSection) => {
    return (
      <div className="mb-8">
        <div
          className="mb-4 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: section.instruction_html }}
        />
        <div className="space-y-4">
          {section.questions.map((q) => {
            const status = getAnswerStatus(q.q_number);
            return (
              <div key={q.q_number} className="flex items-start gap-3">
                <div className="flex-1">
                  <div dangerouslySetInnerHTML={{ __html: q.q_html }} />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={
                      userAnswers[`passage_${currentPassage}_q${q.q_number}`] ||
                      ""
                    }
                    onChange={(e) =>
                      handleAnswerChange(q.q_number, e.target.value)
                    }
                    disabled={isSubmitted}
                    className={`w-16 px-3 py-2 border rounded text-center ${
                      status === "correct"
                        ? "bg-green-100 border-green-500"
                        : status === "incorrect"
                          ? "bg-red-100 border-red-500"
                          : "bg-blue-50 border-blue-300"
                    }`}
                    placeholder="A"
                  />
                  {isSubmitted && status === "incorrect" && (
                    <span className="text-green-600 font-medium">
                      ✓ {passage.all_answers[q.q_number - 1]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderQuestionSection = (section: QuestionSection) => {
    switch (section.logic_group) {
      case "GAP_FILL":
        return renderGapFill(section);
      case "SELECTOR_FIXED":
        return renderSelectorFixed(section);
      case "SELECTOR_MCQ":
        return renderSelectorMCQ(section);
      case "MATCHING":
        return renderMatching(section);
      default:
        return null;
    }
  };

  const calculateScore = (): number => {
    return passage.all_answers.filter(
      (ans, idx) =>
        userAnswers[`passage_${currentPassage}_q${idx + 1}`]
          ?.trim()
          .toLowerCase() === ans.toLowerCase(),
    ).length;
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-[#2c5f6f] text-white px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-sm">XXXX XXXXXXX - 123456</span>
        </div>
        <div className="flex items-center gap-4">
          {showWarning && (
            <span className="bg-red-500 px-3 py-1 rounded text-sm animate-pulse">
              ⚠️ 10 minutes remaining!
            </span>
          )}
          <div className="flex items-center gap-2">
            <Clock size={20} />
            <span className="font-semibold">{formatTime(timeLeft)}</span>
          </div>
          <button className="px-4 py-1 bg-white/20 rounded hover:bg-white/30 flex items-center gap-2">
            <HelpCircle size={18} />
            Help
          </button>
          <button className="px-4 py-1 bg-white/20 rounded hover:bg-white/30 flex items-center gap-2">
            <EyeOff size={18} />
            Hide
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Passage Column - 7/12 */}
        <div className="w-7/12 bg-white p-8 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">
            Sample Academic Reading <em>{passage.title}</em>
          </h2>
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: passage.passage.join("") }}
          />
        </div>

        {/* Questions Column - 5/12 */}
        <div className="w-5/12 bg-[#e8eef1] p-6 overflow-y-auto">
          {passage.question_sections.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-lg font-bold mb-3">{section.title}</h3>
              {renderQuestionSection(section)}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Navigation */}
      <footer className="bg-[#2a2a2a] text-white px-6 py-3 flex items-center justify-between sticky bottom-0 z-50">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm">Review</span>
          </label>
          <div className="flex gap-1">
            {testData.passages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPassage(idx)}
                className={`w-10 h-10 rounded ${
                  currentPassage === idx
                    ? "bg-[#4a9eff] text-white"
                    : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm">
            Progress: {answeredCount}/{totalQuestions} answered
          </span>
          <button className="p-2 bg-gray-600 rounded hover:bg-gray-500">
            <Edit3 size={20} />
          </button>
          {!isSubmitted ? (
            <button
              onClick={submit}
              className="px-6 py-2 bg-green-600 rounded hover:bg-green-700 font-semibold"
            >
              Submit
            </button>
          ) : (
            <div className="px-6 py-2 bg-blue-600 rounded font-semibold">
              Score: {calculateScore()}/{totalQuestions}
            </div>
          )}
          <button className="p-2 bg-gray-600 rounded hover:bg-gray-500">
            <ArrowRight size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default IELTSTest;
