# tests/test_endpoints.py

import pytest
from flask import json
from app import create_app, db
from app.models import User
from flask_jwt_extended import create_access_token

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()

def test_signup(client):
    """Test that a new user can sign up with valid data."""
    response = client.post('/api/signup', json={
        "username": "newuser",
        "email": "newuser@example.com",
        "password": "newpassword",
        # "role": "viewer"
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data["username"] == "newuser"
    assert data["email"] == "newuser@example.com"

def test_signup_duplicate(client):
    """Test that duplicate username or email is not allowed."""
    client.post('/api/signup', json={
        "username": "uniqueuser",
        "email": "uniqueuser@example.com",
        "password": "password123"
    })
    response = client.post('/api/signup', json={
        "username": "uniqueuser",
        "email": "uniqueuser@example.com",
        "password": "password123"
    })
    assert response.status_code == 400

def test_login(client):
    """Test user login with valid credentials."""
    # Register the user first
    client.post('/api/signup', json={
        "username": "loginuser",
        "email": "loginuser@example.com",
        "password": "securepassword"
    })
    # Attempt to log in
    response = client.post('/api/login', json={
        "email": "loginuser@example.com",
        "password": "securepassword"
    })
    assert response.status_code == 200
    data = response.get_json()
    assert "access_token" in data

def test_login_invalid_password(client):
    """Test login fails with incorrect password."""
    client.post('/api/signup', json={
        "username": "wrongpassworduser",
        "email": "wrongpassword@example.com",
        "password": "rightpassword"
    })
    response = client.post('/api/login', json={
        "email": "wrongpassword@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401

def test_protected_route_requires_auth(client):
    """Test that accessing protected routes requires a valid JWT."""
    response = client.get('/api/users/1')
    assert response.status_code == 401  # Unauthorized without JWT

def test_protected_route_with_auth(client):
    """Test that a protected route can be accessed with a valid JWT."""
    # Create and login a test user
    client.post('/api/signup', json={
        "username": "authuser",
        "email": "authuser@example.com",
        "password": "authpassword"
    })
    login_response = client.post('/api/login', json={
        "email": "authuser@example.com",
        "password": "authpassword"
    })
    access_token = login_response.get_json()["access_token"]

    # Access protected route with JWT
    headers = {"Authorization": f"Bearer {access_token}"}
    user_response = client.get('/api/users/1', headers=headers)
    assert user_response.status_code == 200
    data = user_response.get_json()
    assert data["username"] == "authuser"

def test_update_user(client):
    """Test that a user can update their own information with a valid JWT."""
    # Create and log in a user
    client.post('/api/signup', json={
        "username": "updateuser",
        "email": "updateuser@example.com",
        "password": "updatepassword"
    })
    login_response = client.post('/api/login', json={
        "email": "updateuser@example.com",
        "password": "updatepassword"
    })
    access_token = login_response.get_json()["access_token"]

    # Update user details
    headers = {"Authorization": f"Bearer {access_token}"}
    update_response = client.put('/api/users/1', headers=headers, json={
        "username": "updateduser",
        "email": "updateduser@example.com",
        "password": "newpassword"
    })
    assert update_response.status_code == 200
    assert update_response.get_json()["message"] == "User updated successfully"

    # Verify updated information
    user_response = client.get('/api/users/1', headers=headers)
    user_data = user_response.get_json()
    assert user_data["username"] == "updateduser"
    assert user_data["email"] == "updateduser@example.com"
