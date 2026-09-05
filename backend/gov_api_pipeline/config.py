import os
from pathlib import Path

# Base Directory Paths
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
LOG_DIR = BASE_DIR / "logs"

# Ensure runtime directories exist
DATA_DIR.mkdir(parents=True, exist_ok=True)
LOG_DIR.mkdir(parents=True, exist_ok=True)

# Database Configuration
DB_PATH = DATA_DIR / "gov_land_projects.db"
DB_URL = f"sqlite:///{DB_PATH}"

# Government API Configuration & Endpoints
# Note: Set DATA_GOV_IN_API_KEY environment variable for production data.gov.in access
DATA_GOV_IN_API_KEY = os.getenv("DATA_GOV_IN_API_KEY", "579b464db66ec23bdd000001cdd394fe3d13437177065d6bd2ee3fb9")

API_ENDPOINTS = {
    "data_gov_highways": "https://api.data.gov.in/resource/6176ee09-3d56-4a3b-816d-57d47850061e",
    "data_gov_railways": "https://api.data.gov.in/resource/8877ee10-4e67-5b4c-927e-68e58961172f",
    "bhoomirashi_notifications": "https://bhoomirashi.gov.in/api/v1/notifications",
    "mospi_ocms_projects": "https://www.cspm.gov.in/api/projects/infrastructure",
    "land_conflict_watch": "https://www.landconflictwatch.org/api/v1/conflicts",
    "egazette_notices": "https://egazette.gov.in/api/search/land-acquisition"
}

# HTTP Client Configuration
DEFAULT_TIMEOUT_SEC = 15
MAX_RETRIES = 3
BACKOFF_FACTOR = 1.5

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
    "GovDataPipelineExtractor/1.0 (+https://github.com/infrastructure-monitoring)"
]

# Unified Single Export Output Path
MAIN_APP_DATA_DIR = BASE_DIR.parent / "app" / "data"
DEFAULT_CSV_EXPORT = MAIN_APP_DATA_DIR / "projects.csv"
DEFAULT_JSON_EXPORT = MAIN_APP_DATA_DIR / "projects.json"
