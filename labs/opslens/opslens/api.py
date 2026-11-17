"""Local-only FastAPI MVP for synthetic process event observability.

No production data, credentials, real-time claims, or external services.
"""
from __future__ import annotations

import json
import sqlite3
from contextlib import asynccontextmanager, contextmanager
from datetime import datetime
from pathlib import Path
from typing import Annotated, Iterator, Literal
from uuid import UUID

from fastapi import FastAPI, HTTPException, Query, Response, status
from pydantic import BaseModel, ConfigDict, Field, field_validator


class ProcessEvent(BaseModel):
    model_config = ConfigDict(extra="forbid")

    event_id: UUID
    process_id: str = Field(min_length=2, max_length=64, pattern=r"^[A-Za-z0-9_-]+$")
    step: str = Field(min_length=2, max_length=64, pattern=r"^[A-Za-z0-9_-]+$")
    occurred_at: datetime
    duration_seconds: int = Field(ge=0, le=86400)
    sla_seconds: int = Field(ge=1, le=86400)
    outcome: Literal["completed", "failed"]

    @field_validator("occurred_at")
    @classmethod
    def require_timezone(cls, value: datetime) -> datetime:
        if value.tzinfo is None or value.utcoffset() is None:
            raise ValueError("occurred_at must include a timezone offset")
        return value


class IngestResult(BaseModel):
    event_id: UUID
    accepted: bool
    replayed: bool
    incident: bool
    reasons: list[str]


def incident_reasons(event: ProcessEvent) -> list[str]:
    reasons: list[str] = []
    if event.duration_seconds > event.sla_seconds:
        reasons.append("sla_breached")
    if event.outcome == "failed":
        reasons.append("process_failed")
    return reasons


def _connect(path: str) -> sqlite3.Connection:
    connection = sqlite3.connect(path, timeout=5)
    connection.row_factory = sqlite3.Row
    return connection


@contextmanager
def database(path: str) -> Iterator[sqlite3.Connection]:
    connection = _connect(path)
    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()


def _initialize(path: str) -> None:
    if path != ":memory:":
        Path(path).parent.mkdir(parents=True, exist_ok=True)
    with database(path) as conn:
        conn.execute("""
        CREATE TABLE IF NOT EXISTS events (
          event_id TEXT PRIMARY KEY,
          process_id TEXT NOT NULL,
          step TEXT NOT NULL,
          occurred_at TEXT NOT NULL,
          duration_seconds INTEGER NOT NULL,
          sla_seconds INTEGER NOT NULL,
          outcome TEXT NOT NULL,
          reasons TEXT NOT NULL,
          payload TEXT NOT NULL
        )
        """)
        conn.execute("CREATE INDEX IF NOT EXISTS events_by_process ON events(process_id)")


def create_app(database_path: str = "./opslens.sqlite3") -> FastAPI:
    if database_path == ":memory:":
        raise ValueError("Use a temporary database file rather than :memory: for per-request connections")

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        _initialize(database_path)
        yield

    app = FastAPI(
        title="Blohsh OpsLens (Synthetic MVP)",
        version="0.1.0",
        description="Local-only prototype. Never ingest organizational or personal data.",
        lifespan=lifespan,
    )

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok", "mode": "local-synthetic"}

    @app.post("/v1/events", response_model=IngestResult, status_code=status.HTTP_201_CREATED)
    def ingest(event: ProcessEvent, response: Response) -> IngestResult:
        serialized = json.dumps(event.model_dump(mode="json"), sort_keys=True, separators=(",", ":"))
        reasons = incident_reasons(event)
        with database(database_path) as conn:
            row = conn.execute("SELECT payload, reasons FROM events WHERE event_id = ?", (str(event.event_id),)).fetchone()
            if row:
                if row["payload"] != serialized:
                    raise HTTPException(status_code=409, detail="event_id already exists with a different payload")
                response.status_code = status.HTTP_200_OK
                return IngestResult(event_id=event.event_id, accepted=True, replayed=True,
                                    incident=bool(json.loads(row["reasons"])), reasons=json.loads(row["reasons"]))
            conn.execute("""INSERT INTO events
                (event_id, process_id, step, occurred_at, duration_seconds, sla_seconds, outcome, reasons, payload)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (str(event.event_id), event.process_id, event.step,
                 event.occurred_at.isoformat(), event.duration_seconds,
                 event.sla_seconds, event.outcome, json.dumps(reasons), serialized))
        return IngestResult(event_id=event.event_id, accepted=True, replayed=False,
                            incident=bool(reasons), reasons=reasons)

    @app.get("/v1/metrics")
    def metrics(process_id: str | None = Query(default=None, max_length=64)) -> dict:
        where = "WHERE process_id = ?" if process_id is not None else ""
        params = (process_id,) if process_id is not None else ()
        with database(database_path) as conn:
            row = conn.execute(f"""SELECT count(*) AS total,
                coalesce(sum(CASE WHEN duration_seconds > sla_seconds THEN 1 ELSE 0 END), 0) AS breached,
                coalesce(sum(CASE WHEN outcome = 'failed' THEN 1 ELSE 0 END), 0) AS failed,
                avg(duration_seconds) AS average_seconds
                FROM events {where}""", params).fetchone()
            grouped = conn.execute(f"""SELECT process_id, count(*) AS total,
                sum(CASE WHEN duration_seconds > sla_seconds OR outcome = 'failed' THEN 1 ELSE 0 END) AS incidents
                FROM events {where} GROUP BY process_id ORDER BY process_id""", params).fetchall()
        total = row["total"]
        return {"total_events": total, "sla_breached": row["breached"],
                "failed": row["failed"], "average_duration_seconds": round(row["average_seconds"] or 0, 2),
                "sla_compliance_percent": round(100 * (total - row["breached"]) / total, 2) if total else None,
                "by_process": [{"process_id": item["process_id"], "total": item["total"],
                                "incidents": item["incidents"]} for item in grouped]}

    @app.get("/v1/incidents")
    def incidents(limit: Annotated[int, Query(ge=1, le=100)] = 50,
                  process_id: str | None = Query(default=None, max_length=64)) -> dict:
        where = "WHERE reasons != '[]'"
        params: list = []
        if process_id is not None:
            where += " AND process_id = ?"
            params.append(process_id)
        params.append(limit)
        with database(database_path) as conn:
            items = conn.execute(f"""SELECT event_id, process_id, step, occurred_at, reasons
                FROM events {where} ORDER BY occurred_at DESC, event_id LIMIT ?""", params).fetchall()
        return {"items": [{"event_id": e["event_id"], "process_id": e["process_id"],
                           "step": e["step"], "occurred_at": e["occurred_at"],
                           "reasons": json.loads(e["reasons"])} for e in items]}

    return app


app = create_app()

