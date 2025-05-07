import logging
import os
import sys
from datetime import datetime, timedelta, timezone

# IST timezone
IST = timezone(timedelta(hours=5, minutes=30))

# Log file path: named BACKEND_LOGGER.log
LOG_FILE = os.path.join(os.getcwd(), "BACKEND_LOGGER.log")
print(LOG_FILE)
# Custom formatter
class ISTFormatter(logging.Formatter):
    def formatTime(self, record, datefmt=None):
        dt = datetime.fromtimestamp(record.created, IST)
        if datefmt:
            return dt.strftime(datefmt)
        return dt.isoformat()

# Format and date format
FORMAT = "[%(asctime)s] [%(levelname)s] [%(filename)s:%(lineno)d - %(funcName)s()] - %(message)s"
DATEFMT = "%Y-%m-%d %H:%M:%S"

# Initialize logger
custom_logger = logging.getLogger("BACKEND_LOGGER")
custom_logger.setLevel(logging.DEBUG)

# File handler
file_handler = logging.FileHandler(LOG_FILE)
file_handler.setLevel(logging.DEBUG)
file_handler.setFormatter(ISTFormatter(FORMAT, DATEFMT))

# Console handler
stream_handler = logging.StreamHandler(sys.stdout)
stream_handler.setLevel(logging.INFO)
stream_handler.setFormatter(ISTFormatter(FORMAT, DATEFMT))

# Attach handlers (if not already added)
if not custom_logger.hasHandlers():
    custom_logger.addHandler(file_handler)
    custom_logger.addHandler(stream_handler)
