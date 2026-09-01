from typing import Optional
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
    search: Optional[str] = Query(None, description="Search by project name"),
):
    """Returns a paginated list of projects with filtering and search capabilities."""
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
        filtered_df = filtered_df[filtered_df["project_name"].str.contains(search, case=False, na=False)]

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

    project_record = match.iloc[0].to_dict()
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
