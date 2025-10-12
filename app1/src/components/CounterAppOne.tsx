import React, { useState, useEffect } from "react";

interface CounterProps {
  id?: number;
}

const Counter = ({ id = 1 }: CounterProps) => {
  const [count, setCount] = useState(1);
  const [utils, setUtils] = useState<any>(null);
  const [bridge, setBridge] = useState<any>(null);
  const [authState, setAuthState] = useState<any>(null);
  const [generatedId, setGeneratedId] = useState<string>("");

  useEffect(() => {
    import("container/utils").then((utilsModule) => {
      setUtils(utilsModule);
      setGeneratedId(utilsModule.generateId());
    });
    import("container/contextBridge").then((module) => {
      const contextBridge = module.contextBridge;
      setBridge(contextBridge);
      setAuthState(contextBridge.getAuthState());

      const unsubscribe = contextBridge.subscribe(() => {
        setAuthState(contextBridge.getAuthState());
      });

      return unsubscribe;
    });
  }, []);

  const handleClick = () => {
    const newCount = count + 1;
    setCount(newCount);
  };

  if (!utils) {
    return (
      <div style={{ padding: "1rem", textAlign: "center" }}>
        <div>Loading shared resources...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        color: "#000",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1rem",
        borderRadius: "8px",
      }}
    >
      <p>
        Add by one each click <strong>APP-1</strong>
      </p>
      {id && <p>Container ID: {id}</p>}
      <p>Your click count: {count}</p>
      <p>Formatted as currency: {utils.formatCurrency(count)}</p>
      <p>Generated ID: {generatedId}</p>
      <p>Current time: {utils.formatDate(new Date())}</p>
      {authState && (
        <p>Auth: {authState.isAuthenticated ? "Logged In" : "Not Logged In"}</p>
      )}
      <button
        onClick={handleClick}
        style={{
          padding: "8px 16px",
          cursor: "pointer",
          background: "pink",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Click me
      </button>
      {bridge && authState && !authState.isAuthenticated && (
        <button
          onClick={() =>
            bridge.login({
              id: "1",
              name: "Test User",
              email: "test@example.com",
            })
          }
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Login
        </button>
      )}
    </div>
  );
};

export default Counter;
