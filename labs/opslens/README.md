# Blohsh OpsLens — FastAPI MVP

Protótipo **local e sintético** de observabilidade de processos. Recebe eventos, registra apenas dados de demonstração, calcula violações de SLA e oferece métricas e incidentes por processo.

**Dois ambientes, com responsabilidades diferentes:** o MVP original usa SQLite local e continua **sem autenticação nem publicação para ingestão real**. A demonstração pública em `https://gustavormartins.vercel.app/opslens/` usa outra aplicação FastAPI (`opslens/demo_api.py`), **sem banco, sem persistência e limitada a cenários sintéticos enumerados**. Ela mostra cálculos reais de SLA, falhas e métricas, mas não substitui a API local para dados de operações.

Nunca enviar dados reais, pessoais ou corporativos para qualquer uma das demos.

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


## API pública de demonstração (FastAPI stateless)

Projeto Vercel separado: `blohsh-opslens-api`. Endpoint público:
`https://blohsh-opslens-api.vercel.app/api/simulate`.

Aceita exclusivamente POST com JSON no formato abaixo:

```json
{
  "events": [
    {
      "event_id": "00000000-0000-4000-8000-000000000001",
      "process_id": "DEMO_01",
      "step": "assembly",
      "kind": "sla"
    }
  ]
}
```

- `process_id`: apenas `DEMO_01` e `DEMO_02`.
- `step`: `assembly`, `inspection` ou `dispatch`.
- `kind`: `completed`, `sla` ou `failed`.
- São aceitos no máximo 12 eventos fictícios por lote. O serviço valida UUIDs e rejeita campos adicionais.
- A aplicação usa o modelo `ProcessEvent` e a função `incident_reasons` do MVP original para calcular SLA e falhas.
- Reenvios com UUID e conteúdo iguais são idempotentes dentro do lote. Mesmo UUID com outro conteúdo retorna conflito (409).
- Respostas trazem total, conformidade de SLA, duração média, falhas, contagem por processo e incidentes.
- **Sem persistência:** cada requisição recalcula tudo a partir do lote enviado; a API não lê nem grava SQLite. Ela não oferece autenticação de usuário nem quotas distribuídas, por isso **não é apropriada para dados reais**.
- CORS permite o domínio público do portfólio e dois endereços localhost para testes; CORS é proteção de navegador, não autenticação.

### Como testar a demo em Python

```bash
cd labs/opslens
python -m pip install -e '.[test]'
python -m pytest -q
uvicorn app:app --host 127.0.0.1 --port 8000
```

No projeto de demonstração, `GET /health` identifica o serviço e `POST /api/simulate` calcula os indicadores. O arquivo `app.py` é o entrypoint do deploy FastAPI. A API pública só deve receber dados sintéticos.

O teste de conectividade via internet pode ser repetido da raiz do repositório com `python scripts/check_opslens_public.py`. A interface Next.js possui teste de navegador em `scripts/test_opslens_live.mjs`, que verifica os valores retornados pelo backend real nas larguras 1440, 390 e 320 px.

Para avançar a um serviço real será preciso construir autenticação, limites de requisições por cliente, armazenamento persistente autorizado, gestão de segredos e monitoramento operacional.
