# app/routes.py
from flask import Blueprint, jsonify, request
from . import db
from .models import User, Policy, AuditLog
from app.audit_logger import log_action
from .models import Notification  
from fpdf import FPDF
from flask import Blueprint, jsonify, request, send_file
import tempfile
from .models import ComplianceEntry
import os
import traceback
from io import BytesIO
from app.notifications import create_notification  # Correct import
from datetime import datetime
from sqlalchemy.exc import IntegrityError  # Add this import
from flask import send_file, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask import request, jsonify
from datetime import timedelta
from werkzeug.security import generate_password_hash
from flask_login import current_user, login_required
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from flask import jsonify, request, session
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import get_jwt_identity, jwt_required, get_jwt


api_bp = Blueprint('api', __name__)

@api_bp.route('/notifications', methods=['GET'])
def get_notifications():
    print("DEBUG: Received GET request at /api/notifications")  # Log request for debugging
    try:
        notifications = Notification.query.all()  # Query all notifications from the database
        notifications_data = [notification.to_dict() for notification in notifications]
        print(f"DEBUG: Notifications retrieved: {notifications_data}")  # Log retrieved data
        return jsonify(notifications_data), 200  # Return the notifications as JSON
    except Exception as e:
        print(f"ERROR: Failed to fetch notifications: {e}")  # Log any errors encountered
        print(traceback.format_exc())
        return jsonify({"error": "Failed to fetch notifications"}), 500


@api_bp.route('/policies', methods=['POST'])
@jwt_required()
def add_policy():
    data = request.get_json()
    print(f"DEBUG: Received data in POST request for new policy: {data}")

    # Only proceed if required fields are present
    if not data or 'name' not in data or 'category' not in data:
        print("ERROR: 'name' or 'category' missing in policy data.")
        return jsonify({"error": "Invalid data provided"}), 400

    try:
        # Prevent duplicate creation: Check if policy already exists
        existing_policy = Policy.query.filter_by(name=data['name'], category=data['category']).first()
        if existing_policy:
            print("ERROR: Policy with the same name and category already exists.")
            return jsonify({"error": "Duplicate policy"}), 400

        new_policy = Policy(
            name=data['name'],
            description=data.get('description', ''),
            category=data.get('category', 'General')
        )
        db.session.add(new_policy)
        db.session.commit()
        print(f"DEBUG: Policy added to the database: {new_policy.to_dict()}")

        # Retrieve the username based on the user ID
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        username = user.username if user else "Unknown User"

        # Log the action with the correct username
        log_action(user=username, action="Policy Created", details=f"Created policy '{data['name']}'")
        create_notification(f"Policy '{data['name']}' created", user_id=user_id)

        return jsonify(new_policy.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        print(f"ERROR: Error adding policy: {e}")
        print(traceback.format_exc())
        return jsonify({"error": "Failed to add policy"}), 500



@api_bp.route('/policies', methods=['GET', 'POST'])
@jwt_required()  # Ensure this route is protected
def manage_policies():
    if request.method == 'POST':
        print("DEBUG: Received POST request at /api/policies")
        data = request.get_json()
        print(f"DEBUG: Request data: {data}")

        if not data or not data.get('name'):
            print("ERROR: Missing 'name' in policy data.")
            return jsonify({"error": "Invalid data provided"}), 400

        try:
            # Add new policy to database
            new_policy = Policy(
                name=data['name'],
                description=data.get('description', ''),
                category=data.get('category', 'General')
            )
            db.session.add(new_policy)
            db.session.commit()
            print(f"DEBUG: New policy added to database: {new_policy.to_dict()}")

            # Retrieve the username based on the user ID
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            username = user.username if user else "admin"


            return jsonify(new_policy.to_dict()), 201
        except Exception as e:
            db.session.rollback()
            print(f"ERROR: Exception while adding policy: {e}")
            print(traceback.format_exc())
            return jsonify({"error": "Failed to add policy"}), 500

    elif request.method == 'GET':
        print("DEBUG: Received GET request at /api/policies")
        try:
            policies = Policy.query.all()
            policies_data = [policy.to_dict() for policy in policies]
            print(f"DEBUG: Retrieved policies: {policies_data}")
            return jsonify(policies_data), 200
        except Exception as e:
            print(f"ERROR: Exception while fetching policies: {e}")
            print(traceback.format_exc())
            return jsonify({"error": "Failed to fetch policies"}), 500
            
@api_bp.route('/policies/<int:policy_id>', methods=['PUT', 'DELETE'])
@jwt_required()
def handle_policy(policy_id):
    policy = Policy.query.get(policy_id)
    if not policy:
        return jsonify({"error": "Policy not found"}), 404

    user_id = get_jwt_identity()  # Get user ID from JWT token

    if request.method == 'PUT':
        data = request.get_json()
        try:
            policy.name = data['name']
            policy.description = data['description']
            policy.category = data['category']
            db.session.commit()

            log_action(user_id, "Policy Updated", f"Updated policy '{policy.name}'")
            create_notification(f"Policy '{policy.name}' updated", user_id=user_id)
            
            return jsonify(policy.to_dict()), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "Failed to update policy"}), 500

    elif request.method == 'DELETE':
        try:
            db.session.delete(policy)
            db.session.commit()

            log_action(user_id, "Policy Deleted", f"Deleted policy '{policy.name}'")
            create_notification(f"Policy '{policy.name}' deleted", user_id=user_id)
            
            return jsonify({"message": "Policy deleted successfully"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "Failed to delete policy"}), 500


