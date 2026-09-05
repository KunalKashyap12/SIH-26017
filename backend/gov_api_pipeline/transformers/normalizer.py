import math
import logging
from typing import Dict, Any, List

logger = logging.getLogger("GovPipeline.DataNormalizer")

# Standard District GPS Coordinate Lookup Matrix
DISTRICT_GPS = {
    "Bengaluru Urban": {"lat": 12.9716, "lng": 77.5946},
    "Surat": {"lat": 21.1702, "lng": 72.8311},
    "Varanasi": {"lat": 25.3176, "lng": 82.9739},
    "Pune": {"lat": 18.5204, "lng": 73.8567},
    "Hooghly": {"lat": 22.9038, "lng": 88.3888},
    "Darbhanga": {"lat": 26.1542, "lng": 85.8918},
    "Ahmedabad": {"lat": 23.0225, "lng": 72.5714},
    "Khordha": {"lat": 20.1837, "lng": 85.6160},
    "Lucknow": {"lat": 26.8467, "lng": 80.9462},
    "Patna": {"lat": 25.5941, "lng": 85.1376},
    "Ranchi": {"lat": 23.3441, "lng": 85.3096},
}

class DataNormalizer:
    def normalize_record(self, raw: Dict[str, Any], index: int) -> Dict[str, Any]:
        """
        Transforms raw payload into normalized schema matching relational database structures.
        """
        official_id = str(raw.get("official_project_id") or f"GOV-PRJ-{index+1001:04d}")
        project_id = f"GOV-26017-{index+1:04d}"
        
        state = raw.get("state", "Maharashtra")
        district = raw.get("district", "Pune")
        
        # Resolve Lat / Lng
        lat = raw.get("lat") or raw.get("latitude")
        lng = raw.get("lng") or raw.get("longitude")
        if not lat or not lng:
            gps = DISTRICT_GPS.get(district, {"lat": 20.5937, "lng": 78.9629})
            lat, lng = gps["lat"], gps["lng"]

        # Land conversion
        land_acres = float(raw.get("land_area_acres") or 0.0)
        land_ha = float(raw.get("land_area_hectares") or 0.0)
        if land_ha > 0 and land_acres == 0.0:
            land_acres = round(land_ha * 2.47105, 2)
        elif land_acres > 0 and land_ha == 0.0:
            land_ha = round(land_acres * 0.404686, 2)
        elif land_ha == 0.0 and land_acres == 0.0:
            land_ha, land_acres = 150.0, 370.6

        # Financials
        orig_cost = float(raw.get("original_cost_cr") or 500.0)
        rev_cost = float(raw.get("revised_cost_cr") or orig_cost * 1.12)
        cost_overrun = round(rev_cost - orig_cost, 2)
        cost_overrun_pct = round((cost_overrun / orig_cost) * 100.0, 2) if orig_cost > 0 else 0.0

        # Risk Classification
        delay_days = int(raw.get("delay_days") or 0)
        risk_score = float(raw.get("risk_score") or round(min(100.0, (delay_days / 10.0) + (cost_overrun_pct * 0.5)), 1))
        
        if risk_score > 65.0 or delay_days > 500:
            risk_cat = "High"
        elif risk_score > 35.0 or delay_days > 200:
            risk_cat = "Medium"
        else:
            risk_cat = "Low"

        # Construct location map URL
        map_url = raw.get("location_map_url") or f"https://www.google.com/maps?q={lat:.4f},{lng:.4f}"

        return {
            "project_id": project_id,
            "official_project_id": official_id,
            "title": raw.get("title") or raw.get("project_name", "National Infrastructure Project"),
            "sector": raw.get("sector", "Highway"),
            "project_type": raw.get("project_type", "Greenfield Infrastructure Development"),
            "implementing_agency": raw.get("implementing_agency", "MoRTH / Central Ministries"),
            "executing_agency": raw.get("executing_agency", "Infrastructure EPC Contractor"),
            "funding_source": raw.get("funding_source", "Central Government Expenditure"),
            "project_status": raw.get("project_status", "ACTIVE / UNDER CONSTRUCTION"),
            "approval_date": raw.get("approval_date", "2021-04-15"),
            "original_target_date": raw.get("original_target_date", "2024-03-31"),
            "latest_target_date": raw.get("latest_target_date", "2025-09-30"),
            "state": state,
            "district": district,
            "tehsil_anchal": raw.get("tehsil_anchal", "Sadar"),
            "village_mouza": raw.get("village_mouza", "Central Cluster"),
            "lat": round(float(lat), 4),
            "lng": round(float(lng), 4),
            "location_map_url": map_url,
            "land_area_acres": land_acres,
            "land_area_hectares": land_ha,
            "forest_land_ha": float(raw.get("forest_land_ha") or 0.0),
            "forest_land_share_pct": float(raw.get("forest_land_share_pct") or 0.0),
            "affected_land_feature": raw.get("affected_land_feature", "Agricultural Land"),
            "waterbody_impact": raw.get("waterbody_impact", "NO"),
            "affected_families": int(raw.get("affected_families") or 350),
            "affected_habitations": int(raw.get("affected_habitations") or 5),
            "compensation_disbursed_pct": float(raw.get("compensation_disbursed_pct") or 75.0),
            "possession_pct": float(raw.get("possession_pct") or 68.0),
            "rehabilitation_progress_pct": float(raw.get("rehabilitation_progress_pct") or 70.0),
            "encumbrance_free_land": raw.get("encumbrance_free_land", "YES" if float(raw.get("possession_pct", 75.0)) > 80 else "NO"),
            "sia_status": raw.get("sia_status", "COMPLETED"),
            "environmental_clearance": raw.get("environmental_clearance", "APPROVED"),
            "forest_clearance_stage1": raw.get("forest_clearance_stage1", "NA"),
            "forest_clearance_stage2": raw.get("forest_clearance_stage2", "NA"),
            "approval_pending_days": float(raw.get("approval_pending_days") or 90.0),
            "land_dispute": raw.get("land_dispute", "NO"),
            "local_resistance": raw.get("local_resistance", "NO"),
            "law_order_issue": raw.get("law_order_issue", "NO"),
            "litigation": raw.get("litigation", "NO"),
            "litigation_type": raw.get("litigation_type", "NA"),
            "court_level": raw.get("court_level", "NA"),
            "legal_disputes_count": int(raw.get("legal_disputes_count") or 0),
            "original_cost_cr": orig_cost,
            "revised_cost_cr": rev_cost,
            "cost_overrun_cr": cost_overrun,
            "cost_overrun_pct": cost_overrun_pct,
            "expenditure_cr": round(rev_cost * 0.65, 2),
            "delay_days": delay_days,
            "schedule_slippage_days": delay_days,
            "risk_score": risk_score,
            "risk_category": risk_cat,
            "political_social_sensitivity": raw.get("political_social_sensitivity", "MEDIUM"),
            "stakeholder_coordination_risk": raw.get("stakeholder_coordination_risk", "LOW"),
            "root_cause": raw.get("root_cause", "Land acquisition procedural timeline adjustment"),
            "source_name": raw.get("raw_source", "Government API Portal"),
            "source_portal_url": raw.get("source_portal_url", "https://bhoomirashi.gov.in/"),
            "direct_entry_url": raw.get("direct_entry_url", "https://bhoomirashi.gov.in/"),
            "gazette_notification_link": raw.get("gazette_notification_link", "https://egazette.gov.in/"),
            "api_endpoint": raw.get("api_endpoint", "https://api.data.gov.in/"),
            "http_status": raw.get("http_status", 200)
        }

    def normalize_batch(self, raw_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        normalized = []
        for i, rec in enumerate(raw_list):
            try:
                n_rec = self.normalize_record(rec, i)
                normalized.append(n_rec)
            except Exception as e:
                logger.error(f"Failed to normalize raw record index {i}: {e}")
        return normalized
