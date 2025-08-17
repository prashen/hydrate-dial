import React, { useState, useEffect } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  // Load today's count or reset if it's a new day
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("hydrateData")) || {};
    const today = new Date().toISOString().split("T")[0];

    if (data.date === today) {
      setCount(data.count);
    } else {
      setCount(0);
      localStorage.setItem(
        "hydrateData",
        JSON.stringify({ date: today, count: 0 })
      );
    }
  }, []);

  // Persist count on every change
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem(
      "hydrateData",
      JSON.stringify({ date: today, count })
    );
  }, [count]);

  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => (c > 0 ? c - 1 : 0));
  const reset = () => setCount(0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 50
      }}
    >
      <h1>Hydrate Dial</h1>
      <div style={{ fontSize: 72, margin: "20px" }}>{count}</div>
      <div style={{ display: "flex", gap: 20 }}>
        <button onClick={decrement} style={{ fontSize: 32 }}>
          −
        </button>
        <button onClick={increment} style={{ fontSize: 48 }}>
          +
        </button>
      </div>
      <button onClick={reset} style={{ marginTop: 20 }}>
        Reset
      </button>
    </div>
  );
}