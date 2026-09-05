# Government Land Acquisition Data Pipeline & Database Engine

A standalone, modular Data Extraction, Transformation, and Loading (ETL) pipeline designed to query, normalize, and store land acquisition and infrastructure project data from public Indian government sources and APIs into a normalized relational database schema.

> 📍 **Note:** This pipeline is located completely outside the main `land-acquisition-predictor` project directory to ensure zero side-effects or breaking changes to the core application code.

---

## 🏗️ Architecture & Component Overview

```
external_land_dataset/gov_api_pipeline/
├── config.py                 # Endpoint configuration, timeouts, API keys & User-Agents
├── db/
│   ├── schema.sql            # Normalized relational database schema (8 tables)
│   └── db_manager.py         # Connection manager, schema migrations, UPSERT logic & stats
├── fetchers/
│   ├── base_fetcher.py       # Resilient HTTP GET client with retry & exponential backoff
│   ├── data_gov_fetcher.py   # Data.gov.in (OGD Platform India) API fetcher
│   ├── bhoomirashi_fetcher.py# MoRTH Bhoomi Rashi Land Acquisition Gazette Notice fetcher
│   ├── mospi_fetcher.py      # MoSPI OCMS mega infrastructure project monitor fetcher
│   ├── land_conflict_fetcher.py# Land Conflict Watch public registry fetcher
│   └── unified_fetcher.py    # Multi-source fetch orchestrator
├── transformers/
│   └── normalizer.py         # Field standardizer, GPS geocoder & risk classifier
├── data/                     # Output directory for SQLite DB, CSV & JSON exports
│   ├── gov_land_projects.db  # Relational SQLite database
│   ├── fetched_gov_projects.csv
│   └── fetched_gov_projects.json
├── pipeline.py               # Core ETL runner module
├── run_pipeline.py           # CLI entry point script
└── README.md                 # Pipeline documentation
```

---

## 📊 Database Schema Design

The pipeline builds an **8-table relational database** (`data/gov_land_projects.db`):

1. **`projects`**: Core metadata (`project_id`, `official_project_id`, `title`, `sector`, `implementing_agency`, `approval_date`, etc.).
2. **`locations`**: State, district, tehsil, village, coordinates (`lat`, `lng`), and Google Maps deep-links.
3. **`land_details`**: Acres/Hectares required, forest land %, compensation disbursed %, possession %, encumbrance-free status.
4. **`clearances`**: Social Impact Assessment (SIA), environmental clearances, Stage-I & II Forest clearances.
5. **`litigations`**: Active land disputes, local resistance flags, court levels, legal case counts.
6. **`financials`**: Original cost, revised cost, cost overrun (INR Cr), expenditure.
7. **`risk_metrics`**: Model-ready schedule delay days, risk scores (0-100), risk levels (Low/Medium/High/Critical), root causes.
8. **`source_audit_logs`**: Complete audit trail logging public portal URLs, gazette notice references, API endpoints, HTTP status, and fetch timestamps.

---

## 🚀 How to Run the Pipeline

### 1. Execute Full ETL Pipeline
Run the CLI script from terminal:
```bash
python external_land_dataset/gov_api_pipeline/run_pipeline.py --run
```

### 2. View Database Statistics & Row Counts
```bash
python external_land_dataset/gov_api_pipeline/run_pipeline.py --stats
```

### 3. Export Database to Custom CSV or JSON
```bash
python external_land_dataset/gov_api_pipeline/run_pipeline.py --export-csv external_land_dataset/gov_api_pipeline/data/custom_export.csv
```

---

## 🔌 Government API Key Configuration (Optional)
To use live production keys for `data.gov.in` or custom endpoints, set the environment variable:
```bash
# Windows PowerShell
$env:DATA_GOV_IN_API_KEY="your_api_key_here"

# Linux / Mac
export DATA_GOV_IN_API_KEY="your_api_key_here"
```
If no key is supplied, the pipeline gracefully uses standard public sandbox endpoints and official government benchmark records.
