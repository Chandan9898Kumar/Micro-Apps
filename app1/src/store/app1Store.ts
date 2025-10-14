import { create } from 'zustand';

// App1-specific store
interface App1State {
  count: number;
  name: string;
  increment: () => void;
  decrement: () => void;
  setName: (name: string) => void;
}

export const useApp1Store = create<App1State>((set) => ({
  count: 0,
  name: 'App1 Counter',
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  setName: (name) => set({ name }),
}));