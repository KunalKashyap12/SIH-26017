import os
import joblib
import numpy as np
import pandas as pd
import shap

# Global cache for loaded artifacts
_MODEL_CACHE = {}


def load_ml_artifacts():
    """Load and cache trained models, preprocessor, and label encoder."""
    if _MODEL_CACHE:
        return _MODEL_CACHE

    models_dir = os.path.join(os.path.dirname(__file__), "saved_models")
    clf_path = os.path.join(models_dir, "classifier.joblib")
    prep_path = os.path.join(models_dir, "preprocessor.joblib")
    le_path = os.path.join(models_dir, "label_encoder.joblib")

    if not (os.path.exists(clf_path) and os.path.exists(prep_path)):
        raise FileNotFoundError(
            f"Model artifacts missing in {models_dir}. Please run train_model.py first."
        )

    clf = joblib.load(clf_path)
    preprocessor = joblib.load(prep_path)
    label_encoder = joblib.load(le_path)
    explainer = shap.TreeExplainer(clf)

    _MODEL_CACHE["clf"] = clf
    _MODEL_CACHE["preprocessor"] = preprocessor
    _MODEL_CACHE["label_encoder"] = label_encoder
    _MODEL_CACHE["explainer"] = explainer

    return _MODEL_CACHE


# Recommendation Database for Risk Factors
RECOMMENDATION_DATABASE = {
    "legal_disputes_count": [
        "Establish a dedicated Fast-Track Legal Dispute Resolution Cell with state revenue officers.",
        "Initiate out-of-court settlement negotiations and direct arbitration for land owners.",
    ],
    "compensation_disbursed_pct": [
        "Accelerate direct benefit transfer (DBT) disbursal by setting up weekly escrow release milestones.",
        "Deploy mobile verification units to resolve land title and ownership documentation bottlenecks.",
    ],
    "approval_pending_days": [
        "Escalate pending environmental, forest, and railway NOC approvals to the single-window clearance committee.",
        "Assign a senior nodal officer to liaise daily with department secretariats.",
    ],
    "rehabilitation_progress_pct": [
        "Formulate a time-bound R&R (Rehabilitation & Resettlement) package with immediate transit housing allotment.",
        "Engage local community leaders and NGOs to streamline rehabilitation site handover.",
    ],
    "stakeholder_responsiveness_score": [
        "Conduct weekly public consultation hearings and Gram Sabha grievance redressal camps.",
        "Implement a transparent digital portal for landowners to track acquisition status and submit queries.",
    ],
    "historical_dept_performance_score": [
        "Institute inter-departmental task force monitoring with bi-weekly progress benchmarks.",
        "Deploy specialized project management consultants (PMC) to assist lagging department units.",
    ],
    "possession_pct": [
        "Prioritize phase-wise physical possession of unencumbered land parcels first to allow early civil works.",
        "Coordinate with local district administration for peaceful physical land handover.",
    ],
    "affected_families": [
        "Streamline family baseline surveys using GIS mapping and automated compensation calculators.",
        "Implement specialized livelihood restoration training programs for affected landholders.",
    ],
    "land_area_hectares": [
        "Divide large acquisition zones into manageable sub-packages to execute parallel acquisition drives.",
        "Optimize right-of-way (RoW) alignments to minimize private land acquisition requirements.",
    ],
}


