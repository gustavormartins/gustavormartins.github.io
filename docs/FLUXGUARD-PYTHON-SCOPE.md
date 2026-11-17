# FluxGuard — projeto Python para o portfólio

**Status:** escopo proposto; implementação não iniciada.

## O problema

Equipes precisam descobrir atrasos, gargalos e falhas recorrentes em processos. No MVP, vamos usar **dados totalmente sintéticos** para evitar qualquer exposição de dados corporativos.

## MVP verificável

1. Endpoint `POST /v1/events` recebe evento com ID, processo, etapa, timestamp, estado e correlação.
2. Validação Pydantic, idempotência por `event_id` e armazenamento PostgreSQL.
3. Worker simples de cálculo de SLA e identificação de eventos fora do prazo.
4. Endpoints `GET /v1/metrics` e `GET /v1/incidents` agregam indicadores e incidentes.
5. Dashboard Next.js mostra throughput, lead time e indicadores por etapa.
6. Gerador local de eventos sintéticos reproduz cenários normais e atrasados.
7. Testes Pytest para idempotência, SLA e isolamento entre processos.
8. Docker Compose para API + banco + gerador + frontend; CI executa testes.

## Arquitetura

```text
Synthetic event generator
        |
        v
FastAPI + Pydantic -- PostgreSQL
        |
   SLA calculator
        |
  /metrics & /incidents
        |
   Next.js dashboard
```

## Escopo inicial e limites

- Iniciar com ingestão HTTP. MQTT pode entrar **depois** de um caso de uso demonstrável.
- Nada de credenciais, bases ou dados internos da Energisa.
- Sem dizer "tempo real" no material de apresentação antes de haver atualização periódica validada.
- Medir dados de benchmark após implementação; não inventar ganhos percentuais ou escalabilidade.
- Não criar um grande frontend antes de estabilizar os contratos da API.

## Iterações

**Fase 1:** Python + FastAPI + SQLite para testes e regras de SLA.

**Fase 2:** PostgreSQL, idempotência, Docker Compose e CI.

**Fase 3:** métricas e dashboard Next.js com filtros, incidentes e demonstração gravada.

**Fase 4 (opcional):** MQTT, websocket, observabilidade e carga.

## Resultado para o portfólio

Um case público com arquitetura, documentação OpenAPI, testes, demonstração com dados falsos e lista transparente de limitações — mostrando competência de backend de forma honesta.
