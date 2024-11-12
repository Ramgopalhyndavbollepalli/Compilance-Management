# tests/test_models.py

import pytest
from app.models import User
from werkzeug.security import check_password_hash

@pytest.fixture
def user():
    return User(username="testuser", email="test@example.com", password="plaintextpassword")

def test_password_is_hashed(user):
    """Verify that the password is hashed and not stored as plaintext."""
    assert user._password != "plaintextpassword"
    assert check_password_hash(user._password, "plaintextpassword")

def test_check_password(user):
    """Check that the password verification works correctly."""
    assert user.check_password("plaintextpassword")
    assert not user.check_password("wrongpassword")

def test_to_dict(user):
    """Test that the user dictionary does not include the password."""
    user_dict = user.to_dict()
    assert "password" not in user_dict
    assert user_dict["username"] == "testuser"
    assert user_dict["email"] == "test@example.com"
    # assert user_dict["role"] == "viewer"  # Default role
