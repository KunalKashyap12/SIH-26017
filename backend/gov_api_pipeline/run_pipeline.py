import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from pipeline import GovernmentDataPipeline
from db.db_manager import DatabaseManager
from config import DB_PATH, DEFAULT_CSV_EXPORT, DEFAULT_JSON_EXPORT

def main():
    parser = argparse.ArgumentParser(
        description="Government Land Acquisition & Infrastructure Data Fetching Pipeline"
    )
    parser.add_argument("--run", action="store_true", help="Execute full ETL pipeline (Fetch APIs -> Transform -> Store DB)")
    parser.add_argument("--count", type=int, default=4489, help="Target number of project records to extract (Default: 4489)")
    parser.add_argument("--stats", action="store_true", help="Show database row counts and analytics")
    parser.add_argument("--export-csv", type=str, help="Export database to custom CSV file path")
    parser.add_argument("--export-json", type=str, help="Export database to custom JSON file path")
    
    args = parser.parse_args()

    pipeline = GovernmentDataPipeline()

    if args.run or len(sys.argv) == 1:
        print("\n========================================================")
        print(f" RUNNING GOVERNMENT LAND DATA PIPELINE FOR {args.count} RECORDS")
        print("========================================================\n")
        stats = pipeline.run_pipeline(target_count=args.count, export_formats=True)
        print("\n========================================================")
        print(" PIPELINE EXECUTION COMPLETED")
        print("========================================================")
        print(f" Database Path  : {DB_PATH}")
        print(f" Total Projects : {stats['total_projects']}")
        print(f" CSV Export     : {DEFAULT_CSV_EXPORT}")
        print(f" JSON Export    : {DEFAULT_JSON_EXPORT}")
        print(" Sector Summary :", stats["sector_breakdown"])
        print(" Risk Summary   :", stats["risk_breakdown"])
        print("========================================================\n")

    elif args.stats:
        db_mgr = DatabaseManager()
        stats = db_mgr.fetch_database_statistics()
        print("\n--- DATABASE STATISTICS ---")
        print(json.dumps(stats, indent=2))

    elif args.export_csv:
        target = Path(args.export_csv)
        pipeline.export_to_csv(target)
        print(f"Exported database to {target}")

    elif args.export_json:
        target = Path(args.export_json)
        pipeline.export_to_json(target)
        print(f"Exported database to {target}")

if __name__ == "__main__":
    main()
