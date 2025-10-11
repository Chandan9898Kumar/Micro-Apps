import React, { useState } from "react";
import ErrorBoundary from "./components/ErrorBoundary";

const CounterAppOne = React.lazy(() => import("app1/CounterAppOne"));
const CounterAppTwo = React.lazy(() => import("app2/CounterAppTwo"));
var version = process.env.BUILD_DATE;

const App: React.FC = () => {
  const [search, setSearch] = useState("");

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#0f0f23",
        margin: "0",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1
          style={{
            color: "#fff",
            margin: "0",
            fontSize: "2.5rem",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          MICRO-FRONTEND CONTAINER
        </h1>
        <div style={{ color: "#888", fontSize: "0.9rem" }}>
          Build: {version}
        </div>
      </div>

      {/* Search Input */}
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          position: "relative",
          marginBottom: "3rem",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          style={{
            position: "absolute",
            left: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            fill: "#888",
            width: "1.2rem",
            height: "1.2rem",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="search"
          placeholder="Search micro-frontends..."
          style={{
            width: "100%",
            height: "50px",
            paddingLeft: "3rem",
            paddingRight: "1rem",
            border: "2px solid #333",
            borderRadius: "25px",
            backgroundColor: "#1a1a2e",
            color: "#fff",
            fontSize: "1rem",
            outline: "none",
            transition: "all 0.3s ease",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#667eea")}
          onBlur={(e) => (e.target.style.borderColor = "#333")}
        />
      </div>

      {/* Counter Apps Container */}
      <div
        style={{
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
          justifyContent: "center",
          width: "100%",
          maxWidth: "1000px",
        }}
      >
        <ErrorBoundary appName="APP-1">
          <React.Suspense
            fallback={
              <div
                style={{
                  width: "350px",
                  height: "250px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#1a1a2e",
                  borderRadius: "15px",
                  color: "#888",
                  border: "2px solid #333"
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🚀</div>
                  <div>Loading APP-1...</div>
                </div>
              </div>
            }
          >
            <div
              style={{
                width: "350px",
                height: "500px",
                padding: "1.5rem",
                border: "2px solid #333",
                borderRadius: "15px",
                backgroundColor: "#ffffff",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 40px rgba(102, 126, 234, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)";
              }}
            >
              <h2
                style={{
                  color: "#667eea",
                  marginBottom: "1rem",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                🚀 APP-1
              </h2>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CounterAppOne id={1233} />
              </div>
            </div>
          </React.Suspense>
        </ErrorBoundary>

        <ErrorBoundary appName="APP-2">
          <React.Suspense
            fallback={
              <div
                style={{
                  width: "350px",
                  height: "250px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#1a1a2e",
                  borderRadius: "15px",
                  color: "#888",
                  border: "2px solid #333"
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚡</div>
                  <div>Loading APP-2...</div>
                </div>
              </div>
            }
          >
            <div
              style={{
                width: "350px",
                height: "500px",
                padding: "1.5rem",
                border: "2px solid #333",
                borderRadius: "15px",
                backgroundColor: "#ffffff",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 40px rgba(118, 75, 162, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)";
              }}
            >
              <h2
                style={{
                  color: "#764ba2",
                  marginBottom: "1rem",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                ⚡ APP-2
              </h2>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CounterAppTwo search={search} setSearch={setSearch} />
              </div>
            </div>
          </React.Suspense>
        </ErrorBoundary>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "3rem" }}>
        <a
          href="_"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            padding: "0.5rem",
            borderRadius: "50%",
            backgroundColor: "#333",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#555";
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#333";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <img
            src="./git.png"
            height="40px"
            width="40px"
            alt="GitHub"
            style={{ display: "block" }}
          />
        </a>
      </div>
    </div>
  );
};

export default App;