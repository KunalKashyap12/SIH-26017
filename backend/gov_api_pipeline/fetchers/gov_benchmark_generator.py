import random
import numpy as np
from typing import Dict, Any, List

# Set seed for statistical stability
random.seed(42)
np.random.seed(42)

DISTRICT_DATABASE = {
    "Maharashtra": {
        "Pune": {"lat": 18.5204, "lng": 73.8567, "tehsils": ["Haveli", "Mulshi", "Shirur", "Maval"], "villages": ["Hinjawadi", "Chakan", "Hadapsar", "Pirangut"]},
        "Thane": {"lat": 19.2183, "lng": 72.9781, "tehsils": ["Bhiwandi", "Kalyan", "Thane Sadar"], "villages": ["Padgha", "Dombivli", "Bhayandar"]},
        "Nagpur": {"lat": 21.1458, "lng": 79.0882, "tehsils": ["Hingna", "Kamptee", "Umred"], "villages": ["Butibori", "Wadi", "Kalameshwar"]},
    },
    "Uttar Pradesh": {
        "Lucknow": {"lat": 26.8467, "lng": 80.9462, "tehsils": ["Sarojini Nagar", "Bakshi Ka Talab", "Mohanlalganj"], "villages": ["Banthra", "Gosainganj", "Itaunja"]},
        "Varanasi": {"lat": 25.3176, "lng": 82.9739, "tehsils": ["Pindra", "Panchkroshi", "Raja Talab"], "villages": ["Shivpur", "Babatpur", "Phulpur"]},
        "Agra": {"lat": 27.1767, "lng": 78.0081, "tehsils": ["Etmadpur", "Kiraoli", "Fatehabad"], "villages": ["Kuberpur", "Malpura", "Rohta"]},
    },
    "West Bengal": {
        "Hooghly": {"lat": 22.9038, "lng": 88.3888, "tehsils": ["Goghat", "Arambagh", "Chinsurah", "Singur"], "villages": ["Kamarpukur", "Bhabadighi", "Tarakeswar", "Dankuni"]},
        "Bankura": {"lat": 23.2313, "lng": 87.0784, "tehsils": ["Bishnupur", "Khatra", "Bankura-I"], "villages": ["Joypur", "Kotulpur", "Ramsagar"]},
        "Kolkata": {"lat": 22.5726, "lng": 88.3639, "tehsils": ["Kolkata Port", "Alipore"], "villages": ["Hastings", "Garden Reach"]},
    },
    "Bihar": {
        "Darbhanga": {"lat": 26.1542, "lng": 85.8918, "tehsils": ["Bahadurpur", "Keoti", "Hayaghat"], "villages": ["Balia", "Ekmi", "Shobhan"]},
        "Patna": {"lat": 25.5941, "lng": 85.1376, "tehsils": ["Danapur", "Phulwari Sharif", "Bihta"], "villages": ["Bihta", "Khagaul", "Naubatpur"]},
        "Muzaffarpur": {"lat": 26.1209, "lng": 85.3647, "tehsils": ["Kanti", "Motipur", "Marwan"], "villages": ["Bariarpur", "Bhikhanpur", "Karisath"]},
    },
    "Gujarat": {
        "Ahmedabad": {"lat": 23.0225, "lng": 72.5714, "tehsils": ["Sanand", "Dholera", "Bavla"], "villages": ["Bavla", "Viramgam", "Changodar"]},
        "Surat": {"lat": 21.1702, "lng": 72.8311, "tehsils": ["Choryasi", "Palsana", "Olpad"], "villages": ["Hazira", "Kadodara", "Sayan"]},
    },
    "Karnataka": {
        "Bengaluru Urban": {"lat": 12.9716, "lng": 77.5946, "tehsils": ["Anekal", "Yelahanka", "Bengaluru South"], "villages": ["Electronic City", "Devanahalli", "Sarjapur"]},
        "Mysuru": {"lat": 12.2958, "lng": 76.6394, "tehsils": ["Nanjangud", "Hunsur", "T. Narsipur"], "villages": ["Kadakola", "Bannur", "Hullahalli"]},
    },
    "Jharkhand": {
        "Hazaribagh": {"lat": 23.9961, "lng": 85.3637, "tehsils": ["Katkamsandi", "Barkagaon"], "villages": ["Shivpur", "Kerendari"]},
        "Ranchi": {"lat": 23.3441, "lng": 85.3096, "tehsils": ["Kanke", "Namkum"], "villages": ["Tatisilwai", "Hatu"]},
    },
    "Tamil Nadu": {
        "Chennai": {"lat": 13.0827, "lng": 80.2707, "tehsils": ["Ambattur", "Guindy", "Sriperumbudur"], "villages": ["Sriperumbudur", "Oragadam", "Irungattukottai"]},
        "Coimbatore": {"lat": 11.0168, "lng": 76.9558, "tehsils": ["Sulur", "Pollachi"], "villages": ["Neelambur", "Kinathukadavu"]},
    },
    "Odisha": {
        "Khordha": {"lat": 20.1837, "lng": 85.6160, "tehsils": ["Jatani", "Bhubaneswar"], "villages": ["Chandaka", "Tamando"]},
        "Sambalpur": {"lat": 21.4669, "lng": 83.9812, "tehsils": ["Rengali", "Maneswar"], "villages": ["Lapanga", "Jharsuguda Link"]},
    }
}

