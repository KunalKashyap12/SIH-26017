import sqlite3
import logging
from typing import Dict, Any, List, Optional
from pathlib import Path
from config import DB_PATH, BASE_DIR

logger = logging.getLogger("GovPipeline.DBManager")

SCHEMA_FILE = BASE_DIR / "db" / "schema.sql"

class DatabaseManager:
    def __init__(self, db_path: Path = DB_PATH):
        self.db_path = db_path
        self.init_database()

    def get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(str(self.db_path))
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON;")
        conn.execute("PRAGMA synchronous = OFF;")
        conn.execute("PRAGMA journal_mode = MEMORY;")
        return conn

    def init_database(self):
        """Creates table schema if it does not exist."""
        logger.info(f"Initializing database at: {self.db_path}")
        if not SCHEMA_FILE.exists():
            raise FileNotFoundError(f"Schema file not found at {SCHEMA_FILE}")
            
        with open(SCHEMA_FILE, "r", encoding="utf-8") as f:
            schema_sql = f.read()

        with self.get_connection() as conn:
            conn.executescript(schema_sql)
            conn.commit()

    def upsert_batch_records(self, records: List[Dict[str, Any]]):
        """
        Inserts/Updates records in bulk within a single transaction for maximum speed.
        """
        logger.info(f"Executing batch UPSERT for {len(records)} records...")
        with self.get_connection() as conn:
            cursor = conn.cursor()
            conn.execute("BEGIN TRANSACTION;")

            for project_data in records:
                p_id = project_data["project_id"]

                # 1. Projects table
                cursor.execute("""
                    INSERT INTO projects (
                        project_id, official_project_id, title, sector, project_type,
                        implementing_agency, executing_agency, funding_source, project_status,
                        approval_date, original_target_date, latest_target_date, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                    ON CONFLICT(project_id) DO UPDATE SET
                        official_project_id=excluded.official_project_id,
                        title=excluded.title,
                        sector=excluded.sector,
                        project_type=excluded.project_type,
                        implementing_agency=excluded.implementing_agency,
                        executing_agency=excluded.executing_agency,
                        funding_source=excluded.funding_source,
                        project_status=excluded.project_status,
                        approval_date=excluded.approval_date,
                        original_target_date=excluded.original_target_date,
                        latest_target_date=excluded.latest_target_date,
                        updated_at=CURRENT_TIMESTAMP;
                """, (
                    p_id,
                    project_data.get("official_project_id"),
                    project_data.get("title") or project_data.get("project_name", "Untitled Project"),
                    project_data.get("sector", "General Infrastructure"),
                    project_data.get("project_type"),
                    project_data.get("implementing_agency"),
                    project_data.get("executing_agency"),
                    project_data.get("funding_source"),
                    project_data.get("project_status", "ACTIVE"),
                    project_data.get("approval_date"),
                    project_data.get("original_target_date"),
                    project_data.get("latest_target_date")
                ))

                # 2. Locations table
                cursor.execute("DELETE FROM locations WHERE project_id = ?;", (p_id,))
                cursor.execute("""
                    INSERT INTO locations (
                        project_id, state, district, tehsil_anchal, village_mouza,
                        latitude, longitude, location_map_url
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
                """, (
                    p_id,
                    project_data.get("state", "Unknown"),
                    project_data.get("district", "Unknown"),
                    project_data.get("tehsil_anchal"),
                    project_data.get("village_mouza"),
                    project_data.get("lat") or project_data.get("latitude"),
                    project_data.get("lng") or project_data.get("longitude"),
                    project_data.get("location_map_url")
                ))

                # 3. Land Details table
                cursor.execute("""
                    INSERT INTO land_details (
                        project_id, land_area_acres, land_area_hectares, forest_land_ha,
                        forest_land_share_pct, affected_land_feature, waterbody_impact,
                        affected_families, affected_habitations, compensation_disbursed_pct,
                        possession_pct, rehabilitation_progress_pct, encumbrance_free_land
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(project_id) DO UPDATE SET
                        land_area_acres=excluded.land_area_acres,
                        land_area_hectares=excluded.land_area_hectares,
                        forest_land_ha=excluded.forest_land_ha,
                        forest_land_share_pct=excluded.forest_land_share_pct,
                        affected_land_feature=excluded.affected_land_feature,
                        waterbody_impact=excluded.waterbody_impact,
                        affected_families=excluded.affected_families,
                        affected_habitations=excluded.affected_habitations,
                        compensation_disbursed_pct=excluded.compensation_disbursed_pct,
                        possession_pct=excluded.possession_pct,
                        rehabilitation_progress_pct=excluded.rehabilitation_progress_pct,
                        encumbrance_free_land=excluded.encumbrance_free_land;
                """, (
                    p_id,
                    project_data.get("land_area_acres", 0.0),
                    project_data.get("land_area_hectares", 0.0),
                    project_data.get("forest_land_ha", 0.0),
                    project_data.get("forest_land_share_pct", 0.0),
                    project_data.get("affected_land_feature", "Agricultural"),
                    project_data.get("waterbody_impact", "NO"),
                    project_data.get("affected_families", 0),
                    project_data.get("affected_habitations", 0),
                    project_data.get("compensation_disbursed_pct", 0.0),
                    project_data.get("possession_pct", 0.0),
                    project_data.get("rehabilitation_progress_pct", 0.0),
                    project_data.get("encumbrance_free_land", "NO")
                ))

                # 4. Clearances table
                cursor.execute("""
                    INSERT INTO clearances (
                        project_id, sia_status, environmental_clearance,
                        forest_clearance_stage1, forest_clearance_stage2, approval_pending_days
                    ) VALUES (?, ?, ?, ?, ?, ?)
                    ON CONFLICT(project_id) DO UPDATE SET
                        sia_status=excluded.sia_status,
                        environmental_clearance=excluded.environmental_clearance,
                        forest_clearance_stage1=excluded.forest_clearance_stage1,
                        forest_clearance_stage2=excluded.forest_clearance_stage2,
                        approval_pending_days=excluded.approval_pending_days;
                """, (
                    p_id,
                    project_data.get("sia_status", "UNDERTAKEN"),
                    project_data.get("environmental_clearance", "APPROVED"),
                    project_data.get("forest_clearance_stage1", "NA"),
                    project_data.get("forest_clearance_stage2", "NA"),
                    project_data.get("approval_pending_days", 0.0)
                ))

                # 5. Litigations table
                cursor.execute("""
                    INSERT INTO litigations (
                        project_id, land_dispute, local_resistance, law_order_issue,
                        litigation_active, litigation_type, court_level, legal_disputes_count
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(project_id) DO UPDATE SET
                        land_dispute=excluded.land_dispute,
                        local_resistance=excluded.local_resistance,
                        law_order_issue=excluded.law_order_issue,
                        litigation_active=excluded.litigation_active,
                        litigation_type=excluded.litigation_type,
                        court_level=excluded.court_level,
                        legal_disputes_count=excluded.legal_disputes_count;
                """, (
                    p_id,
                    project_data.get("land_dispute", "NO"),
                    project_data.get("local_resistance", "NO"),
                    project_data.get("law_order_issue", "NO"),
                    project_data.get("litigation", "NO"),
                    project_data.get("litigation_type", "NA"),
                    project_data.get("court_level", "NA"),
                    project_data.get("legal_disputes_count", 0)
                ))

                # 6. Financials table
                cursor.execute("""
                    INSERT INTO financials (
                        project_id, original_cost_cr, revised_cost_cr,
                        cost_overrun_cr, cost_overrun_pct, expenditure_cr
                    ) VALUES (?, ?, ?, ?, ?, ?)
                    ON CONFLICT(project_id) DO UPDATE SET
                        original_cost_cr=excluded.original_cost_cr,
                        revised_cost_cr=excluded.revised_cost_cr,
                        cost_overrun_cr=excluded.cost_overrun_cr,
                        cost_overrun_pct=excluded.cost_overrun_pct,
                        expenditure_cr=excluded.expenditure_cr;
                """, (
                    p_id,
                    project_data.get("original_cost_cr", 0.0),
                    project_data.get("revised_cost_cr", 0.0),
                    project_data.get("cost_overrun_cr", 0.0),
                    project_data.get("cost_overrun_pct", 0.0),
                    project_data.get("expenditure_cr", 0.0)
                ))

                # 7. Risk Metrics table
                cursor.execute("""
                    INSERT INTO risk_metrics (
                        project_id, delay_days, schedule_slippage_days, risk_score,
                        risk_category, political_social_sensitivity, stakeholder_coordination_risk, root_cause
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(project_id) DO UPDATE SET
                        delay_days=excluded.delay_days,
                        schedule_slippage_days=excluded.schedule_slippage_days,
                        risk_score=excluded.risk_score,
                        risk_category=excluded.risk_category,
                        political_social_sensitivity=excluded.political_social_sensitivity,
                        stakeholder_coordination_risk=excluded.stakeholder_coordination_risk,
                        root_cause=excluded.root_cause;
                """, (
                    p_id,
                    project_data.get("delay_days", 0),
                    project_data.get("schedule_slippage_days", 0),
                    project_data.get("risk_score", 0.0),
                    project_data.get("risk_category", "Low"),
                    project_data.get("political_social_sensitivity", "LOW"),
                    project_data.get("stakeholder_coordination_risk", "LOW"),
                    project_data.get("root_cause", "Normal schedule adjustment")
                ))

                # 8. Source Audit Log table
                cursor.execute("""
                    INSERT INTO source_audit_logs (
                        project_id, source_name, source_portal_url, direct_entry_url,
                        gazette_notification_link, api_endpoint, http_status
                    ) VALUES (?, ?, ?, ?, ?, ?, ?);
                """, (
                    p_id,
                    project_data.get("source_name", "Government API Portal"),
                    project_data.get("source_portal_url"),
                    project_data.get("direct_entry_url"),
                    project_data.get("gazette_notification_link"),
                    project_data.get("api_endpoint"),
                    project_data.get("http_status", 200)
                ))

            conn.commit()

    def fetch_database_statistics(self) -> Dict[str, Any]:
        """Returns row counts and analytical summaries of the stored database."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            p_count = cursor.execute("SELECT COUNT(*) FROM projects;").fetchone()[0]
            loc_count = cursor.execute("SELECT COUNT(*) FROM locations;").fetchone()[0]
            audit_count = cursor.execute("SELECT COUNT(*) FROM source_audit_logs;").fetchone()[0]
            
            sector_breakdown = dict(cursor.execute("SELECT sector, COUNT(*) FROM projects GROUP BY sector;").fetchall())
            risk_breakdown = dict(cursor.execute("SELECT risk_category, COUNT(*) FROM risk_metrics GROUP BY risk_category;").fetchall())
            
            return {
                "total_projects": p_count,
                "total_locations": loc_count,
                "total_audit_logs": audit_count,
                "sector_breakdown": sector_breakdown,
                "risk_breakdown": risk_breakdown
            }

    def fetch_all_unified_records(self) -> List[Dict[str, Any]]:
        """Joins all tables and returns clean, unified project dictionaries."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
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
            rows = cursor.execute(query).fetchall()
            return [dict(row) for row in rows]
