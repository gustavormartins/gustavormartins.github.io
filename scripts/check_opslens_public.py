"""Read-only public smoke test + one synthetic scenario request.

Verifies deployment, real Python calculations, Origin/CORS and safety limits.
Only entirely fictitious test IDs are sent, and the endpoint is stateless.
"""
import json
from urllib.error import HTTPError
from urllib.request import Request, urlopen
from uuid import uuid4

BASE = "https://blohsh-opslens-api.vercel.app"
ORIGIN = "https://gustavormartins.vercel.app"


def request(path, method="GET", payload=None, origin=ORIGIN):
    headers = {"Origin": origin, "Accept": "application/json"}
    if payload is not None:
        headers["Content-Type"] = "application/json"
    data = json.dumps(payload).encode() if payload is not None else None
    req = Request(BASE + path, method=method, data=data, headers=headers)
    try:
        with urlopen(req, timeout=25) as r:
            body = r.read()
            return r.status, r.headers, json.loads(body)
    except HTTPError as err:
        raw = err.read()
        try:
            decoded = json.loads(raw)
        except ValueError:
            decoded = {"raw": raw[:120].decode("utf-8", errors="replace")}
        return err.code, err.headers, decoded


status, headers, health = request("/health")
print("HEALTH", status, health)
assert status == 200, "Python API health is unavailable"
assert health["mode"] == "stateless-synthetic-python"
assert health["storage"] == "none"

events = [
    {"event_id": str(uuid4()), "process_id": "DEMO_01", "step": "assembly", "kind": "completed"},
    {"event_id": str(uuid4()), "process_id": "DEMO_01", "step": "inspection", "kind": "sla"},
    {"event_id": str(uuid4()), "process_id": "DEMO_02", "step": "dispatch", "kind": "failed"},
]
status, headers, result = request("/api/simulate", method="POST", payload={"events": events})
print("PYTHON_METRICS", status, result)
assert status == 200, "Synthetic simulation endpoint failed"
assert result["mode"] == "stateless-synthetic-python"
assert (result["total_events"], result["sla_breached"], result["failed"]) == (3, 1, 1)
assert len(result["incidents"]) == 2
assert result["sla_compliance_percent"] == 66.67
assert headers.get("x-opslens-engine") == "fastapi-python"
assert headers.get("access-control-allow-origin") == ORIGIN

status, _, invalid = request("/api/simulate", method="POST", payload={"events": [
    {"event_id": str(uuid4()), "process_id": "PERSON_NAME", "step": "assembly", "kind": "failed"}
]})
print("UNSAFE_EVENT_REJECTED", status)
assert status == 422, "Unsafe process identifiers must be rejected"

status, _, reject_origin = request("/api/simulate", method="POST", payload={"events": events}, origin="https://unknown.test")
print("ORIGIN_REJECTED", status)
assert status == 403

print("OPSLENS_PUBLIC_API_OK")
