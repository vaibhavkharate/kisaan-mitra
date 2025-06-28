// server.js
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mandiPricesRoute from "./routes/mandiPrices.js";
import newsRoute from './routes/news.js';
import authRoutes from './routes/auth.js';
import connectDB from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

connectDB();


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/mandi-prices", mandiPricesRoute);
app.use("/api/news", newsRoute);
app.use('/api/auth', authRoutes);

// Root route
app.get("/", (req, res) => res.send("🌾 Kisaan Mitra Backend Running ✅"));

// ✅ Sarkari Yojana Static JSON Route
app.get('/api/schemes', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data', 'sarkari_yojana.json');
    const rawData = fs.readFileSync(dataPath);
    const schemes = JSON.parse(rawData);
    res.json(schemes);
  } catch (err) {
    console.error("Error reading schemes data:", err);
    res.status(500).json({ error: 'Failed to load schemes data.' });
  }
});

// ✅ Feedback Route (Writes to feedback.json)
app.post("/api/feedback", (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const newEntry = {
    name,
    email,
    message,
    timestamp: new Date().toISOString(),
  };

  const file = path.join(__dirname, "feedback.json");
  let existing = [];

  if (fs.existsSync(file)) {
    const raw = fs.readFileSync(file);
    existing = JSON.parse(raw);
  }

  existing.push(newEntry);
  fs.writeFileSync(file, JSON.stringify(existing, null, 2));

  res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
