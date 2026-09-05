import time
import datetime
import argparse
import logging
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from pipeline import GovernmentDataPipeline
from config import LOG_DIR

# Scheduler logging
schedule_log = LOG_DIR / "scheduler.log"
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.FileHandler(schedule_log, encoding="utf-8"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger("GovPipeline.Scheduler")

def start_continuous_scheduler(interval_hours: float = 6.0, target_count: int = 4500):
    """
    Runs continuous background loop fetching new government project updates at fixed intervals.
    """
    logger.info("=================================================================")
    logger.info(f"STARTING AUTOMATED CONTINUOUS GOVERNMENT DATA SCHEDULER")
    logger.info(f"Polling Interval : Every {interval_hours} hours")
    logger.info(f"Target Count     : {target_count} records per cycle")
    logger.info("=================================================================")

    pipeline = GovernmentDataPipeline()
    cycle = 1

    while True:
        now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        logger.info(f"\n[CYCLE #{cycle}] Starting automated ETL sync at {now_str}...")

        try:
            stats = pipeline.run_pipeline(target_count=target_count, export_formats=True)
            logger.info(f"[CYCLE #{cycle} SUCCESS] Total DB Projects: {stats['total_projects']} stored.")
        except Exception as e:
            logger.error(f"[CYCLE #{cycle} ERROR] ETL Pipeline encountered issue: {e}")

        next_run = datetime.datetime.now() + datetime.timedelta(hours=interval_hours)
        logger.info(f"[CYCLE #{cycle} COMPLETE] Next automated fetch scheduled at: {next_run.strftime('%Y-%m-%d %H:%M:%S')}")
        logger.info(f"Sleeping for {interval_hours} hours... (Press Ctrl+C to stop)")

        cycle += 1
        time.sleep(interval_hours * 3600)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Automated Government Land Pipeline Scheduler")
    parser.add_argument("--interval", type=float, default=6.0, help="Interval in hours between automated fetch cycles (Default: 6.0 hours)")
    parser.add_argument("--count", type=int, default=4500, help="Target record count per sync cycle (Default: 4500)")
    
    args = parser.parse_args()
    start_continuous_scheduler(interval_hours=args.interval, target_count=args.count)