#signup route

@api_bp.route('/signup', methods=['POST'])
def signup():
    print("DEBUG: Received POST request at /api/signup")
    data = request.get_json()
    print(f"DEBUG: Signup request data: {data}")

    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        print("ERROR: Invalid data received")
        return jsonify({"error": "Invalid data provided"}), 400

    existing_user = User.query.filter((User.username == data['username']) | (User.email == data['email'])).first()
    if existing_user:
        print("ERROR: User with this email or username already exists")
        return jsonify({"error": "User with this email or username already exists"}), 400

    try:
        new_user = User(
            username=data['username'],
            email=data['email'],
            password=data['password'],  # This triggers hashing in the setter
            role=data.get('role', 'viewer')
        )
        db.session.add(new_user)
        db.session.commit()
        print(f"DEBUG: New user created: {new_user.to_dict()}")

        # Add notification for user creation
        create_notification(f"User '{new_user.username}' created.", "admin")
        
        # Log the user creation in the audit log
        log_action(user="system", action="User Created", details=f"User '{new_user.username}' signed up")

        return jsonify(new_user.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        print(f"ERROR: Exception during user signup: {e}")
        return jsonify({"error": "Failed to add user"}), 500


# Login Route

@api_bp.route('/login', methods=['POST'])
def login():
    print("DEBUG: Received POST request at /api/login")
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    
    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id, additional_claims={"role": user.role})
        print("DEBUG: Password check succeeded.")

        # Log successful login
        log_action(user=user.username, action="User Login", details=f"User '{user.username}' logged in")

        return jsonify({
            "message": "Login successful",
            "role": user.role,
            "user_id": user.id,
            "access_token": access_token
        }), 200
    else:
        print("DEBUG: Invalid credentials.")
        return jsonify({"error": "Invalid credentials"}), 401


# Route to get all users with debug information
@api_bp.route('/users', methods=['GET'])
def get_users():
    print("DEBUG: Received GET request at /api/users")  # Log route access
    try:
        users = User.query.all()
        users_data = [user.to_dict() for user in users]
        print(f"DEBUG: Users retrieved: {users_data}")  # Log retrieved data
        return jsonify(users_data), 200
    except Exception as e:
        print(f"ERROR: Error fetching users: {e}")
        return jsonify({"error": "Failed to fetch users"}), 500
    
