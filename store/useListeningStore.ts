import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ListeningStore {
  answers: Record<string, string>;
  timeLeft: number;
  currentPartIndex: number;
  isSubmitted: boolean;

  setAnswer: (key: string, value: string) => void;
  setTimeLeft: (time: number) => void;
  decrementTime: () => void;
  setCurrentPartIndex: (num: number) => void;
  submit: () => void;
  reset: () => void;
}

export const useListeningStore = create<ListeningStore>()(
  persist(
    (set) => ({
      answers: {},
      timeLeft: 1800, // 30 minutes
      currentPartIndex: 0,
      isSubmitted: false,

      setAnswer: (key, value) =>
        set((state) => ({
          answers: { ...state.answers, [key]: value },
        })),

      setTimeLeft: (time) => set({ timeLeft: time }),

      decrementTime: () =>
        set((state) => {
          const newTime = state.timeLeft - 1;
          if (newTime <= 0) {
            return { timeLeft: 0, isSubmitted: true };
          }
          return { timeLeft: newTime };
        }),

      setCurrentPartIndex: (num) => set({ currentPartIndex: num }),

      submit: () => set({ isSubmitted: true }),

      reset: () =>
        set({
          answers: {},
          timeLeft: 1800,
          currentPartIndex: 0,
          isSubmitted: false,
        }),
    }),
    {
      name: "ielts-listening-storage",
    },
  ),
);
