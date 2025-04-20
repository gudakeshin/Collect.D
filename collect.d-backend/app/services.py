# --- File: app/services.py ---
# Core business logic, data loading and manipulation

import pandas as pd
import os
from datetime import datetime, timedelta
from .utils import send_email_via_gateway # Import helpers from utils
# Import config variables - better to pass config object from app factory
from config import CUSTOMER_MASTER_FILE, INVOICES_FILE, INTERACTIONS_FILE

# --- Global DataFrames (Load once, access via functions) ---
# WARNING: Global variables can be tricky. Consider using Flask's app context (g)
#          or a dedicated data manager class for better state management.
#          Loading here assumes the service module is imported once.
_customers_df = None
_invoices_df = None
_interactions_df = None

def load_data():
    """Loads or reloads data from CSV files."""
    global _customers_df, _invoices_df, _interactions_df
    try:
        print("Loading data in services module...")
        if not os.path.exists(CUSTOMER_MASTER_FILE): raise FileNotFoundError(CUSTOMER_MASTER_FILE)
        _customers_df = pd.read_csv(CUSTOMER_MASTER_FILE)

        if not os.path.exists(INVOICES_FILE): raise FileNotFoundError(INVOICES_FILE)
        _invoices_df = pd.read_csv(INVOICES_FILE)
        _invoices_df['due_date'] = pd.to_datetime(_invoices_df['due_date'], errors='coerce')
        _invoices_df['invoice_date'] = pd.to_datetime(_invoices_df['invoice_date'], errors='coerce')
        _invoices_df['total_amount'] = pd.to_numeric(_invoices_df['total_amount'], errors='coerce')
        _invoices_df['paid_amount'] = pd.to_numeric(_invoices_df['paid_amount'], errors='coerce')
        _invoices_df['balance_amount'] = pd.to_numeric(_invoices_df['balance_amount'], errors='coerce')
        _invoices_df.fillna({'total_amount': 0, 'paid_amount': 0, 'balance_amount': 0}, inplace=True)

        if os.path.exists(INTERACTIONS_FILE):
            _interactions_df = pd.read_csv(INTERACTIONS_FILE)
            _interactions_df['interaction_date'] = pd.to_datetime(_interactions_df['interaction_date'], errors='coerce')
        else:
            _interactions_df = pd.DataFrame(columns=[
                'interaction_id', 'customer_id', 'customer_name', 'interaction_date',
                'interaction_type', 'purpose', 'summary', 'initiated_by', 'handled_by',
                'rep_id', 'related_invoice', 'outcome', 'notes'
            ])
        print("Data loading successful in services.")
        return True
    except Exception as e:
        print(f"FATAL ERROR loading data in services: {e}")
        # Prevent app from starting or handle gracefully
        return False

# --- Call load_data() when the module is first imported ---
# This ensures data is loaded when the app starts (if services.py is imported)
if not load_data():
     print("Exiting due to data loading failure.")
     exit()
# ---------------------------------------------------------

def get_customers_df():
    if _customers_df is None: load_data() # Attempt reload if None
    return _customers_df

def get_invoices_df():
    if _invoices_df is None: load_data()
    return _invoices_df

def get_interactions_df():
    if _interactions_df is None: load_data()
    return _interactions_df


def get_ar_dashboard_logic():
    """Logic to prepare AR dashboard data."""
    # Use the getter functions to ensure dataframes are loaded
    inv_df = get_invoices_df()
    cust_df = get_customers_df()
    if inv_df is None or cust_df is None:
        raise ValueError("DataFrames not loaded properly")

    # Import helper here or pass it in
    from .utils import calculate_aging_dt

    # Filter overdue and merge in customer_name from master, drop any existing customer_name to avoid collisions
    overdue_invoices = inv_df[inv_df['payment_status'] == 'Overdue'].copy()
    overdue_invoices = overdue_invoices.drop(columns=['customer_name'], errors='ignore')
    overdue_invoices = pd.merge(
        overdue_invoices,
        cust_df[['customer_id', 'customer_name']],
        on='customer_id',
        how='left'
    )
    overdue_invoices['aging_bucket'] = overdue_invoices['due_date'].apply(calculate_aging_dt)

    aging_summary = overdue_invoices.groupby('aging_bucket')['total_amount'].sum()
    all_buckets = {"Current": 0, "1-30 Days": 0, "31-60 Days": 0, "61-90 Days": 0, "90+ Days": 0, "N/A": 0}
    all_buckets.update(aging_summary.to_dict())
    total_overdue_amount = overdue_invoices['total_amount'].sum()
    mock_dso = 45

    output_cols = ['invoice_id', 'due_date', 'total_amount', 'customer_name', 'customer_id', 'aging_bucket']
    output_invoices = overdue_invoices[output_cols].copy()
    output_invoices['due_date'] = output_invoices['due_date'].dt.strftime('%Y-%m-%d').fillna('N/A')
    output_invoices_dict = output_invoices.to_dict(orient='records')

    return {
        "overdue_invoices": output_invoices_dict,
        "aging_summary_amount": all_buckets,
        "total_overdue_amount": total_overdue_amount,
        "calculated_dso": mock_dso
    }

