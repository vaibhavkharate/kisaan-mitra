// backend/routes/news.js
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// ✅ Category mapping to search terms
const queryMap = {
  kisaan: 'agriculture OR farmer OR crop',
  tech: 'farming technology OR AI in agriculture OR agrotech',
  government: 'PM Kisan OR yojana OR agriculture scheme OR subsidy',
  weather: 'monsoon OR rainfall OR drought OR flood',
  general: 'India agriculture news',
};

router.get('/', async (req, res) => {
  const category = req.query.category || 'kisaan';
  const page = parseInt(req.query.page) || 1;
  const pageSize = 6; // number of articles per page
  const search = req.query.q;

  // If search query is provided, override category query
  const query = search ? search : (queryMap[category] || queryMap['kisaan']);

  try {
    const { data } = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        language: 'en',
        sortBy: 'publishedAt',
        page,
        pageSize,
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    res.json(data.articles);
  } catch (err) {
    console.error('❌ News Fetch Error:', err.message);
    res.status(500).json({ error: 'Unable to fetch news articles' });
  }
});

export default router;
