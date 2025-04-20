import os
import pandas as pd
from django.conf import settings

class DataLoader:
    def __init__(self):
        self.data_dir = os.path.join(settings.BASE_DIR, 'data')
        
    def load_csv(self, filename):
        """Load a CSV file from the data directory"""
        file_path = os.path.join(self.data_dir, filename)
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Data file not found: {filename}")
        return pd.read_csv(file_path)
    
    def get_customer_data(self):
        """Load and process customer master data"""
        return self.load_csv('customer_master.csv')
    
    def get_invoice_data(self):
        """Load and process invoice data"""
        return self.load_csv('invoices.csv')
    
    def get_payment_data(self):
        """Load and process payment data"""
        return self.load_csv('payments.csv')
    
    def get_collection_cases(self):
        """Load and process collection cases data"""
        return self.load_csv('collection_cases.csv')
    
    def get_disputes(self):
        """Load and process disputes data"""
        return self.load_csv('disputes.csv')
    
    def get_risk_scores(self):
        """Load and process risk scores data"""
        return self.load_csv('risk_scores.csv')
    
    def get_customer_interactions(self):
        """Load and process customer interactions data"""
        return self.load_csv('customer_interactions.csv')
    
    def get_orders(self):
        """Load and process orders data"""
        return self.load_csv('orders.csv')
    
    def get_gl_entries(self):
        """Load and process GL entries data"""
        return self.load_csv('gl_entries.csv')
    
    def get_invoice_line_items(self):
        """Load and process invoice line items data"""
        return self.load_csv('invoice_line_items.csv')
    
    def get_payment_plans(self):
        """Load and process payment plans data"""
        return self.load_csv('payment_plans.csv')
    
    def get_dso_analytics(self):
        """Load and process DSO analytics data"""
        return self.load_csv('dso_analytics.csv')
    
    def get_strategy_effectiveness(self):
        """Load and process strategy effectiveness data"""
        return self.load_csv('strategy_effectiveness.csv')
    
    def get_collection_performance(self):
        """Load and process collection performance data"""
        return self.load_csv('collection_performance.csv')

# Create a singleton instance
data_loader = DataLoader() 