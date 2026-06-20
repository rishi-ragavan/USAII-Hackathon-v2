from fastapi.testclient import TestClient

from app.main import app


def test_openapi_serves():
    client = TestClient(app)
    r = client.get("/openapi.json")
    assert r.status_code == 200
    assert r.json()["info"]["title"] == "DayGraph API"


def test_root():
    client = TestClient(app)
    r = client.get("/")
    assert r.status_code == 200
    assert r.json()["name"] == "DayGraph API"
