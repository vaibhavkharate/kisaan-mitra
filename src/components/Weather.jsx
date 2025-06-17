import { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import '../index.css';
import { FaMicrophone, FaSpinner } from 'react-icons/fa';
import { BsCloudSun, BsCloudRain, BsWind, BsDroplet } from 'react-icons/bs';

const Weather = () => {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_KEY = "b483967c66fb74340d491d4186601222";
  const GEODB_API_KEY = "6de126c7a6mshf7d299b59c4313ep14bb33jsnfd962d08124b";

  const cleanText = (text) => text.replace(/[.,!?]$/, "");

  const fetchWeather = async (city) => {
    const loc = cleanText(city || location);
    if (!loc) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=${API_KEY}&units=metric`
      );
      setWeather(data);
      setSuggestions([]);
    } catch (err) {
      setWeather(null);
      getCitySuggestions(loc);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const spoken = cleanText(event.results[0][0].transcript);
      setLocation(spoken);
      fetchWeather(spoken);
      setListening(false);
    };

    recognition.onerror = () => {
      alert("Could not recognize voice");
      setListening(false);
    };
  };

  const getCitySuggestions = debounce(async (query) => {
    if (!query) return;
    try {
      const { data } = await axios.get(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities`,
        {
          headers: {
            "X-RapidAPI-Key": GEODB_API_KEY,
            "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
          },
          params: {
            namePrefix: query,
            limit: 5,
            sort: "-population",
          },
        }
      );
      setSuggestions(data.data || []);
    } catch (error) {
      console.log("City Suggestion Error", error);
    }
  }, 500);

  useEffect(() => {
    if (location.length >= 3) getCitySuggestions(location);
  }, [location]);

  return (
    <div className="p-6 w-full max-w-md mx-auto bg-gradient-to-br from-green-100 via-white to-green-50 rounded-3xl shadow-xl mt-8 transition-all">
      <h2 className="text-3xl font-extrabold mb-5 text-green-800 tracking-wide">
        🌾 Kisaan Mitra <span className="text-sm block text-green-600 font-medium">Weather Assistant</span>
      </h2>

      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          className="p-3 border border-green-400 rounded-xl w-full text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter city/village"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button
          onClick={handleVoiceInput}
          className={`p-3 rounded-full bg-green-600 text-white text-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 transition ${
            listening ? "animate-pulse ring-2 ring-green-500" : ""
          }`}
          title="Tap to Speak"
        >
          <FaMicrophone />
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="text-left bg-green-50 rounded-lg shadow px-3 py-2 mb-4">
          <p className="text-sm font-semibold mb-1 text-green-700">Did you mean:</p>
          <ul>
            {suggestions.map((city) => (
              <li
                key={city.id}
                className="hover:bg-green-100 px-2 py-1 cursor-pointer text-sm rounded"
                onClick={() => {
                  setLocation(city.name);
                  fetchWeather(city.name);
                  setSuggestions([]);
                }}
              >
                {city.name}, {city.countryCode}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={() => fetchWeather()}
        className="bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-lg w-full text-lg font-medium mt-2"
        disabled={loading}
      >
        {loading ? <FaSpinner className="animate-spin inline mr-2" /> : "Get Weather"}
      </button>

      {weather && (
        <div className="mt-6 bg-white/90 backdrop-blur-lg border border-green-200 p-5 rounded-xl shadow-inner text-left space-y-2">
          <h3 className="text-xl font-bold text-green-800">{weather.name}</h3>
          <p><BsCloudSun className="inline mr-1 text-yellow-500" /> <strong>Temp:</strong> {weather.main.temp}°C</p>
          <p><BsDroplet className="inline mr-1 text-blue-400" /> <strong>Humidity:</strong> {weather.main.humidity}%</p>
          <p><BsWind className="inline mr-1 text-gray-500" /> <strong>Wind Speed:</strong> {weather.wind.speed} km/h</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
