import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";

export default function App() {
  const [count, setCount] = useState(0);
  const [today, setToday] = useState("");
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState("light"); // State for theme

  // Get today's date in YYYY-MM-DD format
  const getDateKey = () => new Date().toISOString().split("T")[0];

  // Load count, history, and theme from localStorage
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

    // Load history
    const savedHistory = JSON.parse(localStorage.getItem("water-history")) || [];
    setHistory(savedHistory);

    // Load theme
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.className = savedTheme; // Apply theme to body
  }, []);

  // Save count and update history on change
  useEffect(() => {
    if (today) {
      const updatedData = { date: today, count };
      localStorage.setItem("water-count", JSON.stringify(updatedData));

      // Update history
      const savedHistory = JSON.parse(localStorage.getItem("water-history")) || [];
      const updatedHistory = savedHistory.filter((entry) => entry.date !== today);
      updatedHistory.push(updatedData);
      localStorage.setItem("water-history", JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    }
  }, [count, today]);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme; // Apply theme to body
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Water Intake History", 10, 10);

    history.forEach((entry, index) => {
      doc.text(`${index + 1}. ${entry.date}: ${entry.count} cups`, 10, 20 + index * 10);
    });

    doc.save("water-intake-history.pdf");
  };

  const addCup = () => setCount((c) => c + 1);
  const resetCount = () => setCount(0);

  return (
    <div style={theme === "light" ? styles.lightContainer : styles.darkContainer}>
      <button style={styles.themeToggle} onClick={toggleTheme}>
        {theme === "light" ? "🌙" : "☀️"}
      </button>
      <h1>💧 Water Tracker</h1>
      <p style={styles.date}>Date: {today}</p>
      <div style={styles.count}>{count} cups</div>
      <button style={styles.add} onClick={addCup}>
        ➕ Add Cup
      </button>
      <button style={styles.reset} onClick={resetCount}>
        🔄 Reset
      </button>

      <h2>History</h2>
      <ul style={styles.historyList}>
        {history.map((entry) => (
          <li
            key={entry.date}
            style={{
              ...styles.historyItem,
              borderColor: entry.count < 12 ? "#f44336" : "#4CAF50",
              backgroundColor: entry.count < 12
                ? theme === "light"
                  ? "#ffe6e6"
                  : "#5a1a1a"
                : theme === "light"
                ? "#e6ffe6"
                : "#1a5a1a",
            }}
          >
            <span style={styles.historyDate}>{entry.date}</span>
            <span style={styles.historyCount}>
              {entry.count} <span style={styles.cupIcon}>💧</span>
            </span>
          </li>
        ))}
      </ul>

      {/* Graph */}
      <h2>Water Intake Graph</h2>
      <ResponsiveContainer width="90%" height={300}>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#4CAF50" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>

      <button style={styles.exportButton} onClick={exportToPDF}>
        📄 Export to PDF
      </button>

      {/* Footer */}
      <footer style={styles.footer}>
        Developed by <span style={styles.footerName}>Prashen</span>
      </footer>
    </div>
  );
}

const styles = {
  lightContainer: {
    textAlign: "center",
    marginTop: "50px",
    fontFamily: "sans-serif",
    backgroundColor: "#ffffff",
    color: "#000000",
    minHeight: "100vh",
    padding: "20px",
  },
  darkContainer: {
    textAlign: "center",
    marginTop: "50px",
    fontFamily: "sans-serif",
    backgroundColor: "#121212",
    color: "#ffffff",
    minHeight: "100vh",
    padding: "20px",
  },
  themeToggle: {
    position: "absolute",
    top: "10px",
    right: "10px",
    fontSize: "24px",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  date: {
    fontSize: "18px",
    color: "inherit",
  },
  count: {
    fontSize: "64px",
    margin: "20px 0",
  },
  add: {
    fontSize: "24px",
    padding: "10px 20px",
    margin: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
  },
  reset: {
    fontSize: "18px",
    padding: "8px 16px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "8px",
  },
  historyList: {
    listStyleType: "none",
    padding: 0,
    marginTop: "20px",
  },
  historyItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 15px",
    margin: "5px 0",
    border: "2px solid",
    borderRadius: "8px",
    fontSize: "18px",
  },
  historyDate: {
    fontWeight: "bold",
    color: "inherit",
  },
  historyCount: {
    display: "flex",
    alignItems: "center",
    fontSize: "18px",
    color: "inherit",
  },
  cupIcon: {
    marginLeft: "5px",
    fontSize: "20px",
  },
  exportButton: {
    fontSize: "18px",
    padding: "8px 16px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "8px",
    marginTop: "20px",
  },
  footer: {
    marginTop: "20px",
    fontSize: "14px",
    color: "inherit",
  },
  footerName: {
    fontWeight: "bold",
  },
};