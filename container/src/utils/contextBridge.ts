// Context bridge for sharing state across module boundaries
class ContextBridge {
  private authState = {
    user: null as any,
    isAuthenticated: false,
  };

  private themeState = {
    theme: "light" as "light" | "dark",
    colors: {
      primary: "#667eea",
      secondary: "#764ba2",
      background: "#ffffff",
      text: "#000000",
    },
  };

  private listeners: Array<() => void> = [];

  // Auth methods
  login(user: any) {
    this.authState.user = user;
    this.authState.isAuthenticated = true;
    this.notifyListeners();
  }

  logout() {
    this.authState.user = null;
    this.authState.isAuthenticated = false;
    this.notifyListeners();
  }

  getAuthState() {
    return { ...this.authState };
  }

  // Theme methods
  toggleTheme() {
    this.themeState.theme =
      this.themeState.theme === "light" ? "dark" : "light";
    this.themeState.colors =
      this.themeState.theme === "light"
        ? {
            primary: "#667eea",
            secondary: "#764ba2",
            background: "#ffffff",
            text: "#000000",
          }
        : {
            primary: "#667eea",
            secondary: "#764ba2",
            background: "#0f0f23",
            text: "#ffffff",
          };
    this.notifyListeners();
  }

  getThemeState() {
    return { ...this.themeState };
  }

  // Subscription methods
  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }
}

export const contextBridge = new ContextBridge();
