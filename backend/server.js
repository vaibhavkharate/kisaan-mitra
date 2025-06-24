
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mandiPricesRoute from "./routes/mandiPrices.js";
import newsRoute from './routes/news.js';

const router = express.Router();
const app = express();
const PORT = process.env.PORT || 5000;

// Fix for ES Module __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());


app.use("/api/mandi-prices", mandiPricesRoute);
app.use('/api/news', newsRoute);

app.get("/", (req, res) => res.send("Kisaan Mitra Backend Running ✅"));
// API Route for schemes
app.get('/api/schemes', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data', 'sarkari_yojana.json');
    const rawData = fs.readFileSync(dataPath);
    const schemes = JSON.parse(rawData);
    res.json(schemes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load schemes data.' });
  }
});

router.post("/api/feedback", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message)
    return res.status(400).json({ error: "Missing fields" });

  const newEntry = {
    name,
    email,
    message,
    timestamp: new Date().toISOString(),
  };

  // Save to JSON file (or later MongoDB)
  const file = "./feedback.json";
  let existing = [];
  if (fs.existsSync(file)) {
    const raw = fs.readFileSync(file);
    existing = JSON.parse(raw);
  }
  existing.push(newEntry);
  fs.writeFileSync(file, JSON.stringify(existing, null, 2));

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

