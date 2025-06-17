# train_model.py
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib

# Load dataset
df = pd.read_csv("crop_data.csv")

# Split into features and label
X = df.drop("label", axis=1)
y = df["label"]

# Train/test split (optional)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save the trained model
joblib.dump(model, "crop_model.pkl")

print("✅ Model training complete and saved as crop_model.pkl")
