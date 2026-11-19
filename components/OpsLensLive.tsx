'use client';

import { useCallback, useEffect, useState } from 'react';
import { Activity, AlertTriangle, ArrowRight, CheckCircle2, CircleAlert, Play, RotateCcw, Server, ShieldCheck, Wifi, WifiOff } from 'lucide-react';

const API_URL = 'https://blohsh-opslens-api.vercel.app';
const MAX_EVENTS = 12;

type Kind = 'completed' | 'sla' | 'failed';
type Step = 'assembly' | 'inspection' | 'dispatch';
type ProcessId = 'DEMO_01' | 'DEMO_02';
type Connection = 'checking' | 'online' | 'offline';
type SyntheticEvent = { event_id: string; process_id: ProcessId; step: Step; kind: Kind };
type Row = { event_id: string; process_id: ProcessId; step: Step; duration_seconds: number; sla_seconds: number; reasons: string[]; outcome: string; kind: Kind };
type Snapshot = {
  mode: string; total_events: number; sla_breached: number; failed: number;
  average_duration_seconds: number; sla_compliance_percent: number;
  by_process: { process_id: string; total: number; incidents: number }[];
  incidents: { event_id: string; process_id: string; step: string; reasons: string[]; duration_seconds: number; sla_seconds: number }[];
  last_event: Row;
};

const PRESETS: { kind: Kind; title: string; description: string; code: string }[] = [
  { kind: 'completed', title: 'Operação normal', description: 'Concluída dentro do SLA', code: 'SUCCESS / 200' },
  { kind: 'sla', title: 'Atraso de SLA', description: 'Processamento acima do limite', code: 'SLA / ALERT' },
  { kind: 'failed', title: 'Falha de processo', description: 'Execução interrompida', code: 'FAIL / INCIDENT' },
];
const STEPS: { value: Step; label: string }[] = [
  { value: 'assembly', label: 'Montagem' },
  { value: 'inspection', label: 'Inspeção' },
  { value: 'dispatch', label: 'Despacho' },
];
const REASON_LABELS: Record<string, string> = {
  sla_breached: 'SLA excedido',
  process_failed: 'Processo falhou',
};

function formatNum(n: number | undefined, suffix = '') {
  return n === undefined ? '—' : n.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + suffix;
}

function describeError(error: unknown) {
  if (error instanceof Error && error.name === 'AbortError') return 'A API demorou para responder. Tente novamente.';
  return 'Não foi possível acessar a API Python. Nenhum evento foi registrado. Você pode tentar novamente.';
}

