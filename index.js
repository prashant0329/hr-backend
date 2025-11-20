const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// In-memory "DB" (abhi simple rakhenge)
let candidates = [];
let nextId = 1;

// Health check
app.get("/", (req, res) => {
  res.send("HR Duplicate Checker Backend Running!");
});

// Chrome extension yahan hit karega
app.post("/duplicate-log", (req, res) => {
  const { name, email, phone, peoplestrongStatus, ripplehireStatus } = req.body;

  const entry = {
    id: nextId++,
    name: name || "",
    email: email || "",
    phone: phone || "",
    clientStatus: {
      peoplestrong: peoplestrongStatus || "unknown",
      ripplehire: ripplehireStatus || "unknown"
    },
    timestamp: new Date().toISOString()
  };

  candidates.unshift(entry); // latest top

  res.json({ success: true, message: "Log saved", data: entry });
});

// Dashboard ke liye list API
app.get("/logs", (req, res) => {
  res.json(candidates);
});

// Render port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Backend running on port", PORT));
