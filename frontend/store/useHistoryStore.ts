import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TestAttempt {
  id: string;
  testId: string;
  date: string;
  score: number;
  totalQuestions: number;
  timeTakenSeconds: number;
  mode: string; // e.g., "Full test" or "Luyện tập"
}

interface HistoryStore {
  attempts: TestAttempt[];
  addAttempt: (attempt: Omit<TestAttempt, "id" | "date">) => void;
  getAttemptsByTestId: (testId: string) => TestAttempt[];
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      attempts: [],
      addAttempt: (attempt) =>
        set((state) => ({
          attempts: [
            {
              ...attempt,
              id: crypto.randomUUID(),
              date: new Date().toISOString(),
            },
            ...state.attempts,
          ],
        })),
      getAttemptsByTestId: (testId) => {
        return get().attempts.filter((a) => a.testId === testId);
      },
    }),
    {
      name: "ielts-history-storage",
    }
  )
);
