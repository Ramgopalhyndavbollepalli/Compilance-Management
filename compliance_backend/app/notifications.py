from datetime import datetime
from app.models import Notification, db
import traceback
from flask import Blueprint, jsonify

api_bp = Blueprint('api', __name__)

def create_notification(message, user_id="system"):
    """Adds a notification to the database with a user ID or 'system' as the default."""
    try:
        new_notification = Notification(
            message=message,
            user_id=user_id,
            date=datetime.utcnow()
        )
        db.session.add(new_notification)
        db.session.commit()
        print(f"DEBUG: Notification added: {new_notification.to_dict()}")
    except Exception as e:
        db.session.rollback()
        print(f"ERROR: Failed to add notification - {e}")
        print(traceback.format_exc())

