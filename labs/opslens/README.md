# Blohsh OpsLens — FastAPI MVP

Protótipo **local e sintético** de observabilidade de processos. Recebe eventos, registra apenas dados de demonstração, calcula violações de SLA e oferece métricas e incidentes por processo.

**Status:** MVP de API e testes, sem autenticação, dashboard ou publicação em servidor. Não enviar dados reais, pessoais ou corporativos. Esta pasta é uma incubadora até a criação de um repositório próprio.

## Rodar localmente

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e '.[test]'
uvicorn opslens.api:app --host 127.0.0.1 --port 8000
```

A documentação interativa fica em `http://127.0.0.1:8000/docs`. Execute os testes com `pytest -q`.

## Exemplo de ingestão

```bash
curl -X POST http://127.0.0.1:8000/v1/events \
  -H 'Content-Type: application/json' \
  -d '{"event_id":"00000000-0000-4000-8000-000000000001","process_id":"LINE_01","step":"assembly","occurred_at":"2026-11-17T09:00:00Z","duration_seconds":240,"sla_seconds":180,"outcome":"completed"}'
curl http://127.0.0.1:8000/v1/metrics
curl http://127.0.0.1:8000/v1/incidents
```

- `POST /v1/events`: idempotente por UUID; replay igual retorna 200, colisão com payload diferente retorna 409.
- `GET /v1/metrics`: quantidade, violações, falhas, duração média e conformidade de SLA.
- `GET /v1/incidents`: incidentes classificados como `sla_breached` ou `process_failed`, com limite de 1 a 100.
- `GET /health`: verificação local.

## Limitações e próximos marcos

Uso de SQLite em arquivo local e operações síncronas: adequado para protótipo, não para ingestão de alto volume. Sem autenticação, rate limiting, multiusuário, dashboards, métricas temporais, reprocessamento ou filas. Antes de publicar uma API real, adicionar autenticação, quotas, PostgreSQL, migrações, testes de integração e configuração segura.

Todo exemplo é fictício. O código não inclui nem deve receber dados privados de clientes ou empregadores.