def get_delinquent_accounts_logic():
    """Logic to get delinquent accounts for collections."""
    inv_df = get_invoices_df()
    cust_df = get_customers_df()
    if inv_df is None or cust_df is None:
        raise ValueError("DataFrames not loaded properly")

    from .utils import calculate_aging_dt # Import helper

    # Filter overdue invoices and merge in customer_name cleanly
    delinquent = inv_df[inv_df['payment_status'] == 'Overdue'].copy()
    delinquent = delinquent.drop(columns=['customer_name'], errors='ignore')
    if delinquent.empty: return []

    delinquent = pd.merge(
        delinquent,
        cust_df[['customer_id', 'customer_name']],
        on='customer_id',
        how='left'
    )
    delinquent['aging_bucket'] = delinquent['due_date'].apply(calculate_aging_dt)

    output_columns = ['invoice_id', 'due_date', 'total_amount', 'customer_name', 'customer_id', 'aging_bucket']
    if not all(col in delinquent.columns for col in output_columns):
         raise ValueError("Missing expected columns in delinquent DataFrame for service logic")

    result_df = delinquent[output_columns].copy()
    result_df['due_date'] = result_df['due_date'].dt.strftime('%Y-%m-%d').fillna('N/A')
    result = result_df.to_dict(orient='records')
    return result

def log_communication_logic(customer_id, channel, agent_id, notes, disposition=None, compliance_status=None, related_invoice=None):
    """
    Logic to log communication - includes appending to CSV (still risky).
    """
    global _interactions_df # Need to modify the global DataFrame
    cust_df = get_customers_df()
    if cust_df is None: raise ValueError("Customers DataFrame not loaded")

    try:
        timestamp = datetime.now().isoformat()
        customer_name_series = cust_df.loc[cust_df['customer_id'] == customer_id, 'customer_name']
        customer_name = customer_name_series.iloc[0] if not customer_name_series.empty else 'Unknown Customer'
        interaction_id = f"INT_{int(datetime.now().timestamp() * 1000)}"

        new_log_data = {
            'interaction_id': interaction_id, 'customer_id': customer_id, 'customer_name': customer_name,
            'interaction_date': timestamp, 'interaction_type': channel, 'purpose': 'AR/Collections Activity',
            'summary': notes[:100] if notes else None, 'initiated_by': 'Agent' if agent_id != 'System - Reminder Engine' else 'System',
            'handled_by': agent_id, 'rep_id': None, 'related_invoice': related_invoice,
            'outcome': disposition, 'notes': notes,
        }

        # Append to CSV (Risk Warning Still Applies)
        header_needed = not os.path.exists(INTERACTIONS_FILE) or os.path.getsize(INTERACTIONS_FILE) == 0
        pd.DataFrame([new_log_data]).to_csv(INTERACTIONS_FILE, mode='a', header=header_needed, index=False)

        # Update in-memory DataFrame
        new_log_df = pd.DataFrame([new_log_data])
        new_log_df['interaction_date'] = pd.to_datetime(new_log_df['interaction_date'], errors='coerce')
        _interactions_df = pd.concat([_interactions_df, new_log_df], ignore_index=True)

        print(f"Service logged communication to {INTERACTIONS_FILE} for {customer_id}")
        return True, "Logged successfully"
    except Exception as e:
        print(f"Service error logging communication for {customer_id}: {e}")
        return False, f"Failed to log: {e}"


