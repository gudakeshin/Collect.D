# --- File: app/routes.py ---
# Defines API endpoints using Flask Blueprints

from datetime import datetime
from flask import Blueprint, jsonify, request
from . import services # Import services module from the current package
from .auth import role_required # Import decorator
from .utils import check_call_timing_compliance # Import compliance check

# Create Blueprint objects
main_bp = Blueprint('main', __name__) # For general routes like health
ar_bp = Blueprint('ar', __name__, url_prefix='/api/ar')
collections_bp = Blueprint('collections', __name__, url_prefix='/api/collections')
reports_bp = Blueprint('reports', __name__, url_prefix='/api/reports')
system_bp = Blueprint('system', __name__, url_prefix='/api/system') # For system actions


@main_bp.route('/health', methods=['GET'])
def health_check():
    """Basic Health Check Endpoint."""
    return jsonify({"status": "OK", "timestamp": datetime.now().isoformat()})

# --- AR Routes ---
@ar_bp.route('/dashboard', methods=['GET'])
@role_required(['Agent', 'Manager'])
def get_ar_dashboard_route(agent_id):
    """AR Dashboard Data Route."""
    try:
        data = services.get_ar_dashboard_logic()
        return jsonify(data)
    except Exception as e:
        print(f"Error in AR dashboard route: {e}")
        return jsonify({"error": "Internal server error"}), 500

# --- Collections Routes ---
@collections_bp.route('/delinquent', methods=['GET'])
@role_required(['Agent', 'Manager'])
def get_delinquent_accounts_route(agent_id):
    """Collections Queue Data Route."""
    try:
        data = services.get_delinquent_accounts_logic()
        return jsonify(data)
    except Exception as e:
        print(f"Error in delinquent accounts route: {e}")
        return jsonify({"error": "Internal server error"}), 500

@collections_bp.route('/log_activity', methods=['POST'])
@role_required(['Agent'])
def log_collection_activity_route(agent_id):
    """Log Collection Activity Route."""
    data = request.json
    activity_type = data.get('activityType', 'Manual Call')
    customer_id = data.get('customerId')
    notes = data.get('notes')
    disposition = data.get('disposition')
    related_invoice = data.get('relatedInvoice')

    if not customer_id or not notes:
         return jsonify({"error": "Missing customerId or notes"}), 400

    compliance_status = 'N/A'
    if activity_type == 'Manual Call':
        if not check_call_timing_compliance(): # Use imported util
            compliance_status = "Blocked - Timing"
            print(f"COMPLIANCE BREACH DETECTED by {agent_id} for {customer_id} (Manual Call)")
            # Log the blocked attempt using the service
            services.log_communication_logic(customer_id, activity_type, agent_id, notes, disposition, compliance_status, related_invoice)
            return jsonify({"error": "Compliance Violation: Call outside allowed hours (8 AM - 7 PM IST)", "logged": True, "status": "Blocked"}), 403
        else:
            compliance_status = "Compliant"

    success, message = services.log_communication_logic(customer_id, activity_type, agent_id, notes, disposition, compliance_status, related_invoice)
    if success:
        return jsonify({"message": message}), 201
    else:
        return jsonify({"error": message}), 500

# --- Reports Routes ---
@reports_bp.route('/summary', methods=['GET'])
@role_required(['Manager'])
def get_report_summary_route(agent_id):
    """Report Summary Data Route."""
    try:
        data = services.get_report_summary_logic()
        return jsonify(data)
    except Exception as e:
        print(f"Error in report summary route: {e}")
        return jsonify({"error": "Internal server error"}), 500

# --- System Routes ---
@system_bp.route('/run_reminders', methods=['POST'])
@role_required(['Manager', 'System']) # Or just System if truly automated
def run_automated_reminders_route(agent_id):
    """Trigger Automated Reminders Route."""
    try:
        sent_count, message = services.trigger_automated_reminders_logic()
        return jsonify({"message": message, "sent_count": sent_count})
    except Exception as e:
        print(f"Error in run reminders route: {e}")
        return jsonify({"error": "Internal server error"}), 500
