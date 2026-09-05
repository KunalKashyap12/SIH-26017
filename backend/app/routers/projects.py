from typing import Optional
import pandas as pd
from fastapi import APIRouter, HTTPException, Query
from app.data.db import get_projects_df
from app.ml.explain import get_recommendations, get_shap_explanation

router = APIRouter(prefix="/api/projects", tags=["Projects"])


@router.get("")
def list_projects(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    state: Optional[str] = Query(None, description="Filter by Indian state"),
    district: Optional[str] = Query(None, description="Filter by district"),
    project_type: Optional[str] = Query(None, description="Filter by project type"),
    risk_category: Optional[str] = Query(None, description="Filter by risk category (Low, Medium, High)"),
    search: Optional[str] = Query(None, description="Search by project ID, official ID, name, state, district, or sector"),
):
    """Returns a paginated list of projects with multi-field searching and filtering capabilities."""
    df = get_projects_df()

    # Apply filters
    filtered_df = df.copy()

    if state:
        filtered_df = filtered_df[filtered_df["state"].str.lower() == state.lower()]
    if district:
        filtered_df = filtered_df[filtered_df["district"].str.lower() == district.lower()]
    if project_type:
        filtered_df = filtered_df[filtered_df["project_type"].str.lower() == project_type.lower()]
    if risk_category:
        filtered_df = filtered_df[filtered_df["risk_category"].str.lower() == risk_category.lower()]

    if search:
        search_str = search.strip()
        # Clean search query (handling spaces vs hyphens for IDs like GOV 26017 0015 -> GOV-26017-0015)
        search_normalized = search_str.replace(" ", "-")

        mask = (
            filtered_df["project_id"].str.contains(search_str, case=False, na=False)
            | filtered_df["project_id"].str.contains(search_normalized, case=False, na=False)
            | filtered_df["project_name"].str.contains(search_str, case=False, na=False)
            | filtered_df["state"].str.contains(search_str, case=False, na=False)
            | filtered_df["district"].str.contains(search_str, case=False, na=False)
            | filtered_df["project_type"].str.contains(search_str, case=False, na=False)
        )

        if "official_project_id" in filtered_df.columns:
            mask = mask | filtered_df["official_project_id"].str.contains(search_str, case=False, na=False)
            mask = mask | filtered_df["official_project_id"].str.contains(search_normalized, case=False, na=False)

        if "sector" in filtered_df.columns:
            mask = mask | filtered_df["sector"].str.contains(search_str, case=False, na=False)

        filtered_df = filtered_df[mask]

    # When no specific risk_category filter is selected, interleave High, Medium, and Low risk projects for a balanced mixed view
    if not risk_category and not filtered_df.empty:
        high_subset = filtered_df[filtered_df["risk_category"].str.lower() == "high"].copy()
        med_subset = filtered_df[filtered_df["risk_category"].str.lower() == "medium"].copy()
        low_subset = filtered_df[filtered_df["risk_category"].str.lower() == "low"].copy()

        high_subset["_sort_idx"] = range(0, 3 * len(high_subset), 3)
        med_subset["_sort_idx"] = range(1, 3 * len(med_subset), 3)
        low_subset["_sort_idx"] = range(2, 3 * len(low_subset), 3)

        combined = pd.concat([high_subset, med_subset, low_subset]).sort_values(by="_sort_idx")
        filtered_df = combined.drop(columns=["_sort_idx"])


    total = len(filtered_df)
    pages = (total + limit - 1) // limit if total > 0 else 1
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit


    # Select fields for list view
    summary_cols = [
        "project_id",
        "project_name",
        "state",
        "district",
        "project_type",
        "risk_category",
        "risk_score",
        "delay_days",
        "lat",
        "lng",
    ]
    paginated_df = filtered_df.iloc[start_idx:end_idx][summary_cols]
    projects_list = paginated_df.to_dict(orient="records")

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "pages": pages,
        "projects": projects_list,
    }


@router.get("/{project_id}")
def get_project_details(project_id: str):
    """Returns full feature details for a specific project by project_id."""
    df = get_projects_df()
    match = df[df["project_id"].str.upper() == project_id.upper()]

    if match.empty:
        raise HTTPException(status_code=404, detail=f"Project with ID '{project_id}' not found.")

    project_record = match.iloc[0].fillna(0).to_dict()

    # Calculate dynamic project-specific Department Performance & Stakeholder Responsiveness scores
    pending_days = float(project_record.get("approval_pending_days", 0))
    comp_pct = float(project_record.get("compensation_disbursed_pct", 50))
    pos_pct = float(project_record.get("possession_pct", 50))
    legal_cases = float(project_record.get("legal_disputes_count", 0))
    rr_pct = float(project_record.get("rehabilitation_progress_pct", 50))

    pid = str(project_record.get("project_id", ""))
    salt = (hash(pid) % 15) / 10.0

    dept_perf = max(1.5, min(9.8, 10.0 - (pending_days / 35.0) - ((100.0 - comp_pct) * 0.025) - ((100.0 - pos_pct) * 0.015)))
    stake_resp = max(1.2, min(9.6, 10.0 - (legal_cases * 1.3) - ((100.0 - rr_pct) * 0.03) - salt))

    project_record["historical_dept_performance_score"] = round(dept_perf, 1)
    project_record["stakeholder_responsiveness_score"] = round(stake_resp, 1)

    return project_record




@router.get("/{project_id}/insights")
def get_project_insights(project_id: str):
    """Returns SHAP explainability insights and actionable recommendations for a specific project."""
    df = get_projects_df()
    match = df[df["project_id"].str.upper() == project_id.upper()]

    if match.empty:
        raise HTTPException(status_code=404, detail=f"Project with ID '{project_id}' not found.")

    project_record = match.iloc[0].to_dict()

    # Compute SHAP explanation & recommendations
    top_factors = get_shap_explanation(project_record)
    recommendations = get_recommendations(top_factors)

    return {
        "project_id": project_record["project_id"],
        "project_name": project_record["project_name"],
        "risk_score": project_record["risk_score"],
        "risk_category": project_record["risk_category"],
        "delay_days": project_record["delay_days"],
        "top_factors": top_factors,
        "recommendations": recommendations,
    }
