# app/models.py
from . import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    _password = db.Column("password", db.String(256), nullable=False)
    role = db.Column(db.String(20), default="viewer")

    @property
    def password(self):
        raise AttributeError("Password is write-only.")

    @password.setter
    def password(self, plain_password):
        """Automatically hash the password when setting it."""
        self._password = generate_password_hash(plain_password)

    def check_password(self, password):
        """Check the hashed password against a plaintext password."""
        return check_password_hash(self._password, password)
    
    def to_dict(self):
        """Convert the user object to a dictionary for JSON serialization."""
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role
        }

class Policy(db.Model):
    __tablename__ = 'policies'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(255))
    category = db.Column(db.String(80))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Auto-set creation time

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "category": self.category,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    user = db.Column(db.String(80), nullable=False)
    action = db.Column(db.String(120), nullable=False)
    details = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date.isoformat(),
            "user": self.user,
            "action": self.action,
            "details": self.details
        }

class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('notifications', lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "user_name": self.user.username if self.user else "Unknown",
            "message": self.message,
            "is_read": self.is_read,
            "date": self.date.isoformat()
        }

class ComplianceEntry(db.Model):
    __tablename__ = 'compliance_entries'

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50))
    user = db.Column(db.String(80))
    details = db.Column(db.String(255))

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date.isoformat(),
            "status": self.status,
            "user": self.user,
            "details": self.details
        }
