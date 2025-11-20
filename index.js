const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Temp in-memory database
let candidates = [];
let nextId = 1;

app.get("/", (req, res) => {
  res.send("HR Duplicate Checker Backend Running!");
});

// Log duplicate results
app.post("/duplicate-log", (req, res) => {
  const { name, email, phone, peoplestrongStatus, ripplehireStatus } = req.body;

  const entry = {
    id: nextId++,
    name,
    email,
    phone,
    clientStatus: {
      peoplestrong: peoplestrongStatus || "unknown",
      ripplehire: ripplehireStatus || "unknown"
    },
    createdAt: new Date().toISOString()
  };

  candidates.push(entry);
  res.json({ status: "ok", entry });
});

// Get all candidates
app.get("/candidates", (req, res) => {
  res.json(candidates);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Backend running on port", PORT));