def trigger_automated_reminders_logic():
    """Logic for finding and triggering automated reminders."""
    inv_df = get_invoices_df()
    cust_df = get_customers_df()
    inter_df = get_interactions_df() # Use interactions to check recent sends
    if inv_df is None or cust_df is None or inter_df is None:
        raise ValueError("DataFrames not loaded properly for reminders")

    print(f"{datetime.now()}: Service running automated reminders logic...")
    # Determine the date for invoices due exactly 5 days ago
    target_due_date = (datetime.now() - timedelta(days=5)).date()

    # Filter invoices where due_date matches target and status is Overdue
    reminders_needed_base = inv_df[
        (inv_df['due_date'].dt.date == target_due_date) &
        (inv_df['payment_status'] == 'Overdue')
    ].copy()

    if reminders_needed_base.empty: return 0, "No invoices match criteria."

    reminders_needed = pd.merge(reminders_needed_base, cust_df[['customer_id', 'customer_name', 'email']], on='customer_id', how='left')

    # Check recent reminders
    recent_cutoff = (datetime.now() - timedelta(days=3)).isoformat()
    # Ensure interaction_date is datetime before comparison
    inter_df['interaction_date_dt'] = pd.to_datetime(inter_df['interaction_date'], errors='coerce')
    recent_reminders = inter_df[
        (inter_df['interaction_type'] == 'Automated Email Reminder') &
        (inter_df['interaction_date_dt'] >= pd.Timestamp(recent_cutoff)) # Compare Timestamps
    ]['customer_id'].unique()

    reminders_to_send = reminders_needed[~reminders_needed['customer_id'].isin(recent_reminders)]

    if reminders_to_send.empty: return 0, "Reminders needed but already sent recently."

    sent_count = 0
    for index, reminder in reminders_to_send.iterrows():
        customer_email = reminder.get('email', None)
        if pd.isna(customer_email): continue

        subject = f"Payment Reminder for Invoice {reminder['invoice_id']}"
        body = f"Dear {reminder['customer_name']}, Reminder: Invoice {reminder['invoice_id']} for INR {reminder['total_amount']:.2f} was due on {reminder['due_date'].strftime('%Y-%m-%d')}. Please pay soon. Collect.D Team."

        if send_email_via_gateway(customer_email, subject, body): # Use imported helper
            log_communication_logic( # Use logging logic from this module
                 customer_id=reminder['customer_id'], channel='Automated Email Reminder',
                 agent_id='System - Reminder Engine', notes=f"Sent reminder for Invoice {reminder['invoice_id']}",
                 related_invoice=reminder['invoice_id']
            )
            sent_count += 1

    return sent_count, f"Sent {sent_count} reminders."

def get_report_summary_logic():
    """Logic for report summary data."""
    inv_df = get_invoices_df()
    if inv_df is None: raise ValueError("Invoices DataFrame not loaded")

    from .utils import calculate_aging_dt # Import helper

    overdue = inv_df[inv_df['payment_status'] == 'Overdue'].copy()
    if overdue.empty:
         return {"aging_summary": {}, "total_overdue_amount": 0, "total_overdue_count": 0, "calculated_dso": 0}

    overdue['aging_bucket'] = overdue['due_date'].apply(calculate_aging_dt)
    aging_summary_agg = overdue.groupby('aging_bucket')['total_amount'].agg(['sum', 'count'])
    all_buckets_template = {"Current": {'sum': 0, 'count': 0}, "1-30 Days": {'sum': 0, 'count': 0},
                            "31-60 Days": {'sum': 0, 'count': 0}, "61-90 Days": {'sum': 0, 'count': 0},
                            "90+ Days": {'sum': 0, 'count': 0}, "N/A": {'sum': 0, 'count': 0}}
    all_buckets_template.update(aging_summary_agg.to_dict('index'))

    total_overdue_amount = overdue['total_amount'].sum()
    total_overdue_count = len(overdue)
    mock_dso = 45

    return {
        "aging_summary": all_buckets_template,
        "total_overdue_amount": total_overdue_amount,
        "total_overdue_count": total_overdue_count,
        "calculated_dso": mock_dso
    }