def get_shap_explanation(project_features_dict: dict) -> list:
    """Computes SHAP values for a single project and returns the top 4 risk-driving features.

    Args:
        project_features_dict: Dict containing input feature key-values.

    Returns:
        List of dicts representing top 4 driving features with SHAP magnitude & direction.
    """
    artifacts = load_ml_artifacts()
    clf = artifacts["clf"]
    preprocessor = artifacts["preprocessor"]
    explainer = artifacts["explainer"]

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

    # Convert input dict to single-row DataFrame
    input_df = pd.DataFrame([project_features_dict])[categorical_cols + numeric_cols]

    # Preprocess
    X_processed = preprocessor.transform(input_df)

    # Get feature names after one-hot encoding
    cat_encoder = preprocessor.named_transformers_["cat"]
    encoded_cat_cols = cat_encoder.get_feature_names_out(categorical_cols).tolist()
    all_feature_names = encoded_cat_cols + numeric_cols

    # Compute SHAP values for this sample
    shap_vals = explainer.shap_values(X_processed)

    # Handle multi-class SHAP outputs (Focus on High Risk class [index 2] or max impact class)
    # Target High Risk class (class index 2) or predicted class
    pred_class_idx = clf.predict(X_processed)[0]
    high_risk_idx = 2  # High Risk

    if isinstance(shap_vals, list):
        # List per class: select High Risk class array or predicted class
        class_shap = shap_vals[high_risk_idx][0]
    elif isinstance(shap_vals, np.ndarray):
        if shap_vals.ndim == 3:
            # Shape (1, N_features, N_classes) or (N_classes, 1, N_features)
            if shap_vals.shape[0] == 1:
                class_shap = shap_vals[0, :, high_risk_idx]
            else:
                class_shap = shap_vals[high_risk_idx, 0, :]
        else:
            class_shap = shap_vals[0]
    else:
        class_shap = np.zeros(len(all_feature_names))

    # Map One-Hot encoded features back to base feature names
    base_shap_map = {}
    base_val_map = {}

    for feat_name, s_val in zip(all_feature_names, class_shap):
        # Identify base feature name
        if feat_name.startswith("state_"):
            base = "state"
        elif feat_name.startswith("district_"):
            base = "district"
        elif feat_name.startswith("project_type_"):
            base = "project_type"
        else:
            base = feat_name

        # Aggregate SHAP values for base feature (summing or selecting max magnitude)
        if base not in base_shap_map or abs(s_val) > abs(base_shap_map[base]):
            base_shap_map[base] = float(s_val)
            base_val_map[base] = project_features_dict.get(base, None)

    # Sort base features by absolute SHAP value magnitude (descending)
    sorted_features = sorted(base_shap_map.items(), key=lambda x: abs(x[1]), reverse=True)

    # Extract Top 4 features
    top_4 = []
    for feat, s_val in sorted_features[:4]:
        direction = "increases_risk" if s_val > 0 else "decreases_risk"
        val = base_val_map.get(feat, None)
        top_4.append(
            {
                "feature": feat,
                "value": val,
                "shap_value": round(s_val, 4),
                "magnitude": round(abs(s_val), 4),
                "direction": direction,
            }
        )

    return top_4


def get_recommendations(top_factors_list: list) -> list:
    """Returns rule-based actionable recommendations for a list of top risk factors.

    Args:
        top_factors_list: List of feature names (strings) or list of feature dicts from get_shap_explanation.

    Returns:
        List of actionable recommendation strings.
    """
    recommendations = []
    seen_factors = set()

    for item in top_factors_list:
        # Extract feature name if dict passed
        factor_name = item["feature"] if isinstance(item, dict) else str(item)

        if factor_name in seen_factors:
            continue
        seen_factors.add(factor_name)

        if factor_name in RECOMMENDATION_DATABASE:
            recs = RECOMMENDATION_DATABASE[factor_name]
            recommendations.extend(recs)

    return recommendations


if __name__ == "__main__":
    print("=" * 65)
    print("TESTING EXPLAINABILITY & RECOMMENDATIONS ENGINE")
    print("=" * 65)

    data_path = os.path.join(os.path.dirname(__file__), "..", "data", "projects.csv")
    df = pd.read_csv(data_path)

    # Select sample row (High risk sample if available or first row)
    high_risk_df = df[df["risk_category"] == "High"]
    sample_row = (
        high_risk_df.iloc[0].to_dict() if not high_risk_df.empty else df.iloc[0].to_dict()
    )

    print(f"Sample Project ID   : {sample_row['project_id']}")
    print(f"Project Name        : {sample_row['project_name']}")
    print(f"Actual Risk Category: {sample_row['risk_category']}")
    print(f"Actual Risk Score   : {sample_row['risk_score']}")

    # 1. Test get_shap_explanation
    top_4_factors = get_shap_explanation(sample_row)

    print("\n--- Top 4 SHAP Driving Factors ---")
    for idx, item in enumerate(top_4_factors, 1):
        dir_symbol = "(+) Increases Risk" if item["direction"] == "increases_risk" else "(-) Decreases Risk"
        print(f"  {idx}. {item['feature']:<35} | Value: {item['value']} | SHAP: {item['shap_value']:+.4f} | {dir_symbol}")

    # 2. Test get_recommendations
    recommendations = get_recommendations(top_4_factors)

    print("\n--- Actionable Recommendations ---")
    for idx, rec in enumerate(recommendations, 1):
        print(f"  {idx}. {rec}")

    print("=" * 65)
