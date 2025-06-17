# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS

# Load the trained model
model = joblib.load("crop_model.pkl")

@app.route("/")
def home():
    return jsonify({"message": "Crop Recommendation API is working!"})

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Extract features in the correct order
        features = [
            data["N"],
            data["P"],
            data["K"],
            data["temperature"],
            data["humidity"],
            data["ph"],
            data["rainfall"]
        ]

        prediction = model.predict([features])
        return jsonify({"recommended_crop": prediction[0]})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
