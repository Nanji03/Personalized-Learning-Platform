from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_tutor_answer():
    response = client.post("/tutor", json={
        "topic": "Machine Learning",
        "question": "What is a neural network?"
    })
    assert response.status_code == 200
    data = response.json()
    assert "neural network" in data.get("answer", "").lower()