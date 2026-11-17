from datetime import datetime, timezone
from uuid import UUID

import pytest
from fastapi.testclient import TestClient

from opslens.api import create_app, incident_reasons, ProcessEvent


@pytest.fixture()
def client(tmp_path):
    with TestClient(create_app(str(tmp_path / "events.db"))) as test:
        yield test


def event(**changes):
    d = dict(event_id="00000000-0000-4000-8000-000000000001", process_id="LINE_01",
             step="assembly", occurred_at="2026-11-17T09:00:00+00:00",
             duration_seconds=120, sla_seconds=180, outcome="completed")
    d.update(changes)
    return d


def test_health(client):
    assert client.get("/health").json()["mode"] == "local-synthetic"


def test_empty_metrics(client):
    data = client.get("/v1/metrics").json()
    assert data["total_events"] == 0
    assert data["sla_compliance_percent"] is None


def test_ingest_success(client):
    res = client.post("/v1/events", json=event())
    assert res.status_code == 201
    assert res.json()["incident"] is False
    assert client.get("/v1/metrics").json()["total_events"] == 1


def test_replay_is_idempotent(client):
    assert client.post("/v1/events", json=event()).status_code == 201
    second = client.post("/v1/events", json=event())
    assert second.status_code == 200
    assert second.json()["replayed"] is True
    assert client.get("/v1/metrics").json()["total_events"] == 1


def test_conflicting_duplicate_rejected(client):
    client.post("/v1/events", json=event())
    assert client.post("/v1/events", json=event(duration_seconds=20)).status_code == 409


def test_sla_breach(client):
    r = client.post("/v1/events", json=event(duration_seconds=181))
    assert r.json()["reasons"] == ["sla_breached"]
    assert client.get("/v1/metrics").json()["sla_breached"] == 1


def test_equal_sla_is_compliant(client):
    assert client.post("/v1/events", json=event(duration_seconds=180)).json()["incident"] is False


def test_failure_marks_incident(client):
    r = client.post("/v1/events", json=event(outcome="failed"))
    assert r.json()["reasons"] == ["process_failed"]


def test_failure_plus_breach(client):
    r = client.post("/v1/events", json=event(outcome="failed", duration_seconds=800))
    assert r.json()["reasons"] == ["sla_breached", "process_failed"]


def test_incident_list(client):
    client.post("/v1/events", json=event(outcome="failed"))
    data = client.get("/v1/incidents").json()
    assert len(data["items"]) == 1
    assert data["items"][0]["step"] == "assembly"


def test_process_filter(client):
    client.post("/v1/events", json=event())
    client.post("/v1/events", json=event(event_id="00000000-0000-4000-8000-000000000002", process_id="LINE_02", outcome="failed"))
    m = client.get("/v1/metrics?process_id=LINE_01").json()
    assert m["total_events"] == 1
    assert client.get("/v1/incidents?process_id=LINE_01").json()["items"] == []


def test_validation_rejects_negative_duration(client):
    assert client.post("/v1/events", json=event(duration_seconds=-1)).status_code == 422


def test_validation_rejects_naive_timestamp(client):
    assert client.post("/v1/events", json=event(occurred_at="2026-11-17T09:00:00")).status_code == 422


def test_validation_rejects_extra_fields(client):
    assert client.post("/v1/events", json=event(secret="not-allowed")).status_code == 422


def test_validation_rejects_malicious_process_name(client):
    assert client.post("/v1/events", json=event(process_id="LINE_01';DROP TABLE events;--")).status_code == 422


def test_limit_validation(client):
    assert client.get("/v1/incidents?limit=101").status_code == 422


def test_openapi_present(client):
    data = client.get("/openapi.json").json()
    assert "/v1/events" in data["paths"]