@api_bp.route('/users', methods=['POST'])
@jwt_required()
def create_user():
    data = request.get_json()
    user_id = get_jwt_identity()  # Get the admin user making the request
    user = User.query.get(user_id)  # Fetch the admin user's details

    # Validate required fields
    if not data or 'username' not in data or 'email' not in data or 'password' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    # Create new user
    try:
        new_user = User(
            username=data['username'],
            email=data['email'],
            password=data['password'],  # This will be hashed by the model
            role=data.get('role', 'viewer')
        )
        db.session.add(new_user)
        db.session.commit()
        
        # Create audit log and notification
        log_action(user=user.username, action="User Created", details=f"Created user '{new_user.username}'")
        create_notification(f"User '{new_user.username}' created by {user.username}", user_id=user.id)

        return jsonify(new_user.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        print(f"ERROR: Failed to create user: {e}")
        return jsonify({"error": "Failed to create user"}), 500



@api_bp.route('/users/<int:user_id>', methods=['GET', 'PUT'])
@jwt_required()  # Ensures the route is protected
def handle_user(user_id):
    current_user_id = get_jwt_identity()
    claims = get_jwt()  # This retrieves all claims, including role
    user_role = claims.get("role", "viewer")  # Defaults to viewer if no role found

    # Allow action if the user is an admin or if they are accessing their own profile
    if user_role != "admin" and current_user_id != user_id:
        print("ERROR: Unauthorized access attempt.")
        return jsonify({"error": "Unauthorized"}), 403

    user = User.query.get(user_id)
    if not user:
        print(f"DEBUG: User with ID {user_id} not found.")
        return jsonify({"error": "User not found"}), 404

    if request.method == 'GET':
        user_data = {
            "username": user.username,
            "email": user.email,
            "role": user.role
        }
        return jsonify(user_data), 200

    elif request.method == 'PUT':
        data = request.get_json()
        user.username = data.get("username", user.username)
        user.email = data.get("email", user.email)
        user.role = data.get("role", user.role)

        if 'password' in data and data['password']:
            user.password = data['password']
        
        try:
            db.session.commit()
            print(f"DEBUG: User ID {user_id} updated successfully.")
            return jsonify({"message": "User updated successfully"}), 200
        except Exception as e:
            db.session.rollback()
            print(f"ERROR: Failed to update user ID {user_id}. Exception: {e}")
            return jsonify({"error": "Failed to update user"}), 500

# User Deletion Route

@api_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    print(f"DEBUG: Received DELETE request at /api/users/{user_id}")

    try:
        # Get the user to be deleted
        user_to_delete = User.query.get(user_id)
        if not user_to_delete:
            print(f"ERROR: User with id {user_id} not found")
            return jsonify({"error": "User not found"}), 404

        # Get the ID of the user performing the deletion
        deleter_id = get_jwt_identity()
        deleter_user = User.query.get(deleter_id)

        # Perform the deletion
        db.session.delete(user_to_delete)
        db.session.commit()
        print(f"DEBUG: User with id {user_id} deleted from the database")

        # Log the deletion action with the correct deleter's username
        if deleter_user:
            log_action(
                user=deleter_user.username, 
                action="User Deleted", 
                details=f"Deleted user '{user_to_delete.username}'"
            )

        # Add a notification for deletion
        create_notification(f"User '{user_to_delete.username}' has been deleted.", "admin")

        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"ERROR: Error deleting user: {e}")
        return jsonify({"error": "Failed to delete user"}), 500

        
# Route to get dashboard metrics with debugging
@api_bp.route('/dashboard-metrics', methods=['GET'])
def dashboard_metrics():
    print("DEBUG: Received GET request at /api/dashboard-metrics")  # Log route access
    try:
        metrics = {
            'total_users': User.query.count(),
            'total_policies': Policy.query.count(),
            'compliance_rate': 85  # Example static value
        }
        print(f"DEBUG: Dashboard metrics: {metrics}")  # Log metrics data
        return jsonify(metrics), 200
    except Exception as e:
        print(f"ERROR: Error fetching dashboard metrics: {e}")
        return jsonify({"error": "Failed to fetch metrics"}), 500

