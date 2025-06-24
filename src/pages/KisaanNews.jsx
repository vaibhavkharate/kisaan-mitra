import React, { useState, useEffect } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

const categories = ["kisaan", "tech", "government", "weather"];
const categoryNames = {
  kisaan: "Kisaan News",
  tech: "Farming Tech",
  government: "Govt Announcements",
  weather: "Weather Updates"
};

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState("kisaan");
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    AOS.init({ duration: 800 });
    fetchNews(selectedCategory, 1, "");
  }, []);

  const fetchNews = async (category, pageNum = 1, search = "") => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/news?category=${category}&page=${pageNum}&q=${search}`
      );
      if (pageNum === 1) setArticles(res.data);
      else setArticles((prev) => [...prev, ...res.data]);
    } catch (err) {
      console.error("News API Error:", err);
    }
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
    fetchNews(cat, 1, searchQuery);
  };

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
        📰 Latest Agriculture News
      </h2>

      {/* Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search news..."
          className="border border-gray-300 rounded px-4 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && fetchNews(selectedCategory, 1, e.target.value)
          }
        />
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => fetchNews(selectedCategory, 1, searchQuery)}
        >
          🔍 Search
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center gap-3 flex-wrap mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full border ${
              selectedCategory === cat
                ? "bg-green-700 text-white"
                : "border-green-600 text-green-600"
            }`}
            onClick={() => handleCategoryChange(cat)}
          >
            {categoryNames[cat]}
          </button>
        ))}
      </div>

      {/* News Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition"
            data-aos="fade-up"
          >
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt="news"
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">{article.title}</h3>
              <p className="text-sm text-gray-600 mb-3">
                {article.description?.substring(0, 100)}...
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  {new Date(article.publishedAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => setSelectedArticle(article)}
                  className="text-green-600 font-semibold hover:underline"
                >
                  Read More →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {articles.length > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={() => {
              const nextPage = page + 1;
              setPage(nextPage);
              fetchNews(selectedCategory, nextPage, searchQuery);
            }}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Load More News ↓
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-2">{selectedArticle.title}</h3>
            <p className="text-sm text-gray-600 mb-2">
              {new Date(selectedArticle.publishedAt).toLocaleString()}
            </p>
            {selectedArticle.urlToImage && (
              <img
                src={selectedArticle.urlToImage}
                alt="news"
                className="w-full h-56 object-cover rounded mb-4"
              />
            )}
            <p className="text-gray-800 text-sm whitespace-pre-line">
              {selectedArticle.content ||
                selectedArticle.description ||
                "No content available."}
            </p>
            <div className="flex justify-end mt-4">
              <a
                href={selectedArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mr-4 text-green-600 hover:underline"
              >
                Visit Source →
              </a>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
