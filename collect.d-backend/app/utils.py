# --- File: app/utils.py ---
# Helper functions used across the application

from datetime import datetime, time, timedelta
import pandas as pd

def calculate_aging_dt(due_date):
    """Calculates aging bucket based on due date."""
    if pd.isna(due_date): return "N/A"
    today = datetime.now().date()
    due_date_date = due_date.date()
    delta = today - due_date_date
    if delta.days <= 0:
        return "Current"
    elif 1 <= delta.days <= 30:
        return "1-30 Days"
    elif 31 <= delta.days <= 60:
        return "31-60 Days"
    elif 61 <= delta.days <= 90:
        return "61-90 Days"
    else:
        return "90+ Days"

def check_call_timing_compliance():
    """Basic RBI Call Timing Check (8 AM - 7 PM IST)."""
    now_time = datetime.now().time() # Use IST-aware time in production
    allowed_start = time(8, 0)
    allowed_end = time(19, 0)
    print(f"Compliance Check - Current Time: {now_time}, Allowed: {allowed_start} - {allowed_end}") # Debugging
    return allowed_start <= now_time <= allowed_end

# --- Placeholder Integration Functions ---
def send_email_via_gateway(recipient_email, subject, body):
    """Placeholder for sending email via an actual gateway."""
    print(f"--- MOCK EMAIL ---")
    print(f"To: {recipient_email}")
    print(f"Subject: {subject}")
    print(f"-------------------")
    return True # Simulate success

def send_sms_via_gateway(recipient_phone, message):
    """Placeholder for sending SMS via an actual gateway."""
    print(f"--- MOCK SMS ---")
    print(f"To: {recipient_phone}")
    print(f"Message: {message}")
    print(f"-----------------")
    return True # Simulate success

