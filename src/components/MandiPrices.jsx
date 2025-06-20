import React, { useState } from "react";
import axios from "axios";

const MandiPrices = () => {
  const [commodity, setCommodity] = useState("");
  const [state, setState] = useState("");
  const [market, setMarket] = useState("");
  const [results, setResults] = useState([]);
  const [source, setSource] = useState("");
  const [listening, setListening] = useState(false);

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const input = event.results[0][0].transcript;
      const parts = input.split(" ");

      if (parts.length >= 3) {
        setCommodity(parts[0]);
        setState(parts[1]);
        setMarket(parts.slice(2).join(" "));
      }

      setListening(false);
    };

    recognition.onerror = () => {
      alert("Could not recognize speech.");
      setListening(false);
    };
  };

  const fetchPrices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/request", {
        params: {
          commodity,
          state,
          market,
        },
      });

      const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;

      if (data.error) {
        alert("❌ " + data.error);
        setResults([]);
      } else {
        setResults(data);
        setSource("Live Data");
      }
    } catch (error) {
      console.error("Fallback triggered. API not working:", error.message);
      setResults([]); // Could implement local CSV fallback here later
      setSource("Fallback");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg p-6 rounded-xl mt-6">
      <h2 className="text-2xl font-bold mb-4 text-green-700 text-center">🛒 Mandi Price Checker</h2>

      <div className="flex flex-col gap-3">
        <input
          className="p-2 border border-gray-300 rounded-md"
          placeholder="Commodity (e.g., Tomato)"
          value={commodity}
          onChange={(e) => setCommodity(e.target.value)}
        />
        <input
          className="p-2 border border-gray-300 rounded-md"
          placeholder="State (e.g., Maharashtra)"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
        <input
          className="p-2 border border-gray-300 rounded-md"
          placeholder="Market (e.g., Pune)"
          value={market}
          onChange={(e) => setMarket(e.target.value)}
        />

        <div className="flex gap-2">
          <button
            onClick={fetchPrices}
            className="flex-1 bg-green-600 text-white py-2 rounded-md font-semibold"
          >
            Get Prices
          </button>

          <button
            onClick={handleVoiceInput}
            className={`w-12 h-12 text-xl rounded-full ${
              listening ? "animate-ping bg-green-800" : "bg-green-600"
            } text-white`}
          >
            🎤
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <>
          <p className="mt-4 text-sm italic text-gray-500 text-center">
            Data Source: <span className="font-bold">{source}</span>
          </p>

          <div className="mt-4 space-y-3">
            {results.map((item, idx) => (
              <div
                key={idx}
                className="border border-green-300 bg-green-50 p-3 rounded-lg shadow-sm"
              >
                <p><strong>📍 City:</strong> {item.City}</p>
                <p><strong>🧺 Commodity:</strong> {item.Commodity}</p>
                <p><strong>💰 Min:</strong> ₹{item["Min Prize"]}</p>
                <p><strong>💰 Max:</strong> ₹{item["Max Prize"]}</p>
                <p><strong>📊 Model:</strong> ₹{item["Model Prize"]}</p>
                <p><strong>📅 Date:</strong> {item.Date}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MandiPrices;
