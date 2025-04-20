# --- File: app/auth.py ---
# Authentication and Authorization helpers

from functools import wraps
from flask import jsonify # Assuming Flask context is available where used

def role_required(role):
    """Decorator for basic role checking (conceptual)."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # --- Mock User/Role Check ---
            # Replace with actual user session/token validation & role lookup
            current_user_role = "Agent" # Hardcoded for MVP demo
            required_roles = role if isinstance(role, list) else [role] # Ensure it's a list
            if current_user_role not in required_roles:
                 return jsonify({"error": "Forbidden: Insufficient role"}), 403
            # --- End Mock Check ---
            # Pass agent ID derived from user session/token in real app
            kwargs['agent_id'] = f"Agent_MVP_{current_user_role}"
            return f(*args, **kwargs)
        return decorated_function
    return decorator
