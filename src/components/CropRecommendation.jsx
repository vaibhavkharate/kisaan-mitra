import React, { useState } from "react";
import axios from "axios";
import cropInfo from "../data/cropInfo";

const CropRecommendation = () => {
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/predict", formData);
      setResult(res.data.recommended_crop);
    } catch (error) {
      console.error("API Error", error);
      alert("Failed to get prediction.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-6 mt-8">
      <h2 className="text-2xl font-bold text-green-700 mb-4">🌱 Crop Recommendation</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="col-span-1">
            <label className="block text-sm font-semibold mb-1 capitalize">{key}</label>
            <input
              type="number"
              name={key}
              value={value}
              onChange={handleChange}
              required
              className="w-full border border-green-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        ))}

        <div className="col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded mt-4 font-medium transition"
          >
            {loading ? "Predicting..." : "Get Recommendation"}
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-green-100 rounded-lg text-left text-green-900 shadow">
          <h3 className="text-lg font-bold mb-2 text-center">
            ✅ Recommended Crop: <span className="uppercase">{result}</span>
          </h3>

          {cropInfo[result.toLowerCase()] ? (
            <div className="text-sm space-y-1">
              <p><strong>🌾 Crop:</strong> {cropInfo[result.toLowerCase()].name}</p>
              <p><strong>📆 Season:</strong> {cropInfo[result.toLowerCase()].season}</p>
              <p><strong>🌱 Soil:</strong> {cropInfo[result.toLowerCase()].soil}</p>
              <p><strong>🌧 Rainfall:</strong> {cropInfo[result.toLowerCase()].rainfall}</p>
              <p><strong>🌡 Temperature:</strong> {cropInfo[result.toLowerCase()].temperature}</p>
              <p><strong>ℹ️ Details:</strong> {cropInfo[result.toLowerCase()].details}</p>
            </div>
          ) : (
            <p>No detailed info available for this crop.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CropRecommendation;
