import os
import random
from datetime import timedelta
import numpy as np
import pandas as pd
from faker import Faker

# Set random seed for reproducibility
np.random.seed(42)
random.seed(42)
Faker.seed(42)

fake = Faker("en_IN")

# Number of samples
N_SAMPLES = 800

# 10 Major Indian States & 3 realistic districts per state
STATE_DISTRICTS = {
    "Maharashtra": ["Pune", "Thane", "Nagpur"],
    "Uttar Pradesh": ["Lucknow", "Varanasi", "Agra"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara"],
    "Karnataka": ["Bengaluru Urban", "Mysuru", "Belagavi"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur"],
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur"],
    "Odisha": ["Khordha", "Cuttack", "Sambalpur"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior"],
    "West Bengal": ["Kolkata", "Howrah", "North 24 Parganas"],
}

PROJECT_TYPES = [
    "Highway",
    "Railway",
    "Irrigation",
    "Industrial Corridor",
    "Power Transmission",
    "Urban Infrastructure",
]

# Generate base attributes
project_ids = [f"P{i+1:03d}" for i in range(N_SAMPLES)]

states = np.random.choice(list(STATE_DISTRICTS.keys()), size=N_SAMPLES)
districts = [np.random.choice(STATE_DISTRICTS[st]) for st in states]
project_types = np.random.choice(PROJECT_TYPES, size=N_SAMPLES)

# Project names templates by type
name_templates = {
    "Highway": [
        "NH-44 Widening",
        "Golden Quadrilateral Expansion",
        "State Highway 12 Upgrade",
        "Expressway Bypass Corridor",
        "Outer Ring Road Extension",
    ],
    "Railway": [
        "Dedicated Freight Corridor",
        "High-Speed Rail Link",
        "Doubling & Electrification Line",
        "Metro Rail Phase 2",
        "Suburban Rail Expansion",
    ],
    "Irrigation": [
        "Canal Network Expansion",
        "Lift Irrigation Project",
        "Reservoir Dam Construction",
        "Feeder Canal Modernization",
        "River Interlinking Link",
    ],
    "Industrial Corridor": [
        "DMIC Industrial Node",
        "SEZ Land Acquisition Zone",
        "Textile Park Development",
        "Tech Park Phase C",
        "Logistics Hub Cluster",
    ],
    "Power Transmission": [
        "765kV Substation Land",
        "Green Energy Transmission Corridor",
        "Grid Augmentation Line",
        "Solar Park Land Acquisition",
        "Thermal Power Substation Link",
    ],
    "Urban Infrastructure": [
        "Smart City Outer Ring Road",
        "Flyover & Arterial Road Network",
        "Water Treatment Plant Site",
        "Urban Bypass Expressway",
        "Bus Rapid Transit Corridor",
    ],
}

project_names = []
for p_type, dist in zip(project_types, districts):
    prefix = random.choice(name_templates[p_type])
    phase = random.choice(["Phase 1", "Phase 2", "Phase 3", "Section A", "Package IV"])
    project_names.append(f"{prefix} ({dist} {phase})")

# Feature generation:
# 1. land_area_hectares (5 to 500, right-skewed)
land_area = np.random.lognormal(mean=3.6, sigma=0.75, size=N_SAMPLES)
land_area = np.clip(land_area, 5.0, 500.0).round(2)

# 2. affected_families (10 to 3000, correlated with area & project type density)
type_density = {
    "Urban Infrastructure": 7.5,
    "Highway": 4.5,
    "Industrial Corridor": 5.0,
    "Railway": 3.5,
    "Irrigation": 3.0,
    "Power Transmission": 1.5,
}
density_factors = np.array([type_density[pt] for pt in project_types])
affected_families = (
    land_area * density_factors * np.random.uniform(0.6, 1.4, size=N_SAMPLES)
    + np.random.uniform(10, 80, size=N_SAMPLES)
).astype(int)
affected_families = np.clip(affected_families, 10, 3000)

# 3. compensation_disbursed_pct (0 to 100%)
compensation_disbursed_pct = np.random.beta(a=2.5, b=2.0, size=N_SAMPLES) * 100
compensation_disbursed_pct = np.clip(compensation_disbursed_pct, 0.0, 100.0).round(2)

# 4. approval_pending_days (0 to 900)
approval_pending_days = np.random.exponential(scale=180, size=N_SAMPLES)
approval_pending_days = np.clip(approval_pending_days, 0.0, 900.0).round(1)

# 5. legal_disputes_count (0 to 15, mostly 0-2 with outliers)
legal_disputes_count = np.random.poisson(lam=1.2, size=N_SAMPLES)
outlier_indices = np.random.choice(N_SAMPLES, size=int(N_SAMPLES * 0.06), replace=False)
legal_disputes_count[outlier_indices] += np.random.randint(4, 12, size=len(outlier_indices))
legal_disputes_count = np.clip(legal_disputes_count, 0, 15)

# 6. possession_pct (0 to 100%)
possession_pct = (
    compensation_disbursed_pct * 0.75 + np.random.uniform(0, 25, size=N_SAMPLES)
).round(2)
possession_pct = np.clip(possession_pct, 0.0, 100.0)

# 7. rehabilitation_progress_pct (0 to 100%)
rehabilitation_progress_pct = (
    compensation_disbursed_pct * 0.65 + np.random.uniform(0, 35, size=N_SAMPLES)
).round(2)
rehabilitation_progress_pct = np.clip(rehabilitation_progress_pct, 0.0, 100.0)

# 8. stakeholder_responsiveness_score (1 to 10)
stakeholder_responsiveness_score = np.random.uniform(1.0, 10.0, size=N_SAMPLES).round(1)

# 9. historical_dept_performance_score (1 to 10)
dept_base_scores = {
    "Highway": 6.8,
    "Railway": 6.2,
    "Irrigation": 4.8,
    "Industrial Corridor": 7.2,
    "Power Transmission": 7.8,
    "Urban Infrastructure": 5.2,
}
dept_scores = np.array([dept_base_scores[pt] for pt in project_types]) + np.random.normal(
    0, 1.2, size=N_SAMPLES
)
historical_dept_performance_score = np.clip(dept_scores, 1.0, 10.0).round(1)

# 10. Dates
start_dates = [fake.date_between(start_date="-4y", end_date="-1y") for _ in range(N_SAMPLES)]
expected_completion_dates = [
    sd + timedelta(days=random.randint(365, 1460)) for sd in start_dates
]

# TARGET WEIGHTED FORMULA FOR REALISTIC LEARNABLE PATTERNS
# delay_days = f(low comp%, high disputes, high pending_days, low responsiveness, low rehab%, low dept_perf) + noise
raw_delay = (
    (100.0 - compensation_disbursed_pct) * 1.6
    + legal_disputes_count * 18.0
    + approval_pending_days * 0.26
    + (10.0 - stakeholder_responsiveness_score) * 14.0
    + (100.0 - rehabilitation_progress_pct) * 0.85
    + (10.0 - historical_dept_performance_score) * 9.0
    + np.log1p(affected_families) * 5.0
    + np.random.normal(0, 28.0, size=N_SAMPLES)
)

# Normalize baseline offset so minimum delay starts ~0 days
min_baseline = np.percentile(raw_delay, 2)
raw_delay_adj = raw_delay - min_baseline
delay_days = np.clip(raw_delay_adj, 0, 650).round(0).astype(int)

# Continuous risk score (0-100) correlated with delay_days
risk_score = np.clip((delay_days / 6.2) + np.random.normal(0, 1.5, size=N_SAMPLES), 0.0, 100.0).round(1)

# Categorical risk category target: ~40% Low, ~35% Medium, ~25% High
q40 = np.percentile(delay_days, 40)
q75 = np.percentile(delay_days, 75)

def classify_risk(d):
    if d <= q40:
        return "Low"
    elif d <= q75:
        return "Medium"
    else:
        return "High"

risk_category = [classify_risk(d) for d in delay_days]

# Construct DataFrame
df = pd.DataFrame(
    {
        "project_id": project_ids,
        "project_name": project_names,
        "state": states,
        "district": districts,
        "project_type": project_types,
        "land_area_hectares": land_area,
        "affected_families": affected_families,
        "compensation_disbursed_pct": compensation_disbursed_pct,
        "approval_pending_days": approval_pending_days,
        "legal_disputes_count": legal_disputes_count,
        "possession_pct": possession_pct,
        "rehabilitation_progress_pct": rehabilitation_progress_pct,
        "stakeholder_responsiveness_score": stakeholder_responsiveness_score,
        "historical_dept_performance_score": historical_dept_performance_score,
        "start_date": [d.strftime("%Y-%m-%d") for d in start_dates],
        "expected_completion_date": [
            d.strftime("%Y-%m-%d") for d in expected_completion_dates
        ],
        "delay_days": delay_days,
        "risk_score": risk_score,
        "risk_category": risk_category,
    }
)

# Save output CSV
output_path = os.path.join(os.path.dirname(__file__), "projects.csv")
df.to_csv(output_path, index=False)

# Print Summary
print("=" * 60)
print("DATASET GENERATION SUMMARY")
print("=" * 60)
print(f"File saved to: {output_path}")
print(f"Dataset Shape: {df.shape}")

print("\n--- Risk Category Class Distribution ---")
cat_counts = df["risk_category"].value_counts()
cat_pcts = df["risk_category"].value_counts(normalize=True) * 100
for cat in ["Low", "Medium", "High"]:
    count = cat_counts.get(cat, 0)
    pct = cat_pcts.get(cat, 0.0)
    print(f"  {cat:<8}: {count} ({pct:.2f}%)")

print("\n--- Feature Correlations with delay_days ---")
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
    "risk_score",
]
correlations = df[numeric_cols].apply(lambda col: col.corr(df["delay_days"]))
for col, corr_val in correlations.items():
    print(f"  {col:<35}: {corr_val:+.4f}")

print("=" * 60)
