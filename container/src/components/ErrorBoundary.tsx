import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  appName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Error in ${this.props.appName || 'Micro-frontend'}:`, error, errorInfo);
    
    // Log to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error);
    }
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{
          padding: "2rem",
          border: "2px solid #ff6b6b",
          borderRadius: "8px",
          backgroundColor: "#ffe0e0",
          color: "#d63031",
          textAlign: "center",
          margin: "1rem"
        }}>
          <h3>⚠️ {this.props.appName || 'Micro-frontend'} Failed to Load</h3>
          <p>This component is temporarily unavailable.</p>
          <details style={{ marginTop: "1rem", textAlign: "left" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
              Error Details (Click to expand)
            </summary>
            <pre style={{ 
              marginTop: "0.5rem", 
              padding: "1rem", 
              backgroundColor: "#f8f8f8",
              borderRadius: "4px",
              fontSize: "0.8rem",
              overflow: "auto"
            }}>
              {this.state.error?.message}
              {"\n"}
              {this.state.error?.stack}
            </pre>
          </details>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#0984e3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            🔄 Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;