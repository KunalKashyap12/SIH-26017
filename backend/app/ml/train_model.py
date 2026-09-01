import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    precision_score,
    recall_score,
    mean_squared_error,
    r2_score,
    mean_absolute_error,
)
from xgboost import XGBClassifier, XGBRegressor
import shap

# 1. Load Dataset
data_path = os.path.join(os.path.dirname(__file__), "..", "data", "projects.csv")
if not os.path.exists(data_path):
    raise FileNotFoundError(f"Data file not found at {data_path}. Run generate_dataset.py first.")

df = pd.read_csv(data_path)

# Feature & Target Selection
categorical_cols = ["state", "district", "project_type"]
numeric_cols = [
    "land_area_hectares",
    "affected_families",
    "compensation_disbursed_pct",
    "approval_pending_days",
    "legal_disputes_count",
    "possession_pct",
    "rehabilitation_progress_pct",
    "stakeholder_responsiveness_score",
    "historical_dept_performance_score",
]

target_cls = "risk_category"
target_reg = "risk_score"

X = df[categorical_cols + numeric_cols]
y_cls_raw = df[target_cls]
y_reg = df[target_reg]

# Encode target categories
label_encoder = LabelEncoder()
label_encoder.fit(["Low", "Medium", "High"])
y_cls = label_encoder.transform(y_cls_raw)

# 2. Build Preprocessor
preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_cols),
        ("num", StandardScaler(), numeric_cols),
    ]
)

# Fit and transform features
X_processed = preprocessor.fit_transform(X)

# Retrieve transformed feature names
cat_encoder = preprocessor.named_transformers_["cat"]
encoded_cat_cols = cat_encoder.get_feature_names_out(categorical_cols).tolist()
all_feature_names = encoded_cat_cols + numeric_cols

# 3. Train / Test Split (80% Train, 20% Test)
X_train, X_test, y_cls_train, y_cls_test, y_reg_train, y_reg_test = train_test_split(
    X_processed, y_cls, y_reg, test_size=0.20, random_state=42, stratify=y_cls
)

# 4. Train Classification Model (XGBClassifier)
clf = XGBClassifier(
    n_estimators=120,
    learning_rate=0.07,
    max_depth=4,
    random_state=42,
    eval_metric="mlogloss",
)
clf.fit(X_train, y_cls_train)

# Classification Evaluation
y_cls_pred = clf.predict(X_test)
acc = accuracy_score(y_cls_test, y_cls_pred)
f1 = f1_score(y_cls_test, y_cls_pred, average="weighted")
precision = precision_score(y_cls_test, y_cls_pred, average="weighted")
recall = recall_score(y_cls_test, y_cls_pred, average="weighted")

# 5. Train Regression Model (XGBRegressor)
reg = XGBRegressor(
    n_estimators=120,
    learning_rate=0.07,
    max_depth=4,
    random_state=42,
)
reg.fit(X_train, y_reg_train)

# Regression Evaluation
y_reg_pred = reg.predict(X_test)
rmse = float(np.sqrt(mean_squared_error(y_reg_test, y_reg_pred)))
mae = float(mean_absolute_error(y_reg_test, y_reg_pred))
r2 = float(r2_score(y_reg_test, y_reg_pred))

# 6. Save Artifacts to backend/app/ml/saved_models/
save_dir = os.path.join(os.path.dirname(__file__), "saved_models")
os.makedirs(save_dir, exist_ok=True)

joblib.dump(clf, os.path.join(save_dir, "classifier.joblib"))
joblib.dump(reg, os.path.join(save_dir, "regressor.joblib"))
joblib.dump(preprocessor, os.path.join(save_dir, "preprocessor.joblib"))
joblib.dump(label_encoder, os.path.join(save_dir, "label_encoder.joblib"))

# 7. Compute SHAP Values & Global Feature Importance
explainer = shap.TreeExplainer(clf)
shap_values = explainer.shap_values(X_test)

if isinstance(shap_values, list):
    mean_abs_shap = np.mean([np.abs(sv).mean(axis=0) for sv in shap_values], axis=0)
elif isinstance(shap_values, np.ndarray):
    if shap_values.ndim == 3:
        if shap_values.shape[0] == len(X_test):
            mean_abs_shap = np.abs(shap_values).mean(axis=(0, 2))
        else:
            mean_abs_shap = np.abs(shap_values).mean(axis=(0, 1))
    else:
        mean_abs_shap = np.abs(shap_values).mean(axis=0)
else:
    mean_abs_shap = np.zeros(len(all_feature_names))

feature_importance_dict = {
    feature: round(float(importance), 4)
    for feature, importance in sorted(
        zip(all_feature_names, mean_abs_shap), key=lambda item: item[1], reverse=True
    )
}

importance_json_path = os.path.join(save_dir, "feature_importance.json")
with open(importance_json_path, "w") as f:
    json.dump(feature_importance_dict, f, indent=2)

# 8. Output Summary
print("=" * 65)
print("MODEL TRAINING & SHAP FEATURE IMPORTANCE SUMMARY")
print("=" * 65)
print(f"Artifacts saved in: {save_dir}")

print("\n--- 🎯 Classification Model (XGBClassifier) ---")
print(f"  Accuracy    : {acc:.4f} ({acc*100:.2f}%)")
print(f"  Weighted F1 : {f1:.4f}")
print(f"  Precision   : {precision:.4f}")
print(f"  Recall      : {recall:.4f}")

print("\n--- 📈 Regression Model (XGBRegressor) ---")
print(f"  RMSE        : {rmse:.4f}")
print(f"  MAE         : {mae:.4f}")
print(f"  R² Score    : {r2:.4f} ({r2*100:.2f}%)")

print("\n--- 🔍 Top 10 SHAP Global Feature Importances ---")
for i, (feat, val) in enumerate(list(feature_importance_dict.items())[:10], 1):
    print(f"  {i:<2}. {feat:<42}: {val:.4f}")

print("=" * 65)
