# File: config.py
# Holds configuration variables

import os

# Base directory for configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Allow overriding data directory via environment variable for testing
DATA_DIR = os.environ.get('COLLECTD_DATA_DIR', os.path.join(BASE_DIR, 'data'))

CUSTOMER_MASTER_FILE = os.path.join(DATA_DIR, 'customer_master.csv')
INVOICES_FILE = os.path.join(DATA_DIR, 'invoices.csv')
INTERACTIONS_FILE = os.path.join(DATA_DIR, 'customer_interactions.csv')

# Add other configurations like secret keys, database URIs (for later phases) etc.
# SECRET_KEY = os.environ.get('SECRET_KEY', 'a-default-dev-secret-key') # Example
