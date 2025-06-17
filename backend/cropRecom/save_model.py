# save_model.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

# Example dataset (use your own if available)
df = pd.read_csv("Crop_recommendation.csv")  # Make sure this file exists

X = df.drop("label", axis=1)
y = df["label"]

model = RandomForestClassifier()
model.fit(X, y)

# Save the model
joblib.dump(model, "crop_model.pkl")
print("Model saved as crop_model.pkl")
