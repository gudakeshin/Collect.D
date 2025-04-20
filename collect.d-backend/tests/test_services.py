import os
import sys
import pytest

# Ensure the backend 'app' package is importable
THIS_DIR = os.path.dirname(__file__)
BACKEND_DIR = os.path.abspath(os.path.join(THIS_DIR, '..'))
sys.path.insert(0, BACKEND_DIR)

# Point data directory to generated_data for tests
PROJECT_ROOT = os.path.abspath(os.path.join(THIS_DIR, '..', '..'))
os.environ['COLLECTD_DATA_DIR'] = os.path.join(PROJECT_ROOT, 'generated_data')

import pandas as pd
from datetime import datetime, timedelta
import app.services as services
from app.utils import calculate_aging_dt

def test_calculate_aging_dt():
    # Test aging bucket calculation
    assert calculate_aging_dt(pd.NaT) == 'N/A'
    today = datetime.now().date()
    assert calculate_aging_dt(pd.Timestamp(today)) == 'Current'
    assert calculate_aging_dt(pd.Timestamp(today - timedelta(days=15))) == '1-30 Days'
    assert calculate_aging_dt(pd.Timestamp(today - timedelta(days=45))) == '31-60 Days'
    assert calculate_aging_dt(pd.Timestamp(today - timedelta(days=75))) == '61-90 Days'
    assert calculate_aging_dt(pd.Timestamp(today - timedelta(days=120))) == '90+ Days'

def test_load_data():
    # Should load data without errors
    assert services.load_data() is True
    customers_df = services.get_customers_df()
    invoices_df = services.get_invoices_df()
    interactions_df = services.get_interactions_df()
    # DataFrames should not be empty
    assert not customers_df.empty
    assert not invoices_df.empty
    # interactions may be empty or populated
    assert isinstance(interactions_df, pd.DataFrame)

def test_get_ar_dashboard_logic():
    data = services.get_ar_dashboard_logic()
    # Check expected keys
    for key in ('overdue_invoices', 'aging_summary_amount', 'total_overdue_amount', 'calculated_dso'):
        assert key in data
    # The number of overdue invoices should match the filtered DataFrame
    inv_df = services.get_invoices_df()
    expected_count = inv_df[inv_df['payment_status'] == 'Overdue'].shape[0]
    assert len(data['overdue_invoices']) == expected_count

def test_get_delinquent_accounts_logic():
    result = services.get_delinquent_accounts_logic()
    assert isinstance(result, list)
    # If there are entries, they should have the expected fields
    if result:
        sample = result[0]
        for field in ['invoice_id', 'due_date', 'total_amount', 'customer_name', 'customer_id', 'aging_bucket']:
            assert field in sample

def test_trigger_automated_reminders_logic():
    # Should execute and return a tuple (int, str)
    sent_count, message = services.trigger_automated_reminders_logic()
    assert isinstance(sent_count, int)
    assert isinstance(message, str)

def test_report_summary_logic():
    summary = services.get_report_summary_logic()
    for key in ('aging_summary', 'total_overdue_amount', 'total_overdue_count', 'calculated_dso'):
        assert key in summary