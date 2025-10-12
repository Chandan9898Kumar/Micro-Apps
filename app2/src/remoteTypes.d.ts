///<reference types="react" />

declare module "container/utils" {
  export const formatCurrency: (amount: number) => string;
  export const debounce: (func: Function, delay: number) => (...args: any[]) => void;
  export const formatDate: (date: Date) => string;
  export const generateId: () => string;
}

declare module "container/contextBridge" {
  interface AuthState {
    user: any;
    isAuthenticated: boolean;
  }

  interface ThemeState {
    theme: 'light' | 'dark';
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
    };
  }

  interface ContextBridge {
    login(user: any): void;
    logout(): void;
    getAuthState(): AuthState;
    toggleTheme(): void;
    getThemeState(): ThemeState;
    subscribe(listener: () => void): () => void;
  }

  export const contextBridge: ContextBridge;
}

declare module "container/AuthContext" {
  interface User {
    id: string;
    name: string;
    email: string;
  }

  interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
  }

  export const useAuth: () => AuthContextType;
  export const AuthProvider: React.ComponentType<{ children: React.ReactNode }>;
}

declare module "container/ThemeContext" {
  type Theme = 'light' | 'dark';

  interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
    };
  }

  export const useTheme: () => ThemeContextType;
  export const ThemeProvider: React.ComponentType<{ children: React.ReactNode }>;
}