@api_bp.route('/audit-logs', methods=['GET'])
def get_audit_logs():
    print("DEBUG: Received GET request at /api/audit-logs")  # Log request
    try:
        # Retrieve all audit logs from the database
        audit_logs = AuditLog.query.all()
        print(f"DEBUG: Number of audit logs retrieved: {len(audit_logs)}")  # Log count

        # Convert to dict format for JSON response
        audit_logs_data = [log.to_dict() for log in audit_logs]
        print(f"DEBUG: Audit logs data to return: {audit_logs_data}")  # Log data content

        return jsonify(audit_logs_data), 200  # Send response
    except Exception as e:
        print(f"ERROR: Failed to fetch audit logs. Details: {e}")  # Log error details
        return jsonify({"error": "Failed to fetch audit logs"}), 500

class StyledPDF(FPDF):
    def header(self):
        try:
            self.set_font("Arial", "B", 16)
            print("DEBUG: Set font Arial Bold for header.")
        except Exception as e:
            print("ERROR: Arial font not available, switching to Helvetica.")
            self.set_font("Helvetica", "B", 16)

        self.set_text_color(50, 50, 50)
        self.cell(0, 10, "Compliance Report", ln=True, align='C')
        self.set_font("Arial", "I", 10)
        self.set_text_color(100, 100, 100)
        self.cell(0, 10, f"Generated on: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}", ln=True, align='C')
        self.ln(10)

    def add_section_title(self, title):
        self.set_font("Arial", "B", 14)
        self.set_fill_color(200, 220, 255)
        self.set_text_color(40, 40, 40)
        self.cell(0, 12, title, ln=True, fill=True, border=0, align='L')
        self.ln(4)

    def add_table_row(self, values, widths, is_header=False):
        self.set_fill_color(245, 245, 245) if not is_header else self.set_fill_color(200, 200, 200)
        self.set_text_color(0, 0, 0) if not is_header else self.set_text_color(255, 255, 255)
        font_style = "B" if is_header else ""
        self.set_font("Arial", font_style, 10)
        for i, value in enumerate(values):
            self.cell(widths[i], 10, str(value), border=1, fill=True, align='C')
        self.ln(10)

