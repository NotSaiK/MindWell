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

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [breathing, setBreathing] = useState(false);

  const [text, setText] = useState("");
  const [secret, setSecret] = useState("");
  const [entries, setEntries] = useState([]);

  const [mood, setMood] = useState(5);
  const [moodHistory, setMoodHistory] = useState([]);

  const saveJournal = async () => {
    if (!text || !secret) return alert("Enter secret key and journal text");

    await axios.post(`${API_URL}/api/journal/create`, {
      userId: "testuser",
      text,
      secret,
    });

    setText("");
  };

  const loadJournals = async () => {
    if (!secret) return alert("Enter secret key first");

    const res = await axios.post(`${API_URL}/api/journal/get`, {
      userId: "testuser",
      secret,
    });

    setEntries(res.data);
  };

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
    const res = await axios.post(`${API_URL}/api/export`, {
      userId: "testuser",
    });

    const blob = new Blob(
      [JSON.stringify(res.data, null, 2)],
      { type: "application/json" }
    );

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mindwell-data.json";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchMoodHistory();
  }, []);

  const bg = darkMode ? "#0f172a" : "#f8fafc";
  const card = darkMode ? "#1e293b" : "#ffffff";
  const textColor = darkMode ? "#e5e7eb" : "#0f172a";
  const muted = darkMode ? "#94a3b8" : "#64748b";
  const primary = "#6366f1";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bg,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <style>
        {`
          @keyframes breathe {
            0% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.4); opacity: 1; }
            100% { transform: scale(1); opacity: 0.7; }
          }
        `}
      </style>

      <div
        style={{
          width: "100%",
          maxWidth: 640,
          background: card,
          color: textColor,
          borderRadius: 18,
          padding: 32,
          boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
        }}
      >
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2 style={{ margin: 0 }}>MindWell</h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              background: "transparent",
              border: "none",
              fontSize: 18,
              cursor: "pointer",
              color: textColor,
            }}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        <p style={{ color: muted, marginTop: 6 }}>
          A private space for reflection and calm
        </p>

        {/* JOURNAL */}
        <section style={{ marginTop: 28 }}>
          <h3>Journal</h3>

          <input
            type="password"
            placeholder="Secret key"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            style={inputStyle(card, textColor)}
          />

          <textarea
            placeholder="Write freely…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            style={{ ...inputStyle(card, textColor), resize: "none" }}
          />

          <button style={primaryBtn(primary)} onClick={saveJournal}>
            Save Entry
          </button>

          <button style={ghostBtn(primary)} onClick={loadJournals}>
            Load Entries
          </button>

          {entries.map((e, i) => (
            <div key={i} style={{ marginTop: 16 }}>
              <p>{e.text}</p>
              <small style={{ color: muted }}>
                {new Date(e.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </section>

        {/* MOOD */}
        <section style={{ marginTop: 36 }}>
          <h3>Mood Tracker</h3>
          <input
            type="range"
            min="1"
            max="10"
            value={mood}
            onChange={(e) => setMood(+e.target.value)}
            style={{ width: "100%" }}
          />
          <p style={{ color: muted }}>Mood today: {mood}</p>
          <button style={primaryBtn(primary)} onClick={saveMood}>
            Save Mood
          </button>

          {moodHistory.length > 0 && (
            <Line
              data={{
                labels: moodHistory.map((m) =>
                  new Date(m.createdAt).toLocaleDateString()
                ),
                datasets: [
                  {
                    data: moodHistory.map((m) => m.mood),
                    borderColor: primary,
                    tension: 0.35,
                  },
                ],
              }}
              options={{ plugins: { legend: { display: false } } }}
            />
          )}
        </section>

        {/* BREATHING */}
        <section style={{ marginTop: 36, textAlign: "center" }}>
          <h3>Breathing</h3>
          <button
            style={ghostBtn(primary)}
            onClick={() => setBreathing(!breathing)}
          >
            {breathing ? "Stop" : "Start"}
          </button>

          {breathing && (
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: "50%",
                background: primary,
                margin: "24px auto",
                animation: "breathe 8s ease-in-out infinite",
              }}
            />
          )}
        </section>

        {/* EXPORT */}
        <section style={{ marginTop: 36 }}>
          <h3>Your Data</h3>
          <p style={{ color: muted }}>
            Download all your encrypted journals and mood history
          </p>
          <button style={primaryBtn(primary)} onClick={exportData}>
            Download JSON
          </button>
        </section>
      </div>
    </div>
  );
}

/* ---- Reusable styles ---- */
const inputStyle = (bg, color) => ({
  width: "100%",
  padding: 12,
  marginTop: 12,
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  background: bg,
  color,
});

const primaryBtn = (color) => ({
  width: "100%",
  marginTop: 14,
  padding: 12,
  borderRadius: 10,
  border: "none",
  background: color,
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
});

const ghostBtn = (color) => ({
  width: "100%",
  marginTop: 10,
  padding: 12,
  borderRadius: 10,
  border: `1px solid ${color}`,
  background: "transparent",
  color,
  fontWeight: 600,
  cursor: "pointer",
});

export default App;
