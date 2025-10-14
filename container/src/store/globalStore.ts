import { create } from 'zustand';

// Global store shared across all apps
interface GlobalState {
  user: { id: string; name: string; email: string } | null;
  theme: 'light' | 'dark';
  notifications: string[];
  setUser: (user: { id: string; name: string; email: string } | null) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (message: string) => void;
  clearNotifications: () => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  user: null,
  theme: 'light',
  notifications: [],
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
  addNotification: (message) => set((state) => ({ 
    notifications: [...state.notifications, message] 
  })),
  clearNotifications: () => set({ notifications: [] }),
}));