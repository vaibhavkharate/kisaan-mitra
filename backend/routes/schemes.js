// backend/routes/schemes.js
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get("/", (req, res) => {
  const filePath = path.join(__dirname, "../data/sarkari_yojana.json");

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Could not read schemes file" });
    }
    res.json(JSON.parse(data));
  });
});

export default router;
