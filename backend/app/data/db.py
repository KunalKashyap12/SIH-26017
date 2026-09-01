import os
import pandas as pd
from app.data.district_coords import get_district_coords

_PROJECTS_CACHE = None


def get_projects_df() -> pd.DataFrame:
    """Loads and caches projects.csv DataFrame with district coordinates."""
    global _PROJECTS_CACHE
    if _PROJECTS_CACHE is not None:
        return _PROJECTS_CACHE

    csv_path = os.path.join(os.path.dirname(__file__), "projects.csv")
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"projects.csv not found at {csv_path}")

    df = pd.read_csv(csv_path)

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
