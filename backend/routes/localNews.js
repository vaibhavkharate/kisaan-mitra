// routes/news.js
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Optional static fallback (in case NewsAPI fails)
const fallbackNews = [
  {
    title: "PM Kisan Yojana Update",
    description: "Farmers to receive ₹2000 installment this month under PM Kisan Samman Nidhi scheme.",
    url: "https://pib.gov.in/PressReleasePage.aspx?PRID=1902839",
    urlToImage: "https://yourcdn.com/pmkisan.jpg",
    publishedAt: new Date().toISOString(),
  },
  {
    title: "Crop Insurance Scheme Extended",
    description: "Pradhan Mantri Fasal Bima Yojana gets a boost with new tech integration for real-time claim tracking.",
    url: "https://agricoop.nic.in",
    urlToImage: "https://yourcdn.com/fasalbima.jpg",
    publishedAt: new Date().toISOString(),
  },
  // Add more dummy news items if you want
];

router.get('/', async (req, res) => {
  const { category = "kisaan", city, state, page = 1, q } = req.query;

  // Define keywords for each category
  const queryMap = {
    kisaan: 'agriculture OR farmer OR crop',
    tech: 'farming technology OR AI in agriculture',
    government: 'PM Kisan OR yojana OR agriculture scheme',
    weather: 'monsoon OR rainfall OR drought'
  };

  // Compose the full query string
  let query = queryMap[category] || queryMap.kisaan;
  if (q) query += ` ${q}`;
  if (city) query += ` ${city}`;
  else if (state) query += ` ${state}`;

  try {
    const { data } = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 8,
        page,
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    if (data.articles && data.articles.length > 0) {
      res.json(data.articles);
    } else {
      console.warn("NewsAPI returned empty data, using fallback.");
      res.json(fallbackNews);
    }
  } catch (err) {
    console.error("NewsAPI Error:", err.message);
    res.status(500).json({
      error: "Unable to fetch news from external API.",
      fallback: true,
      articles: fallbackNews,
    });
  }
});

export default router;
