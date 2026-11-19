"""Vercel FastAPI entrypoint for the restricted, synthetic-only live demo.

The original SQLite-backed OpsLens app is deliberately NOT exported here.
"""
from opslens.demo_api import app

__all__ = ["app"]
