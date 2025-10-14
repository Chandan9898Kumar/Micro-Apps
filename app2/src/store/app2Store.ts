import { create } from 'zustand';

// App2-specific store
interface App2State {
  todos: string[];
  filter: 'all' | 'completed' | 'pending';
  addTodo: (todo: string) => void;
  removeTodo: (index: number) => void;
  setFilter: (filter: 'all' | 'completed' | 'pending') => void;
}

export const useApp2Store = create<App2State>((set) => ({
  todos: [],
  filter: 'all',
  addTodo: (todo) => set((state) => ({ 
    todos: [...state.todos, todo] 
  })),
  removeTodo: (index) => set((state) => ({ 
    todos: state.todos.filter((_, i) => i !== index) 
  })),
  setFilter: (filter) => set({ filter }),
}));