# app/audit_logger.py
from app import db
from app.models import AuditLog
from datetime import datetime

def log_action(user, action, details):
    """Logs an action to the audit log."""
    new_log = AuditLog(
        user=user,
        action=action,
        details=details,
        date=datetime.utcnow()
    )
    db.session.add(new_log)
    db.session.commit()
    print(f"DEBUG: Audit log entry added - User: {user}, Action: {action}, Details: {details}")
