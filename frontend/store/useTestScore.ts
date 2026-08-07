import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TestStore {
  userAnswers: Record<string, string>;
  timeLeft: number;
  currentPassage: number;
  isSubmitted: boolean;
  showWarning: boolean;

  setAnswer: (key: string, value: string) => void;
  setTimeLeft: (time: number) => void;
  decrementTime: () => void;
  setCurrentPassage: (num: number) => void;
  setShowWarning: (show: boolean) => void;
  submit: () => void;
  reset: () => void;
}

export const useTestStore = create<TestStore>()(
  persist(
    (set) => ({
      userAnswers: {},
      timeLeft: 3600, // 60 minutes
      currentPassage: 0,
      isSubmitted: false,
      showWarning: false,

      setAnswer: (key, value) =>
        set((state) => ({
          userAnswers: { ...state.userAnswers, [key]: value },
        })),

      setTimeLeft: (time) => set({ timeLeft: time }),

      decrementTime: () =>
        set((state) => {
          const newTime = state.timeLeft - 1;
          if (newTime <= 0) {
            return { timeLeft: 0, isSubmitted: true };
          }
          if (newTime === 600 && !state.showWarning) {
            return { timeLeft: newTime, showWarning: true };
          }
          return { timeLeft: newTime };
        }),

      setCurrentPassage: (num) => set({ currentPassage: num }),

      setShowWarning: (show) => set({ showWarning: show }),

      submit: () => set({ isSubmitted: true }),

      reset: () =>
        set({
          userAnswers: {},
          timeLeft: 3600,
          currentPassage: 0,
          isSubmitted: false,
          showWarning: false,
        }),
    }),
    {
      name: "ielts-test-storage",
    },
  ),
);
