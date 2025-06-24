import React, { useEffect, useState } from "react";
import axios from "axios";

const SarkariSchemes = () => {
  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/schemes")
      .then((res) => setSchemes(res.data))
      .catch((err) => console.error("Error fetching schemes:", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-4xl font-bold text-green-800 mb-6 text-center">
        🌾 Government Schemes for Farmers
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {schemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-xl shadow-lg border-l-4 border-green-600 p-6 transition hover:shadow-xl"
            data-aos="fade-up"
            >
            <h2 className="text-2xl font-bold text-green-700 mb-2">{scheme.title}</h2>
            <p className="text-sm text-gray-600 mb-3">
              <span className="font-semibold text-green-600">Category:</span> {scheme.category}
            </p>
            <p className="text-gray-700 mb-3">{scheme.description}</p>
            <p className="text-sm mb-1"><strong>🎯 Target:</strong> {scheme.target}</p>
            <p className="text-sm mb-2"><strong>💰 Benefit:</strong> {scheme.benefit}</p>
            <a
              href={scheme.link}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-4 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
            >
              Visit Official Page
            </a>
            
            <br />

            <button
            className="inline-block mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            onClick={() => alert(`Applying for ${scheme.title} - Feature Coming Soon!`)}
            >
            Apply Now
            </button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default SarkariSchemes;
