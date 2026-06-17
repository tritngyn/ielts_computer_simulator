import React, { useEffect, useRef } from "react";
import { DialogueLine, TranscriptPart } from "@/types/listening";

interface TranscriptViewProps {
  partData: TranscriptPart;
  currentTime: number; // For future auto-scroll if startTime/endTime are present
}

export default function TranscriptView({ partData, currentTime }: TranscriptViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic if timestamps are available
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      // Basic smooth scroll to the active line
      activeLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentTime]);

  // Cross-highlight logic
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'STRONG' || target.tagName === 'B') {
        const text = target.textContent || "";
        const match = text.match(/Q(\d+)/i);
        if (match) {
          const qNum = match[1];
          // Highlight the transcript strong tag
          target.classList.add('is-highlighted');
          
          // Highlight corresponding question in Test Area
          const questionEl = document.querySelector(`[data-qnum="${qNum}"]`);
          if (questionEl) {
            questionEl.classList.add('test-question-highlighted');
            questionEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'STRONG' || target.tagName === 'B') {
        target.classList.remove('is-highlighted');
        const text = target.textContent || "";
        const match = text.match(/Q(\d+)/i);
        if (match) {
          const qNum = match[1];
          const questionEl = document.querySelector(`[data-qnum="${qNum}"]`);
          if (questionEl) {
            questionEl.classList.remove('test-question-highlighted');
          }
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mouseover', handleMouseOver);
      container.addEventListener('mouseout', handleMouseOut);
    }

    return () => {
      if (container) {
        container.removeEventListener('mouseover', handleMouseOver);
        container.removeEventListener('mouseout', handleMouseOut);
      }
    };
  }, []);

  if (!partData || !partData.dialogues || partData.dialogues.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-8 text-gray-500 italic">
        No transcript available for this part.
      </div>
    );
  }

  // To alternate bubbles, we keep track of the first speaker and assign them 'left', and the other 'right'.
  // Narrators (null speaker) are centered.
  const speakerSides: Record<string, "left" | "right"> = {};
  let leftSpeakerAssigned = false;

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto bg-gray-50 p-6 flex flex-col gap-4 border-r border-gray-200"
    >
      <div className="max-w-xl mx-auto w-full flex flex-col gap-4 pb-20">
        {partData.dialogues.map((dialogue, idx) => {
          const isNarrator = !dialogue.speaker;
          const isActive =
            dialogue.startTime !== undefined &&
            dialogue.endTime !== undefined &&
            currentTime >= dialogue.startTime &&
            currentTime <= dialogue.endTime;

          if (isNarrator) {
            return (
              <div
                key={idx}
                ref={isActive ? activeLineRef : null}
                className={`flex flex-col max-w-[85%] self-start items-start ${isActive ? 'ring-2 ring-blue-300 ring-offset-2 ring-offset-gray-50 rounded-2xl' : ''} transition-all duration-300 mb-2`}
              >
                <div
                  className={`transcript-dialogue px-4 py-3 shadow-sm text-[15px] leading-relaxed bg-white text-gray-800 rounded-2xl rounded-tl-sm border border-gray-100 ${isActive ? 'opacity-100' : 'opacity-80'}`}
                  dangerouslySetInnerHTML={{ __html: dialogue.text }}
                />
              </div>
            );
          }

          if (!speakerSides[dialogue.speaker!]) {
            speakerSides[dialogue.speaker!] = leftSpeakerAssigned ? "right" : "left";
            leftSpeakerAssigned = true;
          }

          const side = speakerSides[dialogue.speaker!];

          return (
            <div
              key={idx}
              ref={isActive ? activeLineRef : null}
              className={`flex flex-col max-w-[85%] ${
                side === "left" ? "self-start items-start" : "self-end items-end"
              } ${isActive ? 'ring-2 ring-blue-300 ring-offset-2 ring-offset-gray-50 rounded-2xl' : ''} transition-all duration-300`}
            >
              <span className="text-xs font-semibold text-gray-500 mb-1 ml-1 mr-1">
                {dialogue.speaker}
              </span>
              <div
                className={`transcript-dialogue px-4 py-3 shadow-sm text-[15px] leading-relaxed ${
                  side === "left"
                    ? "bg-white text-gray-800 rounded-2xl rounded-tl-sm border border-gray-100"
                    : "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
                }`}
                dangerouslySetInnerHTML={{ __html: dialogue.text }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
