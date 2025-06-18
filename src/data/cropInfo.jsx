// frontend/src/components/CropInfo.jsx

import React, { useState } from "react";
import axios from "axios";

const CropInfo = () => {
  const [cropName, setCropName] = useState("");
  const [info, setInfo] = useState(null);
  const [error, setError] = useState("");

  const fetchCropInfo = async () => {
    try {
      const { data } = await axios.get(
        `http://127.0.0.1:5000/crop-info?name=${cropName}`
      );
      setInfo(data);
      setError("");
    } catch (err) {
      setInfo(null);
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow-lg rounded-xl mt-6">
      <h2 className="text-2xl font-bold text-green-700 mb-4">🌾 Crop Info</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter crop name"
          value={cropName}
          onChange={(e) => setCropName(e.target.value)}
          className="border border-green-400 px-4 py-2 rounded-lg w-full"
        />
        <button
          onClick={fetchCropInfo}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          Search
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {info && (
        <div className="text-left bg-green-50 p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold">{info.name}</h3>
          <p><strong>🌱 Season:</strong> {info.season}</p>
          <p><strong>🧱 Soil:</strong> {info.soil}</p>
          <p><strong>🌧 Rainfall:</strong> {info.rainfall}</p>
          <p><strong>🌡 Temperature:</strong> {info.temperature}</p>
          <p className="mt-2">{info.details}</p>
        </div>
      )}
    </div>
  );
};

export default CropInfo;
