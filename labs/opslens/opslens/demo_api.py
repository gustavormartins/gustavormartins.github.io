"""Public, stateless and synthetic-only FastAPI showcase for OpsLens.

The private/local MVP remains a separate SQLite-backed service.
This showcase accepts *only* enumerated fictitious events and recomputes
all metrics from the supplied batch on each request. No shared database.
"""
from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone
from typing import Literal
from uuid import UUID

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, Field

from opslens.api import ProcessEvent, incident_reasons


class SyntheticEvent(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)

    event_id: UUID
    process_id: Literal["DEMO_01", "DEMO_02"]
    step: Literal["assembly", "inspection", "dispatch"]
    kind: Literal["completed", "sla", "failed"]


class SimulationRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    events: list[SyntheticEvent] = Field(min_length=1, max_length=12)


ALLOWED_ORIGINS = (
    "https://gustavormartins.vercel.app",
    "http://127.0.0.1:4173",
    "http://localhost:4173",
)
SLA_BY_STEP = {"assembly": 180, "inspection": 90, "dispatch": 120}
MAX_BODY_BYTES = 4096


def _as_real_process_event(sample: SyntheticEvent, index: int) -> ProcessEvent:
    """Materialize a valid ProcessEvent using the existing validated model."""
    sla = SLA_BY_STEP[sample.step]
    elapsed = {
        "completed": round(sla * 0.6),
        "sla": round(sla * 1.45),
        "failed": round(sla * 0.82),
    }[sample.kind]
    return ProcessEvent(
        event_id=sample.event_id,
        process_id=sample.process_id,
        step=sample.step,
        occurred_at=datetime.now(timezone.utc) - timedelta(seconds=index),
        duration_seconds=elapsed,
        sla_seconds=sla,
        outcome="failed" if sample.kind == "failed" else "completed",
    )


def calculate_snapshot(samples: list[SyntheticEvent]) -> dict:
    """Pure recomputation: idempotent request payloads and session isolation."""
    seen: dict[UUID, SyntheticEvent] = {}
    events: list[dict] = []
    for index, sample in enumerate(samples):
        previous = seen.get(sample.event_id)
        if previous is not None:
            if previous != sample:
                raise HTTPException(status_code=409, detail="Duplicate event_id with conflicting payload")
            continue
        seen[sample.event_id] = sample
        event = _as_real_process_event(sample, len(events))
        reasons = incident_reasons(event)
        events.append(
            {
                "event_id": str(event.event_id),
                "process_id": event.process_id,
                "step": event.step,
                "duration_seconds": event.duration_seconds,
                "sla_seconds": event.sla_seconds,
                "outcome": event.outcome,
                "kind": sample.kind,
                "reasons": reasons,
            }
        )
    total = len(events)
    breached = sum("sla_breached" in row["reasons"] for row in events)
    failed = sum("process_failed" in row["reasons"] for row in events)
    incidents = [
        {
            "event_id": row["event_id"],
            "process_id": row["process_id"],
            "step": row["step"],
            "reasons": row["reasons"],
            "duration_seconds": row["duration_seconds"],
            "sla_seconds": row["sla_seconds"],
        }
        for row in reversed(events)
        if row["reasons"]
    ]
    by_process = [
        {
            "process_id": process,
            "total": sum(row["process_id"] == process for row in events),
            "incidents": sum(row["process_id"] == process and bool(row["reasons"]) for row in events),
        }
        for process in ("DEMO_01", "DEMO_02")
        if any(row["process_id"] == process for row in events)
    ]
    return {
        "mode": "stateless-synthetic-python",
        "total_events": total,
        "sla_breached": breached,
        "failed": failed,
        "average_duration_seconds": round(sum(row["duration_seconds"] for row in events) / total, 2),
        "sla_compliance_percent": round((total - breached) * 100 / total, 2),
        "by_process": by_process,
        "incidents": incidents,
        "last_event": events[-1],
    }


def create_demo_app() -> FastAPI:
    app = FastAPI(
        title="Blohsh OpsLens — Live Synthetic Python Engine",
        version="0.2.0",
        description="Stateless demonstration. Synthetic event presets only. No accounts, database, or real industrial data.",
        docs_url=None,
        redoc_url=None,
        openapi_url=None,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(ALLOWED_ORIGINS),
        allow_credentials=False,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
        max_age=600,
    )

    @app.middleware("http")
    async def protect_demo(request: Request, call_next):
        origin = request.headers.get("origin")
        if request.method == "POST" and origin and origin not in ALLOWED_ORIGINS:
            return JSONResponse(status_code=403, content={"detail": "Origin not permitted"})
        if request.method == "POST":
            if request.headers.get("content-type", "").split(";", 1)[0].strip().lower() != "application/json":
                return JSONResponse(status_code=415, content={"detail": "application/json required"})
            length = request.headers.get("content-length")
            if length:
                try:
                    if int(length) > MAX_BODY_BYTES:
                        return JSONResponse(status_code=413, content={"detail": "Synthetic demo payload too large"})
                except ValueError:
                    return JSONResponse(status_code=400, content={"detail": "Invalid content length"})
            body = await request.body()
            if len(body) > MAX_BODY_BYTES:
                return JSONResponse(status_code=413, content={"detail": "Synthetic demo payload too large"})
        response = await call_next(request)
        response.headers["Cache-Control"] = "no-store"
        response.headers["X-OpsLens-Engine"] = "fastapi-python"
        return response

    @app.get("/")
    @app.get("/health")
    def health():
        return {
            "status": "ok",
            "mode": "stateless-synthetic-python",
            "storage": "none",
            "max_events_per_request": 12,
        }

    @app.post("/api/simulate")
    def simulate(batch: SimulationRequest):
        return calculate_snapshot(batch.events)

    return app


app = create_demo_app()
