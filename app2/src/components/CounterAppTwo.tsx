import React, { useState, useEffect } from "react";

interface CounterProps {
  search?: string;
  setSearch?: (value: string) => void;
}

const Counter = ({ search, setSearch }: CounterProps) => {
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
    const newCount = count * 2;
    if (setSearch) {
      setSearch("user clicks" + "  " + newCount);
    }
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
        Multiply by 2 each click <strong>APP-2</strong>
      </p>
      <p>Your click count: {count}</p>
      <p>Formatted as currency: {utils.formatCurrency(count)}</p>
      <p>Current time: {utils.formatDate(new Date())}</p>
      <p>Generated ID: {generatedId}</p>
      {authState && (
        <p>User: {authState.user ? authState.user.name : "Not logged in"}</p>
      )}
      <button
        onClick={handleClick}
        style={{
          padding: "8px 16px",
          cursor: "pointer",
          background: "aquamarine",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Click me
      </button>
      {bridge && authState && authState.isAuthenticated && (
        <button
          onClick={() => bridge.logout()}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            background: "red",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Logout
        </button>
      )}
      <div>
        Data Coming from Container / Host app:{" "}
        {!search?.length ? "No data" : search}
      </div>
    </div>
  );
};

export default Counter;
