import pytest
from app import create_app, db
from app.models import User, Policy
from flask_jwt_extended import create_access_token
from datetime import datetime

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

@pytest.fixture
def auth_headers(client):
    # Create a test user and generate access token
    user = User(username="testadmin", email="admin@example.com", password="password", role="admin")
    db.session.add(user)
    db.session.commit()
    
    token = create_access_token(identity=user.id)
    return {"Authorization": f"Bearer {token}"}

def test_add_policy(client, auth_headers):
    # Test creating a new policy
    response = client.post(
        "/api/policies",
        json={"name": "Test Policy", "description": "A test policy", "category": "General"},
        headers=auth_headers,
    )
    assert response.status_code == 201
    data = response.get_json()
    assert data["name"] == "Test Policy"
    assert data["description"] == "A test policy"
    assert data["category"] == "General"

def test_add_duplicate_policy(client, auth_headers):
    # Add a policy first
    client.post(
        "/api/policies",
        json={"name": "Duplicate Policy", "description": "First instance", "category": "General"},
        headers=auth_headers,
    )
    # Try adding the same policy again
    response = client.post(
        "/api/policies",
        json={"name": "Duplicate Policy", "description": "Second instance", "category": "General"},
        headers=auth_headers,
    )
    assert response.status_code == 400
    data = response.get_json()
    assert "Duplicate policy" in data["error"]

def test_get_policies(client, auth_headers):
    # Add a sample policy
    client.post(
        "/api/policies",
        json={"name": "Sample Policy", "description": "A sample policy", "category": "General"},
        headers=auth_headers,
    )
    # Retrieve policies
    response = client.get("/api/policies", headers=auth_headers)
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 1
    assert data[0]["name"] == "Sample Policy"

def test_update_policy(client, auth_headers):
    # Add a sample policy
    response = client.post(
        "/api/policies",
        json={"name": "Policy to Update", "description": "Initial description", "category": "General"},
        headers=auth_headers,
    )
    policy_id = response.get_json()["id"]
    
    # Update the policy
    response = client.put(
        f"/api/policies/{policy_id}",
        json={"name": "Updated Policy", "description": "Updated description", "category": "General"},
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.get_json()
    assert data["name"] == "Updated Policy"
    assert data["description"] == "Updated description"

def test_delete_policy(client, auth_headers):
    # Add a sample policy
    response = client.post(
        "/api/policies",
        json={"name": "Policy to Delete", "description": "To be deleted", "category": "General"},
        headers=auth_headers,
    )
    policy_id = response.get_json()["id"]
    
    # Delete the policy
    response = client.delete(f"/api/policies/{policy_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.get_json()
    assert "Policy deleted successfully" in data["message"]
    
    # Verify deletion
    response = client.get("/api/policies", headers=auth_headers)
    data = response.get_json()
    assert all(policy["id"] != policy_id for policy in data)