export function OpsLensLive() {
  const [connection, setConnection] = useState<Connection>('checking');
  const [selectedProcess, setSelectedProcess] = useState<ProcessId>('DEMO_01');
  const [selectedStep, setSelectedStep] = useState<Step>('assembly');
  const [events, setEvents] = useState<SyntheticEvent[]>([]);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [lastAction, setLastAction] = useState('');

  const checkConnection = useCallback(async () => {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 12000);
    setConnection('checking');
    try {
      const response = await fetch(API_URL + '/health', { method: 'GET', cache: 'no-store', signal: ctrl.signal });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const health: { status?: string; mode?: string; storage?: string } = await response.json();
      if (health.status !== 'ok' || health.mode !== 'stateless-synthetic-python' || health.storage !== 'none') {
        throw new Error('Unexpected API response');
      }
      setConnection('online');
      setError('');
    } catch {
      setConnection('offline');
    } finally {
      clearTimeout(timeout);
    }
  }, []);

  useEffect(() => { void checkConnection(); }, [checkConnection]);

  const send = async (kind: Kind) => {
    if (busy || events.length >= MAX_EVENTS) return;
    const nextEvent: SyntheticEvent = {
      event_id: crypto.randomUUID(),
      process_id: selectedProcess,
      step: selectedStep,
      kind,
    };
    const next = [...events, nextEvent];
    setBusy(true);
    setError('');
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 15000);
    try {
      const response = await fetch(API_URL + '/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ events: next }),
        signal: ctrl.signal,
      });
      if (!response.ok) throw new Error('API responded ' + response.status);
      const result: Snapshot = await response.json();
      if (result.mode !== 'stateless-synthetic-python' || result.total_events !== next.length) {
        throw new Error('Unrecognized backend response');
      }
      setEvents(next);
      setSnapshot(result);
      setConnection('online');
      setLastAction(PRESETS.find(item => item.kind === kind)?.title ?? 'Evento');
    } catch (reason) {
      setError(describeError(reason));
      setConnection('offline');
    } finally {
      clearTimeout(timeout);
      setBusy(false);
    }
  };

  const reset = () => {
    setEvents([]);
    setSnapshot(null);
    setLastAction('');
    setError('');
  };

  const limitReached = events.length >= MAX_EVENTS;

  return (
    <div className="opslens-live">
      <div className="opslens-console-header">
        <div className="opslens-console-title"><span className="opslens-heartbeat"/><Server size={17} aria-hidden="true"/> BLOHSH / OPSLENS <small>Python runtime · FastAPI</small></div>
        <div className={'opslens-connect opslens-connect-' + connection} role="status" aria-live="polite">
          {connection === 'online' ? <Wifi size={15}/> : <WifiOff size={15}/>}
          {connection === 'online' ? 'API CONECTADA' : connection === 'checking' ? 'VERIFICANDO API' : 'API INDISPONÍVEL'}
        </div>
      </div>
      <div className="opslens-console-body">
        <div className="opslens-config">
          <div><span className="opslens-field-label">PROCESSO SINTÉTICO</span>
            <div className="opslens-switches" role="group" aria-label="Selecione a linha fictícia">
              {(['DEMO_01', 'DEMO_02'] as ProcessId[]).map(id => <button key={id} type="button" className={selectedProcess === id ? 'active' : ''} aria-pressed={selectedProcess === id} onClick={() => setSelectedProcess(id)} disabled={busy}>{id.replace('_',' ')}</button>)}
            </div>
          </div>
          <div><label className="opslens-field-label" htmlFor="opslens-step">ETAPA DO PROCESSO</label>
            <select id="opslens-step" value={selectedStep} onChange={e => setSelectedStep(e.target.value as Step)} disabled={busy}>
              {STEPS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="opslens-config-status"><ShieldCheck size={18} aria-hidden="true"/> Somente cenários fictícios. Nada é salvo no servidor.</div>
        </div>

        <div className="opslens-presets" aria-label="Enviar evento à API Python">
          {PRESETS.map((item, i) => (
            <button key={item.kind} type="button" className={'opslens-preset opslens-preset-' + item.kind} onClick={() => void send(item.kind)} disabled={busy || limitReached} aria-label={'Enviar: ' + item.title}>
              <span className="opslens-preset-top"><span>{String(i + 1).padStart(2,'0')} / {item.code}</span><ArrowRight size={16} aria-hidden="true"/></span>
              <strong>{item.title}</strong>
              <small>{item.description}</small>
              <span className="opslens-preset-action"><Play size={12} aria-hidden="true"/> {busy ? 'CALCULANDO…' : 'ENVIAR À API'}</span>
            </button>
          ))}
        </div>

        <div className="opslens-results" aria-live="polite">
          <div className="opslens-section-label"><Activity size={15} aria-hidden="true"/> MÉTRICAS CALCULADAS NO PYTHON <span>{snapshot ? 'ÚLTIMO: ' + lastAction.toUpperCase() : 'AGUARDANDO EVENTOS'}</span></div>
          <div className="opslens-metrics">
            <div><small>EVENTOS</small><strong>{formatNum(snapshot?.total_events)}</strong><span>amostra atual</span></div>
            <div><small>SLA ATENDIDO</small><strong>{formatNum(snapshot?.sla_compliance_percent, '%')}</strong><span>taxa calculada</span></div>
            <div><small>ALERTAS SLA</small><strong>{formatNum(snapshot?.sla_breached)}</strong><span>fora do prazo</span></div>
            <div><small>FALHAS</small><strong>{formatNum(snapshot?.failed)}</strong><span>execuções com erro</span></div>
          </div>
          <div className="opslens-detail-grid">
            <div className="opslens-detail">
              <h3>Distribuição por processo</h3>
              {snapshot?.by_process.length ? snapshot.by_process.map(row => (
                <div className="opslens-bar-row" key={row.process_id}>
                  <div><span>{row.process_id}</span><strong>{row.total} evento(s) · {row.incidents} incidente(s)</strong></div>
                  <div className="opslens-bar-track"><span style={{ width: (row.total / snapshot.total_events * 100) + '%' }}/></div>
                </div>
              )) : <p className="opslens-no-data">Envie um evento para visualizar os indicadores.</p>}
              <div className="opslens-average">DURAÇÃO MÉDIA <strong>{formatNum(snapshot?.average_duration_seconds, ' s')}</strong></div>
            </div>
            <div className="opslens-detail">
              <h3>Incidentes detectados</h3>
              {snapshot?.incidents.length ? <div className="opslens-incidents">{snapshot.incidents.slice(0, 5).map(item => (
                <div className="opslens-incident" key={item.event_id}>
                  <CircleAlert size={16} aria-hidden="true"/>
                  <div><strong>{item.reasons.map(reason => REASON_LABELS[reason] ?? reason).join(' + ')}</strong><span>{item.process_id} / {item.step} · {item.duration_seconds}s / SLA {item.sla_seconds}s</span></div>
                </div>
              ))}</div> : <p className="opslens-no-data">{snapshot ? 'Nenhuma violação encontrada nesta amostra.' : 'Sem incidentes para exibir.'}</p>}
            </div>
          </div>
        </div>

        <div className="opslens-footer">
          <div><span className="opslens-field-label">EVENTOS DESTA SESSÃO</span><p>{events.length} / {MAX_EVENTS}. {limitReached ? 'Limite da demonstração atingido; reinicie para continuar.' : 'Até 12 eventos por simulação. Dados não persistidos.'}</p></div>
          <button type="button" className="opslens-reset" onClick={reset} disabled={busy || (!events.length && !error)}><RotateCcw size={15} aria-hidden="true"/> REINICIAR SESSÃO</button>
        </div>
        {connection === 'offline' && <div className="opslens-api-warning" role="alert"><AlertTriangle size={17} aria-hidden="true"/><span>Não foi possível confirmar a API. Esta página não inventa resultados offline.</span><button type="button" onClick={() => void checkConnection()} disabled={busy}>TENTAR CONEXÃO</button></div>}
        {error && <p className="opslens-api-warning" role="alert"><AlertTriangle size={17} aria-hidden="true"/>{error}</p>}
        <div className="opslens-engineering"><CheckCircle2 size={14} aria-hidden="true"/> Os indicadores vêm do FastAPI: o navegador só exibe as respostas. API sem banco, login ou dados reais.</div>
        <details className="opslens-payload-preview">
          <summary>Ver o JSON enviado à API</summary>
          <pre>{JSON.stringify({ events }, null, 2)}</pre>
        </details>
      </div>
    </div>
  );
}
