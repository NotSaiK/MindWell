import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

// Base API URL from Vercel environment variable
const API_URL = process.env.REACT_APP_API_URL;

const DAILY_PROMPTS = [
  "What made you smile today?",
  "What is one thing you are grateful for right now?",
  "What did you do today that you are proud of?",
  "What is one challenge you handled well recently?",
  "What is one small act of kindness you received or gave?",
  "What do you want to let go of today?",
  "What is one thing you want to improve tomorrow?",
];

const getDailyPrompt = () => {
  const dayIndex = Math.floor(
    new Date().setHours(0, 0, 0, 0) / (24 * 60 * 60 * 1000)
  );
  return DAILY_PROMPTS[dayIndex % DAILY_PROMPTS.length];
};

function App() {
  // UI state
  const [darkMode, setDarkMode] = useState(false);
  const [breathing, setBreathing] = useState(false);
  const [dailyPrompt] = useState(() => getDailyPrompt());

  // Journal state
  const [text, setText] = useState("");
  const [secret, setSecret] = useState("");
  const [entries, setEntries] = useState([]);

  // Mood state
  const [mood, setMood] = useState(5);
  const [moodHistory, setMoodHistory] = useState([]);

  // -------- JOURNAL FUNCTIONS --------
  const saveJournal = async () => {
    if (!text || !secret) {
      alert("Please enter secret key and journal text");
      return;
    }

    await axios.post(`${API_URL}/api/journal/create`, {
      userId: "testuser",
      text,
      secret,
    });

    setText("");
    alert("Journal saved securely");
  };

  const loadJournals = async () => {
    if (!secret) {
      alert("Enter secret key first");
      return;
    }

    const res = await axios.post(`${API_URL}/api/journal/get`, {
      userId: "testuser",
      secret,
    });

    setEntries(res.data);
  };

  // -------- MOOD FUNCTIONS --------
  const saveMood = async () => {
    await axios.post(`${API_URL}/api/mood/save`, {
      userId: "testuser",
      mood,
    });
    fetchMoodHistory();
  };

  const fetchMoodHistory = async () => {
    const res = await axios.post(`${API_URL}/api/mood/history`, {
      userId: "testuser",
    });
    setMoodHistory(res.data);
  };

  const exportData = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/export/export`, {
        userId: "testuser",
      });

      const blob = new Blob([JSON.stringify(res.data, null, 2)], {
        type: "application/json",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `mindwell-export-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Export failed. Please try again.");
    }
  };

  const getAverageMood = (items) => {
    if (!items.length) return "N/A";
    const sum = items.reduce((total, item) => total + item.mood, 0);
    return (sum / items.length).toFixed(1);
  };

  const getRecentMoods = (days) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (days - 1));
    return moodHistory.filter(
      (item) => new Date(item.createdAt) >= cutoff
    );
  };

  useEffect(() => {
    fetchMoodHistory();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: darkMode ? "#0f172a" : "#f4f6fb",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        transition: "background 0.3s ease",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          background: darkMode ? "#1e293b" : "#ffffff",
          color: darkMode ? "#e5e7eb" : "#000",
          padding: 30,
          borderRadius: 14,
          boxShadow: "0 12px 35px rgba(0,0,0,0.15)",
          transition: "all 0.3s ease",
        }}
      >
        {/* DARK MODE TOGGLE */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            marginBottom: 20,
            padding: "8px 12px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: darkMode ? "#334155" : "#e5e7eb",
            color: darkMode ? "#e5e7eb" : "#000",
          }}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
          MindWell Journal
        </h2>

        {/* DAILY PROMPT */}
        <div
          style={{
            background: darkMode ? "#0b1220" : "#eef2ff",
            borderRadius: 10,
            padding: 12,
            marginBottom: 20,
            border: darkMode ? "1px solid #1f2937" : "1px solid #c7d2fe",
          }}
        >
          <p style={{ margin: 0, fontWeight: "600" }}>Daily Prompt</p>
          <p
            style={{
              margin: "6px 0 0",
              color: darkMode ? "#cbd5f5" : "#4c51bf",
            }}
          >
            {dailyPrompt}
          </p>
        </div>

        {/* SECRET KEY */}
        <input
          type="password"
          placeholder="Your secret key"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 15,
            borderRadius: 8,
            border: "1px solid #ccc",
            fontSize: 14,
          }}
        />

        {/* JOURNAL */}
        <textarea
          placeholder="Write your thoughts..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ccc",
            marginBottom: 15,
            resize: "none",
            fontSize: 14,
          }}
        />

        <button
          onClick={saveJournal}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "none",
            background: "#5b6cff",
            color: "#fff",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: 10,
          }}
        >
          Save Journal
        </button>

        <button
          onClick={loadJournals}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "1px solid #5b6cff",
            background: "transparent",
            color: "#5b6cff",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Load Journals
        </button>

        {/* JOURNAL ENTRIES */}
        <div style={{ marginTop: 25 }}>
          {entries.length === 0 ? (
            <p style={{ textAlign: "center", color: "#94a3b8" }}>
              No journal entries yet.
            </p>
          ) : (
            entries.map((e, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <p>{e.text}</p>
                <small style={{ color: "#94a3b8" }}>
                  {new Date(e.createdAt).toLocaleString()}
                </small>
                <hr />
              </div>
            ))
          )}
        </div>

        {/* MOOD SECTION */}
        <hr style={{ margin: "30px 0" }} />

        <h3>How are you feeling today?</h3>

        <input
          type="range"
          min="1"
          max="10"
          value={mood}
          onChange={(e) => setMood(Number(e.target.value))}
        />

        <p>Mood: {mood}</p>

        <button
          onClick={saveMood}
          style={{
            padding: 10,
            borderRadius: 8,
            border: "none",
            background: "#22c55e",
            color: "#fff",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: 20,
          }}
        >
          Save Mood
        </button>

        {/* MOOD CHART */}
        {moodHistory.length > 0 && (
          <Line
            data={{
              labels: moodHistory.map((m) =>
                new Date(m.createdAt).toLocaleDateString()
              ),
              datasets: [
                {
                  label: "Mood Over Time",
                  data: moodHistory.map((m) => m.mood),
                  borderColor: "#5b6cff",
                  tension: 0.3,
                },
              ],
            }}
          />
        )}

        {/* AGGREGATION */}
        <div style={{ marginTop: 16 }}>
          <p style={{ margin: "6px 0" }}>
            Weekly Average: {getAverageMood(getRecentMoods(7))}
          </p>
          <p style={{ margin: "6px 0" }}>
            Monthly Average: {getAverageMood(getRecentMoods(30))}
          </p>
        </div>

        {/* BREATHING SECTION */}
        <hr style={{ margin: "30px 0" }} />

        <h3>Breathing Exercise</h3>

        <p style={{ color: darkMode ? "#94a3b8" : "#555" }}>
          Follow the circle to calm your breathing
        </p>

        <button
          onClick={() => setBreathing(!breathing)}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "none",
            background: breathing ? "#ef4444" : "#38bdf8",
            color: "#000",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: 20,
          }}
        >
          {breathing ? "Stop Breathing" : "Start Breathing"}
        </button>

        {breathing && (
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "#5b6cff",
              margin: "20px auto",
              animation: "breath 8s ease-in-out infinite",
            }}
          />
        )}

        {/* DATA EXPORT */}
        <hr style={{ margin: "30px 0" }} />

        <h3>Export Your Data</h3>

        <p style={{ color: darkMode ? "#94a3b8" : "#555" }}>
          Download your journals and mood logs as JSON.
        </p>

        <button
          onClick={exportData}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "none",
            background: "#f59e0b",
            color: "#1f2937",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Export JSON
        </button>
      </div>
    </div>
  );
}

export default App;
