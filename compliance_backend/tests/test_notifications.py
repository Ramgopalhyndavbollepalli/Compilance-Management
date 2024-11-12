import pytest
from datetime import datetime
from app.models import Notification, db

@pytest.fixture
def create_notification():
    notification = Notification(user_id=1, message="Test notification", date=datetime.utcnow())
    db.session.add(notification)
    db.session.commit()
    return notification


def test_mark_notification_as_read(client, create_notification, access_token):
    notification_id = create_notification.id
    response = client.put(
        f"/api/notifications/{notification_id}/read",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 200
    assert response.get_json()["message"] == "Notification marked as read"

def test_mark_notification_as_unread(client, create_notification, access_token):
    notification_id = create_notification.id
    response = client.put(
        f"/api/notifications/{notification_id}/unread",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 200
    assert response.get_json()["message"] == "Notification marked as unread"

def test_delete_notification(client, create_notification, access_token):
    notification_id = create_notification.id
    response = client.delete(
        f"/api/notifications/{notification_id}",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 200
    assert response.get_json()["message"] == "Notification deleted successfully"

def test_get_notification_unauthorized(client):
    response = client.get("/api/notifications")
    assert response.status_code == 401  # Unauthorized access without token
