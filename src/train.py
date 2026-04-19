import pandas as pd
import joblib
import os
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

# Ensure directories exist
os.makedirs('models', exist_ok=True)
os.makedirs('outputs', exist_ok=True)

df = pd.read_csv('data/employee_features.csv')

# Preprocessing: drop non-numeric and target
X = df.drop(['employee_id', 'perf_band_next', 'gender', 'department', 'job_level'], axis=1)
y = df['perf_band_next']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# 1. Prediction & Classification Report
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))

# 2. Confusion Matrix Plot
plt.figure(figsize=(8, 6))
cm = confusion_matrix(y_test, y_pred)
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=model.classes_, yticklabels=model.classes_)
plt.title('Confusion Matrix')
plt.ylabel('Actual')
plt.xlabel('Predicted')
plt.savefig('outputs/confusion_matrix.png')

# 3. Feature Importance Plot
plt.figure(figsize=(10, 6))
feat_importances = pd.Series(model.feature_importances_, index=X.columns)
feat_importances.nlargest(10).plot(kind='barh')
plt.title('Top 10 Feature Importances')
plt.savefig('outputs/feature_importance.png')

# 4. Class Distribution Plot (Part of EDA)
plt.figure(figsize=(8, 6))
df['perf_band_next'].value_counts().plot(kind='pie', autopct='%1.1f%%')
plt.title('Performance Band Distribution')
plt.savefig('outputs/class_distribution.png')

joblib.dump(model, 'models/employee_perf_model.pkl')
print("Model and evaluation plots saved to models/ and outputs/")
