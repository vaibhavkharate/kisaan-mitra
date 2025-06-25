import React, { useEffect, useState } from "react";
import axios from "axios";

const LocalNews = () => {
  const [location, setLocation] = useState({ city: "", state: "", lat: null, lon: null });
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Step 1: Detect user location on mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Step 2: Reverse geocoding using OpenCage
          const geoRes = await axios.get(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=0cad02775adc4fe3aeb5be32ba51d637`
          );
          const components = geoRes.data.results[0].components;
          const city = components.city || components.town || components.village || "";
          const state = components.state || "";

          setLocation({ lat: latitude, lon: longitude, city, state });
        } catch (error) {
          console.error("Reverse geocode failed", error);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Location access denied", error);
        setLoading(false);
      }
    );
  }, []);

  // Step 3: Fetch local news after city/state is available
  useEffect(() => {
    if (location.city || location.state) {
      const loc = location.city || location.state;

      axios
        .get(`http://localhost:5000/api/news?category=kisaan&city=${loc}`)
        .then((res) => setArticles(res.data))
        .catch((err) => console.error("Local news fetch failed", err));
    }
  }, [location]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {loading ? (
        <p>📍 Detecting your location...</p>
      ) : location.city ? (
        <>
          <h2 className="text-xl font-bold mb-4 text-green-600">
            🗺️ Local News for {location.city}, {location.state}
          </h2>

          {articles.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {article.urlToImage && (
                    <img src={article.urlToImage} alt="news" className="w-full h-40 object-cover" />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2">{article.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {article.description?.substring(0, 100)}...
                    </p>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline text-sm font-medium"
                    >
                      Read More →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>🔍 No local news found for your area right now.</p>
          )}
        </>
      ) : (
        <p>❌ Unable to get location. Please allow location access.</p>
      )}
    </div>
  );
};

export default LocalNews;
