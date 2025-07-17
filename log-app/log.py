# # Imports the Google Cloud client library
from google.cloud import logging

# # Instantiates a client
# logging_client = logging.Client()

# # The name of the log to write to
# log_name = "my-log"
# # Selects the log to write to
# logger = logging_client.logger(log_name)

# # The data to log
# text = "Hello, world!"

# # Writes the log entry
# logger.log_text(text)

# print("Logged: {}".format(text))

def write_entry(logger_name):
    """Writes log entries to the given logger."""
    logging_client = logging.Client()

    # This log can be found in the Cloud Logging console under 'Custom Logs'.
    logger = logging_client.logger(logger_name)

    # # Make a simple text log
    # logger.log_text("Hello, world!")

    # # Simple text log with severity.
    # logger.log_text("Goodbye, world!", severity="WARNING")

    # Struct log. The struct can be any JSON-serializable dictionary.
    logger.log_struct(
        {
  "header": {
    "event_id": "evt-456789123",
    "timestamp": "2025-06-23T15:45:12Z",
    "user": {
      "user_id": "user-12345",
      "email": "john.doe@hillspire.com",
      "roles": ["Viewer"],
      "ip_address": "192.168.1.101",
      "session_id": "sess-abc123"
    },
    "metadata": {
      "source_system": "ims-web-app",
      "app_version": "v2.3.1",
      "env": "production"
    }
  },
  "payload": {
    "ims_access": {
      "type": "api_call",
      "endpoint": "/api/investments/holding-summary",
      "method": "GET",
      "query_params": {
        "investmentId": "inv-009876"
      },
      "status_code": 200,
      "response_time_ms": 120,
      "referrer": "/dashboard"
    }
  }},
        severity="INFO",
    )

    print("Wrote logs to {}.".format(logger.name))

write_entry("my-log")