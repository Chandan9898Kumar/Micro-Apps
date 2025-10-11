import  { useState } from "react";

interface CounterProps {
  search?: string;
  setSearch?: (value: string) => void;
}

const Counter = ({ search, setSearch }: CounterProps) => {
  const [count, setCount] = useState(1);

  const handleClick = () => {
    const newCount = count * 2;
    if (setSearch) {
      setSearch("user clicks" + "  " + newCount);
    }
    setCount(newCount);
  };
console.log("search in app2", search);
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
        Multiply by 2 each click <strong>APP-2</strong>
      </p>
      <p>Your click count : {count}</p>
      <button
        onClick={handleClick}
        style={{ padding: "8px 16px", cursor: "pointer",    background: "aquamarine"}}
      >
        Click me
      </button>
      <div>Data Coming from Container / Host app : {!search?.length ? "No data" : search}</div>
    </div>
  );
};

export default Counter;
