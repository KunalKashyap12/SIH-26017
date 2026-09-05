import time
import random
import logging
import requests
from typing import Dict, Any, List, Optional
from config import USER_AGENTS, DEFAULT_TIMEOUT_SEC, MAX_RETRIES, BACKOFF_FACTOR

logger = logging.getLogger("GovPipeline.BaseFetcher")

class BaseFetcher:
    def __init__(self, source_name: str, base_url: str):
        self.source_name = source_name
        self.base_url = base_url
        self.session = requests.Session()

    def get_headers(self) -> Dict[str, str]:
        return {
            "User-Agent": random.choice(USER_AGENTS),
            "Accept": "application/json, text/html, application/xhtml+xml, */*",
            "Accept-Language": "en-US,en;q=0.9",
        }

    def fetch_url(self, url: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Executes HTTP GET request with retries, backoff, and user-agent rotation.
        """
        headers = self.get_headers()
        attempt = 0

        while attempt < MAX_RETRIES:
            try:
                logger.info(f"[{self.source_name}] GET {url} (Attempt {attempt+1}/{MAX_RETRIES})")
                response = self.session.get(url, headers=headers, params=params, timeout=DEFAULT_TIMEOUT_SEC)
                
                if response.status_code == 200:
                    try:
                        data = response.json()
                        return {"status": 200, "data": data, "raw": response.text, "url": response.url}
                    except Exception:
                        return {"status": 200, "data": None, "raw": response.text, "url": response.url}
                else:
                    logger.warning(f"[{self.source_name}] HTTP {response.status_code} from {url}")
            except Exception as e:
                logger.warning(f"[{self.source_name}] Request error: {e}")

            attempt += 1
            time.sleep(BACKOFF_FACTOR ** attempt)

        return {"status": 500, "data": None, "raw": "", "url": url}
