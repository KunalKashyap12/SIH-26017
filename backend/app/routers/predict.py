from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import pandas as pd
import numpy as np

from app.ml.explain import load_ml_artifacts, get_shap_explanation, get_recommendations

router = APIRouter(prefix="/api", tags=["Prediction"])


class PredictRequest(BaseModel):
    state: str = Field(..., example="Maharashtra")
    district: str = Field(..., example="Thane")
    project_type: str = Field(..., example="Highway")
    land_area_hectares: float = Field(..., ge=0, example=150.0)
    affected_families: int = Field(..., ge=0, example=450)
    compensation_disbursed_pct: float = Field(..., ge=0, le=100, example=25.0)
    approval_pending_days: float = Field(..., ge=0, example=320.0)
    legal_disputes_count: int = Field(..., ge=0, example=5)
    possession_pct: float = Field(..., ge=0, le=100, example=20.0)
    rehabilitation_progress_pct: float = Field(..., ge=0, le=100, example=15.0)
    stakeholder_responsiveness_score: float = Field(default=5.0, ge=1, le=10, example=3.5)
    historical_dept_performance_score: float = Field(default=5.0, ge=1, le=10, example=4.0)


@router.post("/predict")
def predict_project_risk(payload: PredictRequest):
    """Predicts risk score, risk category, SHAP top risk factors, and recommendations for a new land acquisition project proposal."""
    try:
        artifacts = load_ml_artifacts()
        clf = artifacts["clf"]
        reg = artifacts.get("regressor")

        # Load regressor if not in cache
        if reg is None:
            import joblib, os
            reg_path = os.path.join(os.path.dirname(__file__), "..", "ml", "saved_models", "regressor.joblib")
            reg = joblib.load(reg_path)
            artifacts["regressor"] = reg

        preprocessor = artifacts["preprocessor"]
        label_encoder = artifacts["label_encoder"]

        features_dict = payload.model_dump()

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

        df_input = pd.DataFrame([features_dict])[categorical_cols + numeric_cols]
        X_proc = preprocessor.transform(df_input)

        # Regression prediction (risk_score)
        predicted_score = float(reg.predict(X_proc)[0])
        predicted_score = round(float(np.clip(predicted_score, 0.0, 100.0)), 1)

        # Classification prediction (risk_category)
        pred_class_idx = clf.predict(X_proc)[0]
        predicted_category = str(label_encoder.inverse_transform([pred_class_idx])[0])

        # Category alignment safeguard based on continuous risk score thresholds (0-35 Low, 35-65 Medium, >65 High)
        if predicted_score >= 65.0:
            predicted_category = "High"
        elif predicted_score <= 35.0:
            predicted_category = "Low"
        elif 35.0 < predicted_score < 65.0 and predicted_category == "High":
            predicted_category = "Medium"

        # SHAP Explainability & Recommendations
        top_factors = get_shap_explanation(features_dict)
        recommendations = get_recommendations(top_factors)

        return {
            "risk_score": predicted_score,
            "risk_category": predicted_category,
            "top_factors": top_factors,
            "recommendations": recommendations,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
