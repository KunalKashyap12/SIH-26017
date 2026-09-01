from fastapi import APIRouter
from app.data.db import get_projects_df
from app.data.district_coords import get_district_coords

router = APIRouter(prefix="/api", tags=["Statistics & Alerts"])


@router.get("/stats/overview")
def get_stats_overview():
    """Returns high-level summary metrics across all projects."""
    df = get_projects_df()

    risk_counts = df["risk_category"].value_counts().to_dict()
    for cat in ["Low", "Medium", "High"]:
        risk_counts.setdefault(cat, 0)

    return {
        "total_projects": int(len(df)),
        "risk_category_counts": {
            "Low": int(risk_counts.get("Low", 0)),
            "Medium": int(risk_counts.get("Medium", 0)),
            "High": int(risk_counts.get("High", 0)),
        },
        "avg_risk_score": round(float(df["risk_score"].mean()), 2),
        "avg_delay_days": round(float(df["delay_days"].mean()), 2),
        "total_affected_families": int(df["affected_families"].sum()),
        "total_land_area_hectares": round(float(df["land_area_hectares"].sum()), 2),
        "avg_compensation_disbursed_pct": round(float(df["compensation_disbursed_pct"].mean()), 2),
    }


@router.get("/stats/by-state")
def get_stats_by_state():
    """Returns state-level breakdown of risk categories, averages, and project totals."""
    df = get_projects_df()

    grouped = df.groupby("state")
    result = []

    for state, group in grouped:
        counts = group["risk_category"].value_counts().to_dict()
        result.append(
            {
                "state": state,
                "total_projects": int(len(group)),
                "Low": int(counts.get("Low", 0)),
                "Medium": int(counts.get("Medium", 0)),
                "High": int(counts.get("High", 0)),
                "avg_risk_score": round(float(group["risk_score"].mean()), 2),
                "avg_delay_days": round(float(group["delay_days"].mean()), 2),
                "avg_compensation_pct": round(float(group["compensation_disbursed_pct"].mean()), 2),
            }
        )

    # Sort descending by total projects
    result = sorted(result, key=lambda x: x["total_projects"], reverse=True)
    return result


@router.get("/stats/by-district")
def get_stats_by_district():
    """Returns district-level risk breakdown with approximate latitude and longitude coordinates."""
    df = get_projects_df()

    grouped = df.groupby(["state", "district"])
    result = []

    for (state, district), group in grouped:
        counts = group["risk_category"].value_counts().to_dict()
        coords = get_district_coords(district)

        result.append(
            {
                "state": state,
                "district": district,
                "lat": coords["lat"],
                "lng": coords["lng"],
                "total_projects": int(len(group)),
                "Low": int(counts.get("Low", 0)),
                "Medium": int(counts.get("Medium", 0)),
                "High": int(counts.get("High", 0)),
                "avg_risk_score": round(float(group["risk_score"].mean()), 2),
                "avg_delay_days": round(float(group["delay_days"].mean()), 2),
            }
        )

    result = sorted(result, key=lambda x: x["avg_risk_score"], reverse=True)
    return result


@router.get("/alerts")
def get_high_risk_alerts():
    """Returns top 20 High risk projects sorted by risk_score descending."""
    df = get_projects_df()

    high_risk_df = df[df["risk_category"].str.lower() == "high"].copy()
    high_risk_df = high_risk_df.sort_values(by="risk_score", ascending=False).head(20)

    cols = [
        "project_id",
        "project_name",
        "state",
        "district",
        "project_type",
        "risk_category",
        "risk_score",
        "delay_days",
        "affected_families",
        "compensation_disbursed_pct",
        "legal_disputes_count",
    ]
    alerts_list = high_risk_df[cols].to_dict(orient="records")

    return {
        "count": len(alerts_list),
        "alerts": alerts_list,
    }
