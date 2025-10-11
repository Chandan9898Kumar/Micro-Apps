import React, { useState, useEffect } from "react";

interface CounterProps {
  id?: number;
}

const Counter = ({ id = 1 }: CounterProps) => {
  const [count, setCount] = useState(1);

  const handleClick = () => {
    const newCount = count + 1;

    setCount(newCount);
  };

  return (
    <div
      style={{
        color: "#000",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <p>
        Add by one each click <strong>APP-1</strong>
      </p>
      {id && <p>Container ID: {id}</p>}
      <p>Your click count : {count}</p>
      <button
        onClick={handleClick}
        style={{ padding: "8px 16px", cursor: "pointer", background: "pink" }}
      >
        Click me
      </button>
    </div>
  );
};

export default Counter;
