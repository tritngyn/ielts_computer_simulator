import { create } from "zustand";

// Định nghĩa kiểu dữ liệu cho Store
interface CounterState {
  count: number;
  inc: () => void;
  dec: () => void;
}

// Khởi tạo store
export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  inc: () => set((state) => ({ count: state.count + 1 })),
  dec: () => set((state) => ({ count: state.count - 1 })),
}));
