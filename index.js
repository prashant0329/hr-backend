const express = require("express");
const cors = require("cors");
const app = express();

// CORS allow all (React + Extension)
app.use(cors({ origin: "*" }));
app.use(express.json());

// In-memory database
let candidates = [];
let nextId = 1;

// Root route
app.get("/", (req, res) => {
  res.json({ status: "Backend Running", totalLogs: candidates.length });
});

// Save logs from Chrome Extension
app.post("/duplicate-log", (req, res) => {
  const { name, email, phone, peoplestrongStatus, ripplehireStatus } = req.body;

  if (!email && !phone) {
    return res.status(400).json({
      success: false,
      message: "Email or phone missing",
    });
  }

  const entry = {
    id: nextId++,
    name: name || "",
    email: email || "",
    phone: phone || "",
    clientStatus: {
      peoplestrong: peoplestrongStatus || "unknown",
      ripplehire: ripplehireStatus || "unknown",
    },
    timestamp: new Date().toISOString(),
  };

  candidates.unshift(entry);

  res.json({
    success: true,
    message: "Log saved",
    data: entry,
  });
});

// Dashboard → Get all logs
app.get("/logs", (req, res) => {
  res.json(candidates);
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Render uses PORT variable
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