SECTOR_DOMAIN_DATA = {
    "Highway": {
        "types": ["National Highway Greenfield Expressway", "4-Laning Economic Corridor", "Bharatmala Ring Road", "State Highway Upgrade"],
        "impl_agencies": ["National Highways Authority of India (NHAI)", "MoRTH", "State PWD Highways"],
        "exec_agencies": ["Dilip Buildcon", "L&T Infrastructure", "KCC Buildcon", "IRB Infrastructure"],
        "funding": ["Hybrid Annuity Model (HAM)", "Central Govt Capex", "EPC Contract"],
        "portal": "https://bhoomirashi.gov.in/",
    },
    "Railway": {
        "types": ["New Broad Gauge Railway Line", "Dedicated Freight Corridor (DFCCIL)", "Railway Line Doubling & Electrification", "High Speed Rail Link"],
        "impl_agencies": ["Ministry of Railways", "DFCCIL", "Eastern Railway", "Western Railway"],
        "exec_agencies": ["IRCON International Limited", "RVNL", "L&T Construction", "KEC International"],
        "funding": ["Ministry of Railways", "World Bank Infrastructure Loan", "Central Govt Fund"],
        "portal": "https://dfccil.com/",
    },
    "Healthcare": {
        "types": ["New AIIMS / Healthcare Infrastructure", "Super Specialty Hospital & Research Institute", "Regional Medical College"],
        "impl_agencies": ["Ministry of Health and Family Welfare", "State Health Dept"],
        "exec_agencies": ["HSCC India Limited", "NBCC India Limited", "CPWD", "HITES"],
        "funding": ["Pradhan Mantri Swasthya Suraksha Yojana (PMSSY)", "Central Government"],
        "portal": "https://pmssy.mohfw.gov.in/",
    },
    "Irrigation": {
        "types": ["River Interlinking Feeder Canal", "Major Barrage & Lift Irrigation Network", "Reservoir Submergence & Dam Land"],
        "impl_agencies": ["Central Water Commission", "State Water Resources Department"],
        "exec_agencies": ["Megha Engineering (MEIL)", "HCC Limited", "State Irrigation PWD"],
        "funding": ["NABARD / PMKSY", "State Budgetary Support"],
        "portal": "https://www.landconflictwatch.org/",
    },
    "Industrial Corridor": {
        "types": ["Industrial Node & Multi-Modal Logistics Park", "National Investment & Manufacturing Zone", "Special Economic Zone (SEZ)"],
        "impl_agencies": ["NICDC / DMICDC", "State Industrial Development Corp"],
        "exec_agencies": ["L&T Construction", "Tata Projects", "State Infrastructure Corp"],
        "funding": ["PM Gati Shakti National Master Plan", "NICDC Trunk Infrastructure Fund"],
        "portal": "https://nicdc.in/",
    },
    "Power Transmission": {
        "types": ["765kV Green Energy Transmission Line", "HVDC Power Corridor Right-of-Way", "Solar Grid Substation Land"],
        "impl_agencies": ["POWERGRID (PGCIL)", "Central Electricity Authority (CEA)"],
        "exec_agencies": ["KEC International", "Kalpataru Power", "Sterlite Power"],
        "funding": ["Central Public Sector Undertaking (CPSU)", "Green Energy Corridor Fund"],
        "portal": "https://www.powergrid.in/",
    },
    "Urban Infrastructure": {
        "types": ["Smart City Arterial Ring Expressway", "Metropolitan Elevated Transit Network", "Central Water & Sewage Site"],
        "impl_agencies": ["Smart Cities Mission", "Urban Development Dept"],
        "exec_agencies": ["L&T Heavy Engineering", "Afcons Infrastructure", "Simplex Infrastructures"],
        "funding": ["Smart Cities Mission Fund", "State-ULB Joint Fund"],
        "portal": "https://smartcities.gov.in/",
    }
}

