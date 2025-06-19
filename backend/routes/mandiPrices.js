
// routes/mandiPrices.js
import express from "express";
import axios from "axios";
import fs from "fs";
import csv from "csv-parser";

const router = express.Router();

// ✅ Primary: Fetch from Python scraping microservice
const fetchLiveMandiData = async (state, commodity, market) => {
  try {
    const { data } = await axios.get("http://127.0.0.1:5000/request", {
      params: { state, commodity, market },
    });
    return { success: true, data };
  } catch (err) {
    console.log("🔴 Scraper failed:", err.message);
    return { success: false };
  }
};

// ✅ Fallback: Read from local CSV
const fetchFromCSV = async () => {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream("./data/mandi_fallback.csv")
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
};

// 📦 API: /api/mandi-prices
router.get("/", async (req, res) => {
  const { state, commodity, market } = req.query;

  if (!state || !commodity || !market) {
    return res.status(400).json({ error: "Missing query parameters" });
  }

  // Try Python scraper
  const result = await fetchLiveMandiData(state, commodity, market);
  if (result.success) {
    return res.json({ source: "live", data: result.data });
  }

  // Fallback to CSV
  try {
    const csvData = await fetchFromCSV();
    const filtered = csvData.filter(
      (row) =>
        row.Commodity === commodity &&
        row.State === state &&
        row.Market === market
    );
    return res.json({ source: "csv", data: filtered });
  } catch (err) {
    return res.status(500).json({ error: "Failed to load fallback CSV" });
  }
});


export default router;