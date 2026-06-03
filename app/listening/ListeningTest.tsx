"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Headphones, Clock, Play, Pause, Volume2, Volume1, VolumeX, HelpCircle } from "lucide-react";
import { IeltsListeningTest } from "@/types/listening";
import { getSupabaseMediaUrl } from "@/utils/storage";
import { useHistoryStore } from "@/store/useHistoryStore";

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

  const audioUrl = getSupabaseMediaUrl(testData.testCode, currentPart.audioPath);

  // Answers State
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const processHTML = (html: string) => {
    if (!html) return html;
    return html.replace(/src="([^"]+)"/g, (match, p1) => {
      const fullUrl = getSupabaseMediaUrl(testData.testCode, p1);
      return `src="${fullUrl}"`;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-gray-50 font-sans text-gray-900">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Header Bar - Matches Reading Test */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex flex-none items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push("/listening")}>
          <Headphones className="w-5 h-5 text-gray-700" />
          <h1 className="text-lg font-bold text-gray-800 line-clamp-1">
            {testData.title} <span className="font-normal text-gray-500 ml-2">({testData.testCode})</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
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
        
        {/* Custom Audio Player Bar - Tailor-made for Tailwind standard colors */}
        <div className="flex-none z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-6">
            <button
              onClick={togglePlayPause}
              className="flex-none size-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
            </button>
            <div className="flex-1 flex flex-col justify-center gap-2">
              <div className="flex justify-between items-end">
                <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                  {currentPart.title}
                </span>
                <span className="text-sm font-mono font-bold text-gray-600">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              <div
                ref={progressRef}
                onClick={handleSeek}
                className="h-2 w-full bg-gray-200 rounded-full relative cursor-pointer group"
              >
                <div
                  className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow border border-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>
            <div className="flex-none flex items-center gap-3 pl-6 border-l border-gray-200 hidden md:flex">
              <div className="text-gray-500">
                {volume > 0.5 ? <Volume2 className="w-5 h-5" /> : volume > 0 ? <Volume1 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div
                onClick={handleVolumeChange}
                className="w-20 h-1.5 bg-gray-200 rounded-full cursor-pointer relative group"
              >
                <div
                  className="absolute top-0 left-0 h-full bg-gray-400 group-hover:bg-blue-500 transition-colors rounded-full"
                  style={{ width: `${volume * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Area (Using Reading Test Question Column Style) */}
        <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-8 scroll-smooth pb-32">
          <div className="max-w-2xl mx-auto space-y-8">
            
            {/* Part HTML context (e.g. Map/Diagram) */}
            {currentPart.contentHTML && (
              <div className="mb-6 prose prose-sm max-w-none text-gray-800 bg-white p-4 rounded border border-gray-100"
                   dangerouslySetInnerHTML={{ __html: processHTML(currentPart.contentHTML) }} />
            )}

            {currentPart.questionGroups.map((group, gIdx) => (
              <div key={gIdx} className="mb-10 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                
                {/* Instruction Box (Matches Reading Test) */}
                <div className="mb-6 pb-4 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-2">
                    Questions {group.questions[0]?.number} - {group.questions[group.questions.length - 1]?.number}
                  </p>
                  <div
                    className="text-sm text-gray-600 italic border-l-4 border-blue-500 pl-3 py-1 bg-blue-50/50"
                    dangerouslySetInnerHTML={{ __html: group.instructions }}
                  />
                </div>

                {/* Group Context HTML */}
                {group.groupContentHTML && (
                  <div className="mb-6 prose prose-sm max-w-none text-gray-800 bg-white p-4 rounded border border-gray-100"
                       dangerouslySetInnerHTML={{ __html: processHTML(group.groupContentHTML) }} />
                )}

                {/* Questions List (Matches Reading Test List Style) */}
                <div className="space-y-5">
                  {group.questions.map((q) => (
                    <div key={q.id} className="flex flex-col gap-3">
                      <div className="flex gap-3">
                        <span className="font-bold text-gray-700 min-w-[24px]">
                          {q.number}.
                        </span>
                        <div className="text-gray-800 text-sm leading-relaxed flex-1" dangerouslySetInnerHTML={{ __html: q.text }} />
                        
                        {/* Inline Input for Completion questions */}
                        {group.type !== "MULTIPLE_CHOICE" && group.type !== "MATCHING" && (
                           <div className="flex-1 mt-0 mb-2 font-medium">
                            <input
                              className="w-full max-w-sm px-3 py-2 border rounded text-sm bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              placeholder="Your answer"
                              type="text"
                              value={answers[q.id] || ""}
                              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            />
                           </div>
                        )}
                      </div>

                      {/* Multiple Choice */}
                      {group.type === "MULTIPLE_CHOICE" && q.options && (
                        <div className="flex flex-col gap-3 ml-9 mt-1">
                          {q.options.map((opt, i) => {
                            const val = String.fromCharCode(65 + i);
                            return (
                              <label key={i} className="flex items-start gap-3 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`q_${q.id}`}
                                  value={val}
                                  checked={answers[q.id] === val}
                                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                  className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                                />
                                <div className="text-sm text-gray-700 leading-relaxed flex gap-2">
                                  <span className="font-semibold">{val}.</span>
                                  <span dangerouslySetInnerHTML={{ __html: opt }} />
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {/* Matching Select */}
                      {group.type === "MATCHING" && group.sharedOptions && (
                        <div className="ml-9">
                          <select
                            className="w-full max-w-sm px-3 py-2 border rounded text-sm bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            value={answers[q.id] || ""}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          >
                            <option value="" disabled>Select...</option>
                            {group.sharedOptions.map((opt, i) => {
                              const val = String.fromCharCode(65 + i);
                              return <option key={i} value={val}>{val}. {opt}</option>;
                            })}
                          </select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Navigation - Exactly Matches Reading Test */}
      <footer className="flex-none bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between sticky bottom-0 z-50">
        <div className="flex gap-2">
          {testData.parts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPartIndex(idx)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                currentPartIndex === idx
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Part {idx + 1}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-gray-600">
            Progress: {Object.keys(answers).length}/{testData.parts.reduce((acc, p) => acc + p.questionGroups.reduce((gAcc, g) => gAcc + g.questions.length, 0), 0)} answered
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
                      const correctAnswers = testData.answers[q.number.toString()] || [];
                      if (
                        userAnswer &&
                        correctAnswers.some((ans) => ans.toLowerCase() === userAnswer)
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
