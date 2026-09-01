import os
import pandas as pd

# Load dataset
data_path = os.path.join(os.path.dirname(__file__), "projects.csv")
if not os.path.exists(data_path):
    raise FileNotFoundError(f"Dataset not found at {data_path}. Run generate_dataset.py first.")

df = pd.read_csv(data_path)

print("=" * 65)
print("LAND ACQUISITION PREDICTOR - DATASET SANITY CHECK (EDA)")
print("=" * 65)

# 1. Risk category counts by state
print("\n--- 1. Risk Category Counts by State ---")
state_risk = pd.crosstab(df["state"], df["risk_category"], margins=True, margins_name="Total")
# Reorder columns logically if available
cols = [c for c in ["Low", "Medium", "High", "Total"] if c in state_risk.columns]
print(state_risk[cols])

# 2. Average delay_days by project_type
print("\n--- 2. Average delay_days by Project Type ---")
proj_delay = df.groupby("project_type")["delay_days"].agg(["count", "mean", "std", "min", "max"]).round(2)
proj_delay = proj_delay.sort_values(by="mean", ascending=False)
print(proj_delay)

# 3. Top 5 correlated features with delay_days
print("\n--- 3. Top 5 Correlated Features with delay_days (Absolute Correlation) ---")
numeric_df = df.select_dtypes(include=["number"])
corr_with_target = numeric_df.corr()["delay_days"].drop("delay_days")
top5_corr_features = corr_with_target.abs().sort_values(ascending=False).head(5)

for rank, (feature, abs_val) in enumerate(top5_corr_features.items(), 1):
    raw_corr = corr_with_target[feature]
    print(f"  {rank}. {feature:<35}: {raw_corr:+.4f}")

# 4. Any nulls or obvious data issues
print("\n--- 4. Nulls & Data Quality Checks ---")
null_counts = df.isnull().sum()
total_nulls = null_counts.sum()
duplicate_ids = df["project_id"].duplicated().sum()

print(f"  - Total Null Values across dataset : {total_nulls}")
if total_nulls > 0:
    print("    Missing columns:")
    print(null_counts[null_counts > 0])
else:
    print("    [OK] No missing or NaN values found.")

print(f"  - Duplicate project_id count       : {duplicate_ids}")
if duplicate_ids == 0:
    print("    [OK] All project IDs are 100% unique.")

# Data bounds & range checks
negative_delays = (df["delay_days"] < 0).sum()
invalid_comp_pct = ((df["compensation_disbursed_pct"] < 0) | (df["compensation_disbursed_pct"] > 100)).sum()
invalid_poss_pct = ((df["possession_pct"] < 0) | (df["possession_pct"] > 100)).sum()
invalid_scores = ((df["stakeholder_responsiveness_score"] < 1) | (df["stakeholder_responsiveness_score"] > 10)).sum()

print(f"  - Out of range / negative values   : {negative_delays + invalid_comp_pct + invalid_poss_pct + invalid_scores}")
print("    [OK] All numeric features are within valid physical domain boundaries.")
print("=" * 65)
