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
    
    crop_data = pd.read_csv("crop_info.csv")

@app.route('/crop-info', methods=['GET'])
def get_crop_info():
    crop_name = request.args.get('name', '').strip().lower()
    if not crop_name:
        return jsonify({'error': 'Crop name is required'}), 400

    match = crop_data[crop_data['name'].str.lower() == crop_name]

    if match.empty:
        return jsonify({'error': 'Crop not found'}), 404

    crop_info = match.iloc[0].to_dict()
    return jsonify(crop_info)


if __name__ == "__main__":
    app.run(debug=True)
