import React, { useState, useEffect } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  const [today, setToday] = useState("");

  // Get today's date in YYYY-MM-DD format
  const getDateKey = () => new Date().toISOString().split("T")[0];

  // Load count from localStorage
  useEffect(() => {
    const dateKey = getDateKey();
    setToday(dateKey);

    const saved = JSON.parse(localStorage.getItem("water-count")) || {};
    if (saved.date === dateKey) {
      setCount(saved.count);
    } else {
      setCount(0);
      localStorage.setItem(
        "water-count",
        JSON.stringify({ date: dateKey, count: 0 })
      );
    }
  }, []);

  // Save count on change
  useEffect(() => {
    if (today) {
      localStorage.setItem(
        "water-count",
        JSON.stringify({ date: today, count })
      );
    }
  }, [count, today]);

  const addCup = () => setCount((c) => c + 1);
  const resetCount = () => setCount(0);

  return (
    <div style={styles.container}>
      <h1>💧 Water Tracker</h1>
      <p style={styles.date}>Date: {today}</p>
      <div style={styles.count}>{count} cups</div>
      <button style={styles.add} onClick={addCup}>
        ➕ Add Cup
      </button>
      <button style={styles.reset} onClick={resetCount}>
        🔄 Reset
      </button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
    fontFamily: "sans-serif"
  },
  date: {
    fontSize: "18px",
    color: "#666"
  },
  count: {
    fontSize: "64px",
    margin: "20px 0"
  },
  add: {
    fontSize: "24px",
    padding: "10px 20px",
    margin: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px"
  },
  reset: {
    fontSize: "18px",
    padding: "8px 16px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "8px"
  }
}; 