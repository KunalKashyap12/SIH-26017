import os
import sqlite3
import pandas as pd
from pathlib import Path
from app.data.district_coords import get_district_coords

_PROJECTS_CACHE = None

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
PIPELINE_DB_PATH = BACKEND_DIR / "gov_api_pipeline" / "data" / "gov_land_projects.db"
LOCAL_CSV_PATH = Path(__file__).resolve().parent / "projects.csv"

def get_projects_df() -> pd.DataFrame:
    """Loads and caches projects DataFrame from the pipeline SQLite DB or local projects.csv fallback."""
    global _PROJECTS_CACHE
    if _PROJECTS_CACHE is not None:
        return _PROJECTS_CACHE

    df = None

    # 1. Try loading directly from pipeline SQLite database
    if PIPELINE_DB_PATH.exists():
        try:
            conn = sqlite3.connect(str(PIPELINE_DB_PATH))
            query = """
                SELECT 
                    p.project_id, p.official_project_id, p.title as project_name, p.sector, p.project_type,
                    p.implementing_agency, p.executing_agency, p.funding_source, p.project_status,
                    p.approval_date, p.original_target_date, p.latest_target_date,
                    l.state, l.district, l.tehsil_anchal, l.village_mouza, l.latitude as lat, l.longitude as lng,
                    l.location_map_url,
                    ld.land_area_acres, ld.land_area_hectares, ld.forest_land_ha, ld.forest_land_share_pct,
                    ld.affected_land_feature, ld.waterbody_impact, ld.affected_families, ld.affected_habitations,
                    ld.compensation_disbursed_pct, ld.possession_pct, ld.rehabilitation_progress_pct, ld.encumbrance_free_land,
                    c.sia_status, c.environmental_clearance, c.forest_clearance_stage1, c.forest_clearance_stage2, c.approval_pending_days,
                    lit.land_dispute, lit.local_resistance, lit.law_order_issue, lit.litigation_active, lit.litigation_type, lit.court_level, lit.legal_disputes_count,
                    f.original_cost_cr, f.revised_cost_cr, f.cost_overrun_cr, f.cost_overrun_pct, f.expenditure_cr,
                    r.delay_days, r.schedule_slippage_days, r.risk_score, r.risk_category, r.political_social_sensitivity, r.stakeholder_coordination_risk, r.root_cause,
                    a.source_name, a.source_portal_url, a.direct_entry_url, a.gazette_notification_link
                FROM projects p
                LEFT JOIN locations l ON p.project_id = l.project_id
                LEFT JOIN land_details ld ON p.project_id = ld.project_id
                LEFT JOIN clearances c ON p.project_id = c.project_id
                LEFT JOIN litigations lit ON p.project_id = lit.project_id
                LEFT JOIN financials f ON p.project_id = f.project_id
                LEFT JOIN risk_metrics r ON p.project_id = r.project_id
                LEFT JOIN (
                    SELECT project_id, source_name, source_portal_url, direct_entry_url, gazette_notification_link,
                           MAX(fetched_at)
                    FROM source_audit_logs
                    GROUP BY project_id
                ) a ON p.project_id = a.project_id;
            """
            df = pd.read_sql_query(query, conn)
            conn.close()
        except Exception:
            df = None

    # 2. Fallback to app projects.csv
    if df is None or df.empty:
        if LOCAL_CSV_PATH.exists():
            df = pd.read_csv(LOCAL_CSV_PATH)
        else:
            raise FileNotFoundError("No project data source found.")

    # Add lat/lng to DataFrame if not present
    if "lat" not in df.columns or "lng" not in df.columns:
        lats = []
        lngs = []
        for dist in df["district"]:
            coords = get_district_coords(dist)
            lats.append(coords["lat"])
            lngs.append(coords["lng"])
        df["lat"] = lats
        df["lng"] = lngs

    _PROJECTS_CACHE = df
    return _PROJECTS_CACHE


def reload_projects_df():
    """Force reload projects DataFrame."""
    global _PROJECTS_CACHE
    _PROJECTS_CACHE = None
    return get_projects_df()