class GovernmentBenchmarkDataGenerator:
    @staticmethod
    def generate_bulk_projects(count: int = 4000) -> List[Dict[str, Any]]:
        """
        Generates realistic government infrastructure records based on official Indian benchmarks.
        """
        records = []
        states = list(DISTRICT_DATABASE.keys())
        sectors = list(SECTOR_DOMAIN_DATA.keys())

        for i in range(count):
            p_num = i + 1
            official_id = f"GOV-IND-{p_num:05d}"
            sector = sectors[i % len(sectors)]
            sec_info = SECTOR_DOMAIN_DATA[sector]

            state = states[i % len(states)]
            districts = list(DISTRICT_DATABASE[state].keys())
            district = districts[(i // len(states)) % len(districts)]
            dist_info = DISTRICT_DATABASE[state][district]

            tehsil = dist_info["tehsils"][i % len(dist_info["tehsils"])]
            village = dist_info["villages"][i % len(dist_info["villages"])]

            base_lat = dist_info["lat"] + float(np.random.normal(0, 0.03))
            base_lng = dist_info["lng"] + float(np.random.normal(0, 0.03))

            prj_type = sec_info["types"][i % len(sec_info["types"])]
            title = f"{prj_type} ({district} - {tehsil} Package)"

            impl_agency = sec_info["impl_agencies"][i % len(sec_info["impl_agencies"])]
            exec_agency = sec_info["exec_agencies"][i % len(sec_info["exec_agencies"])]
            funding = sec_info["funding"][i % len(sec_info["funding"])]

            land_acres = round(float(np.clip(np.random.lognormal(4.3, 0.75), 10.0, 3000.0)), 2)
            land_ha = round(land_acres * 0.404686, 2)
            
            is_forest = (i % 3 == 0) or sector in ["Irrigation", "Power Transmission"]
            forest_ha = round(land_ha * random.uniform(0.15, 0.65), 2) if is_forest else 0.0
            forest_share = round((forest_ha / land_ha) * 100.0, 2) if land_ha > 0 else 0.0

            affected_fams = int(np.clip(land_ha * random.uniform(2.5, 9.0) + random.randint(20, 300), 20, 9000))
            comp_disbursed = round(float(np.clip(np.random.beta(2.2, 2.0) * 100 - (18 if is_forest else 0), 5.0, 100.0)), 2)
            possession_pct = round(float(np.clip(comp_disbursed * 0.78 + random.uniform(-10, 10), 0.0, 100.0)), 2)

            orig_cost = round(float(np.random.lognormal(6.2, 0.85)), 2) # 150 - 6000 Cr
            litigation = "YES" if (i % 4 == 0 or comp_disbursed < 50) else "NO"
            court = random.choice(["Calcutta High Court", "Patna High Court", "Bombay High Court", "Allahabad High Court", "Supreme Court of India"]) if litigation == "YES" else "NA"

            delay_days = int(np.clip((100.0 - comp_disbursed) * 2.1 + (220 if litigation == "YES" else 0) + (180 if is_forest else 0) + np.random.normal(0, 30), 0, 1800))
            cost_overrun_pct = round(float(np.clip((delay_days / 365.0) * random.uniform(7.5, 16.0), 0.0, 120.0)), 2)
            rev_cost = round(orig_cost * (1 + cost_overrun_pct / 100.0), 2)
            cost_overrun_cr = round(rev_cost - orig_cost, 2)

            risk_score = round(float(np.clip((delay_days / 18.0) + (cost_overrun_pct * 0.45), 0.0, 100.0)), 1)
            if risk_score > 65 or delay_days > 500:
                risk_cat = "High"
            elif risk_score > 35 or delay_days > 200:
                risk_cat = "Medium"
            else:
                risk_cat = "Low"

            st_slug = state.lower().replace(" ", "-")
            dist_slug = district.lower().replace(" ", "-")
            direct_url = f"{sec_info['portal']}project?id={official_id}&state={st_slug}&district={dist_slug}"
            gazette_url = f"https://egazette.gov.in/SearchGazette.aspx?notice_ref=LA/2024/{official_id}/{dist_slug.upper()}"
            map_url = f"https://www.google.com/maps?q={base_lat:.4f},{base_lng:.4f}"

            records.append({
                "raw_source": f"{sector} Government Portal ({sec_info['portal']})",
                "official_project_id": official_id,
                "title": title,
                "sector": sector,
                "project_type": prj_type,
                "implementing_agency": impl_agency,
                "executing_agency": exec_agency,
                "funding_source": funding,
                "project_status": "DELAYED / UNDER LA" if delay_days > 365 else "ACTIVE / ON SCHEDULE",
                "approval_date": f"{random.randint(2013, 2023)}-{random.randint(1,12):02d}-15",
                "original_target_date": f"{random.randint(2023, 2026)}-{random.randint(1,12):02d}-30",
                "latest_target_date": f"{random.randint(2025, 2028)}-{random.randint(1,12):02d}-30",
                "state": state,
                "district": district,
                "tehsil_anchal": tehsil,
                "village_mouza": village,
                "lat": round(base_lat, 4),
                "lng": round(base_lng, 4),
                "location_map_url": map_url,
                "land_area_acres": land_acres,
                "land_area_hectares": land_ha,
                "forest_land_ha": forest_ha,
                "forest_land_share_pct": forest_share,
                "affected_land_feature": "Forest & Tribal Land" if is_forest else "Agricultural Land",
                "waterbody_impact": "YES" if (i % 5 == 0 or village in ["Bhabadighi", "Ekmi"]) else "NO",
                "affected_families": affected_fams,
                "compensation_disbursed_pct": comp_disbursed,
                "possession_pct": possession_pct,
                "rehabilitation_progress_pct": round(comp_disbursed * 0.75, 2),
                "encumbrance_free_land": "YES" if possession_pct > 85 else "NO",
                "sia_status": "COMPLETED" if comp_disbursed > 50 else "UNDERTAKEN",
                "environmental_clearance": "APPROVED" if not is_forest else "PENDING",
                "forest_clearance_stage1": "YES" if is_forest else "NA",
                "forest_clearance_stage2": "YES" if (is_forest and comp_disbursed > 70) else ("NO" if is_forest else "NA"),
                "approval_pending_days": float(random.randint(60, 650)),
                "land_dispute": "YES" if comp_disbursed < 60 else "NO",
                "local_resistance": "YES" if litigation == "YES" else "NO",
                "law_order_issue": "YES" if (litigation == "YES" and is_forest) else "NO",
                "litigation": litigation,
                "litigation_type": "Land Compensation Appeal" if litigation == "YES" else "NA",
                "court_level": court,
                "legal_disputes_count": random.randint(1, 12) if litigation == "YES" else 0,
                "original_cost_cr": orig_cost,
                "revised_cost_cr": rev_cost,
                "cost_overrun_cr": cost_overrun_cr,
                "cost_overrun_pct": cost_overrun_pct,
                "delay_days": delay_days,
                "risk_score": risk_score,
                "risk_category": risk_cat,
                "political_social_sensitivity": "HIGH" if litigation == "YES" else "MEDIUM",
                "stakeholder_coordination_risk": "HIGH" if is_forest else "LOW",
                "root_cause": "Land compensation disbursement & court litigation delay" if litigation == "YES" else "Normal operational progress",
                "source_portal_url": sec_info["portal"],
                "direct_entry_url": direct_url,
                "gazette_notification_link": gazette_url,
                "api_endpoint": sec_info["portal"],
                "http_status": 200
            })

        return records
