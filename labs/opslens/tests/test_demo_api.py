"""Tests for public, stateless OpsLens demonstration semantics."""
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

from opslens.demo_api import create_demo_app, calculate_snapshot, SyntheticEvent

client = TestClient(create_demo_app())
ORIGIN = {"Origin": "https://gustavormartins.vercel.app"}


def event(kind="completed", process="DEMO_01", step="assembly", event_id=None):
    return {
        "event_id": event_id or str(uuid4()),
        "process_id": process,
        "step": step,
        "kind": kind,
    }


def submit(*items, headers=None):
    return client.post("/api/simulate", json={"events": list(items)}, headers=ORIGIN if headers is None else headers)


def test_health_is_stateless():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["storage"] == "none"
    assert r.headers["x-opslens-engine"] == "fastapi-python"
    assert r.headers["cache-control"] == "no-store"


def test_successful_event():
    r = submit(event())
    assert r.status_code == 200
    m = r.json()
    assert (m["total_events"], m["sla_breached"], m["failed"]) == (1, 0, 0)
    assert m["sla_compliance_percent"] == 100.0
    assert m["incidents"] == []
    assert m["last_event"]["duration_seconds"] <= m["last_event"]["sla_seconds"]


def test_sla_violation_is_real_python_rule():
    m = submit(event(kind="sla", step="inspection")).json()
    assert m["sla_breached"] == 1
    assert m["failed"] == 0
    assert m["sla_compliance_percent"] == 0.0
    assert m["incidents"][0]["reasons"] == ["sla_breached"]


def test_process_failure_is_independent():
    m = submit(event(kind="failed")).json()
    assert m["failed"] == 1
    assert m["sla_breached"] == 0
    assert m["incidents"][0]["reasons"] == ["process_failed"]


def test_aggregate_by_process_and_average():
    a, b, c = event(), event(kind="sla"), event(kind="failed", process="DEMO_02")
    m = submit(a, b, c).json()
    assert m["total_events"] == 3
    assert m["sla_breached"] == 1
    assert m["failed"] == 1
    assert m["sla_compliance_percent"] == pytest.approx(66.67)
    assert len(m["by_process"]) == 2
    assert [v["incidents"] for v in m["by_process"]] == [1, 1]
    assert m["average_duration_seconds"] > 0


def test_replay_is_idempotent_inside_batch():
    e = event()
    m = submit(e, e).json()
    assert m["total_events"] == 1


def test_same_uuid_different_synthetic_payload_conflicts():
    same = str(uuid4())
    r = submit(event(event_id=same), event(kind="sla", event_id=same))
    assert r.status_code == 409


def test_sessions_are_isolated_without_database():
    assert submit(event(kind="sla")).json()["total_events"] == 1
    assert submit(event()).json()["total_events"] == 1


@pytest.mark.parametrize("payload", [
    {"events": []},
    {"events": [event(kind="other")]},
    {"events": [event(process="HR_SALARY")]},
    {"events": [event(step="confidential")]},
    {"events": [dict(event(), employee_name="Private person")]},
    {"events": [dict(event(), event_id="not-a-uuid")]},
    {"events": [event() for _ in range(13)]},
    {"events": [event()], "source": "secret"},
])
def test_invalid_events_and_personal_fields_are_rejected(payload):
    assert client.post("/api/simulate", json=payload, headers=ORIGIN).status_code == 422


def test_wrong_origin_rejected():
    assert submit(event(), headers={"Origin": "https://attacker.test"}).status_code == 403


def test_wrong_content_type_rejected():
    r = client.post("/api/simulate", content="nope", headers={"Content-Type": "text/plain"})
    assert r.status_code == 415


def test_huge_body_rejected():
    r = client.post("/api/simulate", content="x" * 5000, headers={"Content-Type": "application/json"})
    assert r.status_code == 413


def test_preflight_allows_only_portfolio():
    good = client.options("/api/simulate", headers={
        "Origin": "https://gustavormartins.vercel.app",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type",
    })
    assert good.status_code == 200
    assert good.headers["access-control-allow-origin"] == "https://gustavormartins.vercel.app"
    bad = client.options("/api/simulate", headers={
        "Origin": "https://malicious.test",
        "Access-Control-Request-Method": "POST",
    })
    assert "access-control-allow-origin" not in bad.headers


def test_no_sensitive_metadata():
    r = submit(event())
    body = r.json()
    assert "employee" not in str(body).lower()
    assert body["mode"] == "stateless-synthetic-python"