@api_bp.route('/reports', methods=['POST'])
def generate_report():
    try:
        data = request.get_json()
        start_date = datetime.strptime(data.get('startDate'), '%Y-%m-%d') if data.get('startDate') else None
        end_date = datetime.strptime(data.get('endDate'), '%Y-%m-%d') if data.get('endDate') else None
        compliance_status = data.get('complianceStatus')

        print("DEBUG: Report criteria received:", data)

        # Querying Compliance Entries
        query = ComplianceEntry.query
        if start_date:
            query = query.filter(ComplianceEntry.date >= start_date)
            print(f"DEBUG: Filtering entries from {start_date}")
        if end_date:
            query = query.filter(ComplianceEntry.date <= end_date)
            print(f"DEBUG: Filtering entries until {end_date}")
        if compliance_status:
            query = query.filter(ComplianceEntry.status == compliance_status)
            print(f"DEBUG: Filtering entries with status {compliance_status}")

        entries = query.all()
        print(f"DEBUG: Compliance entries retrieved: {len(entries)} entries found in specified date range.")

        # Compliance metrics
        total_entries = len(entries)
        compliant_count = sum(1 for entry in entries if entry.status == 'compliant')
        non_compliant_count = total_entries - compliant_count
        compliance_rate = (compliant_count / total_entries * 100) if total_entries > 0 else 0

        # Querying Recent Audit Logs
        recent_audit_logs = AuditLog.query.order_by(AuditLog.date.desc()).filter(
            AuditLog.date >= start_date if start_date else datetime.min,
            AuditLog.date <= end_date if end_date else datetime.utcnow()
        ).all()
        print(f"DEBUG: Audit logs retrieved: {len(recent_audit_logs)} logs found.")

        # Querying Recent Notifications
        recent_notifications = Notification.query.order_by(Notification.date.desc()).filter(
            Notification.date >= start_date if start_date else datetime.min,
            Notification.date <= end_date if end_date else datetime.utcnow()
        ).all()
        print(f"DEBUG: Notifications retrieved: {len(recent_notifications)} notifications found.")

        pdf = StyledPDF()
        pdf.add_page()

        # Compliance Summary Section
        pdf.add_section_title("Compliance Summary")
        pdf.add_table_row(
            ["Total Entries", "Compliant", "Non-Compliant", "Compliance Rate (%)"],
            [45, 45, 45, 55],
            is_header=True
        )
        pdf.add_table_row(
            [total_entries, compliant_count, non_compliant_count, f"{compliance_rate:.2f}"],
            [45, 45, 45, 55]
        )
        print("DEBUG: Added Compliance Summary to PDF.")

        # Compliance Entries Section
        pdf.add_section_title("Compliance Entries")
        if entries:
            pdf.add_table_row(["Date", "User", "Status", "Details"], [40, 40, 30, 80], is_header=True)
            for entry in entries:
                pdf.add_table_row(
                    [entry.date.strftime("%Y-%m-%d"), entry.user, entry.status, entry.details or "N/A"],
                    [40, 40, 30, 80]
                )
        else:
            pdf.cell(0, 10, "No entries available for the selected criteria.", ln=True)
        print("DEBUG: Added Compliance Entries to PDF.")

        # Recent Audit Logs Section
        pdf.add_section_title("Recent Audit Logs")
        if recent_audit_logs:
            pdf.add_table_row(["Date", "User", "Action", "Details"], [40, 40, 30, 80], is_header=True)
            for log in recent_audit_logs:
                pdf.add_table_row(
                    [log.date.strftime("%Y-%m-%d %H:%M:%S"), log.user, log.action, log.details or "N/A"],
                    [40, 40, 30, 80]
                )
        else:
            pdf.cell(0, 10, "No recent audit logs within selected date range.", ln=True)
        print("DEBUG: Added Recent Audit Logs to PDF.")

        # Recent Notifications Section
        pdf.add_section_title("Recent Notifications")
        if recent_notifications:
            pdf.add_table_row(["Date", "User", "Message"], [50, 30, 80], is_header=True)
            for notification in recent_notifications:
                pdf.add_table_row(
                    [notification.date.strftime("%Y-%m-%d %H:%M:%S"), notification.user_id, notification.message],
                    [50, 30, 80]
                )
        else:
            pdf.cell(0, 10, "No recent notifications within selected date range.", ln=True)
        print("DEBUG: Added Recent Notifications to PDF.")

        # Save and send PDF file
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
                pdf.output(temp_file.name)
                temp_file_path = temp_file.name
            print("DEBUG: PDF report generated successfully at", temp_file_path)
        except Exception as e:
            print("ERROR: Failed to create or save temporary PDF file.", e)
            return jsonify({"error": "Failed to create PDF"}), 500

        response = send_file(
            temp_file_path,
            mimetype='application/pdf',
            as_attachment=True,
            download_name="compliance_report.pdf"
        )

        @response.call_on_close
        def cleanup():
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
                print("DEBUG: Temporary file deleted:", temp_file_path)
            else:
                print("DEBUG: Temporary file not found for deletion:", temp_file_path)

        return response

    except Exception as e:
        print("ERROR: Exception occurred during report generation.")
        print(traceback.format_exc())
        return jsonify({"error": "Failed to generate report"}), 500
    
@api_bp.route('/<path:path>', methods=['OPTIONS'])
def handle_options(path):
    # Allow all CORS preflight requests
    return '', 200

