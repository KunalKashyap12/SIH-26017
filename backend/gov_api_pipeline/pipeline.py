import json
import csv
import logging
from typing import Dict, Any, List
from pathlib import Path

from config import DB_PATH, DEFAULT_CSV_EXPORT, DEFAULT_JSON_EXPORT, LOG_DIR
from db.db_manager import DatabaseManager
from fetchers.unified_fetcher import UnifiedGovernmentDataFetcher
from transformers.normalizer import DataNormalizer

# Configure logging
log_file = LOG_DIR / "pipeline.log"
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.FileHandler(log_file, encoding="utf-8"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger("GovPipeline.Main")

class GovernmentDataPipeline:
    def __init__(self, db_path: Path = DB_PATH):
        self.db_manager = DatabaseManager(db_path=db_path)
        self.fetcher = UnifiedGovernmentDataFetcher()
        self.normalizer = DataNormalizer()

    def run_pipeline(self, target_count: int = 4489, export_formats: bool = True) -> Dict[str, Any]:
        """
        Executes complete Extract-Transform-Load (ETL) pipeline for target_count records.
        """
        logger.info(f"Initializing Government Land Acquisition Data Pipeline for {target_count} records...")

        # 1. EXTRACT
        raw_records = self.fetcher.fetch_all_sources(target_count=target_count)
        logger.info(f"[STAGE 1 - EXTRACT] Aggregated {len(raw_records)} records across API endpoints & benchmark generators.")

        # 2. TRANSFORM
        clean_records = self.normalizer.normalize_batch(raw_records)
        logger.info(f"[STAGE 2 - TRANSFORM] Successfully normalized {len(clean_records)} records into relational schema.")

        # 3. LOAD
        logger.info("[STAGE 3 - LOAD] Writing records into relational database in high-speed transaction batch...")
        self.db_manager.upsert_batch_records(clean_records)

        stats = self.db_manager.fetch_database_statistics()
        logger.info(f"[STAGE 3 - LOAD COMPLETE] Database Total: {stats['total_projects']} stored projects.")

        # 4. EXPORT (CSV / JSON dumps)
        if export_formats:
            self.export_to_csv(DEFAULT_CSV_EXPORT)
            self.export_to_json(DEFAULT_JSON_EXPORT)

        return stats

    def export_to_csv(self, csv_path: Path = DEFAULT_CSV_EXPORT):
        """Exports full relational join of database records into unified projects.csv."""
        records = self.db_manager.fetch_all_unified_records()
        if not records:
            logger.warning("No records found to export to CSV.")
            return

        csv_path.parent.mkdir(parents=True, exist_ok=True)
        keys = records[0].keys()
        with open(csv_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=keys)
            writer.writeheader()
            writer.writerows(records)

        logger.info(f"Exported {len(records)} records to CSV: {csv_path}")

    def export_to_json(self, json_path: Path = DEFAULT_JSON_EXPORT):
        """Exports full database records to formatted JSON."""
        records = self.db_manager.fetch_all_unified_records()
        json_path.parent.mkdir(parents=True, exist_ok=True)
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(records, f, indent=2)

        logger.info(f"Exported {len(records)} records to JSON: {json_path}")
