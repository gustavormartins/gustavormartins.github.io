import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Braces, Code2, Database, Gauge, ShieldCheck, Terminal } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { OpsLensLive } from '@/components/OpsLensLive';
import './opslens.css';

export const metadata: Metadata = {
  title: 'Blohsh OpsLens — demonstração Python FastAPI',
  description: 'Envie eventos fictícios e explore indicadores reais calculados por uma API Python FastAPI: métricas de SLA, falhas e incidentes.',
  alternates: { canonical: '/opslens/' },
  openGraph: {
    title: 'Blohsh OpsLens — Python ao vivo no portfólio',
    description: 'Um dashboard para explorar respostas reais de uma API FastAPI usando somente dados sintéticos.',
    url: '/opslens/',
    type: 'website',
  },
};

export default function OpsLensShowcase() {
  return (
    <div className="opslens-page">
      <a href="#simulador" className="skip">Pular para a demonstração</a>
      <header className="opslens-page-header">
        <div className="container opslens-page-header-inner">
          <BrandLogo/>
          <nav aria-label="Navegação do OpsLens">
            <Link href="/#python-lab"><ArrowLeft size={15} aria-hidden="true"/> PORTFÓLIO</Link>
            <Link href="/recrutador/">MODO RECRUTADOR <ArrowUpRight size={14} aria-hidden="true"/></Link>
          </nav>
        </div>
      </header>
      <main>
        <section className="container opslens-hero">
          <span className="opslens-eyebrow"><span className="opslens-hero-dot"/> LIVE PYTHON / BACKEND DEMONSTRATION</span>
          <h1>Ops<span>Lens.</span></h1>
          <p className="opslens-hero-sub">Não é um gráfico animado. <em>É uma resposta do Python.</em></p>
          <p className="opslens-hero-description">Simule eventos de processos fictícios e acompanhe métricas calculadas por uma API FastAPI: cumprimento de SLA, duração média e incidentes. Selecione um cenário, envie-o ao backend e veja os resultados reais da execução.</p>
          <div className="opslens-hero-chips"><span>PYTHON</span><span>FASTAPI</span><span>VALIDAÇÃO</span><span>HTTP / JSON</span><span>TESTES</span></div>
        </section>

        <section id="simulador" className="container opslens-main" aria-label="Simulador conectado à API Python">
          <OpsLensLive/>
          <p className="opslens-main-note"><ShieldCheck size={16} aria-hidden="true"/> Essa demonstração só recebe códigos e cenários sintéticos predefinidos. Não envie dados empresariais ou pessoais. A API pública não persiste informações entre requisições.</p>
        </section>

        <section className="container opslens-explain">
          <div className="opslens-explain-head"><span>01 / O QUE ESTÁ ACONTECENDO</span><h2>Do evento<br/><em>à análise.</em></h2><p>O navegador organiza o lote fictício. O Python valida cada entrada, aplica as regras do OpsLens e devolve indicadores que o dashboard apresenta.</p></div>
          <div className="opslens-architecture">
            <div><span>01</span><Braces size={23} aria-hidden="true"/><h3>Requisição JSON</h3><p>Um evento fictício e a lista atual são enviados por HTTP POST.</p></div>
            <div><span>02</span><Terminal size={23} aria-hidden="true"/><h3>Validação FastAPI</h3><p>Pydantic restringe o esquema, os identificadores e o tamanho do lote.</p></div>
            <div><span>03</span><Gauge size={23} aria-hidden="true"/><h3>Regras de SLA</h3><p>O motor Python calcula durações, cumprimento de prazos e falhas.</p></div>
            <div><span>04</span><Database size={23} aria-hidden="true"/><h3>Resposta sem banco</h3><p>As métricas voltam ao visitante. Nada fica salvo no servidor público.</p></div>
          </div>

          <div className="opslens-source-panel">
            <div><span>BACKEND / AUDITÁVEL</span><h3>Veja a implementação.</h3><p>O código público mostra a API de demonstração, seus testes e o MVP local original com SQLite. São dois ambientes com finalidades diferentes.</p></div>
            <div className="opslens-source-actions">
              <a href="https://github.com/gustavormartins/gustavormartins.github.io/blob/main/labs/opslens/opslens/demo_api.py" target="_blank" rel="noopener noreferrer"><Code2 size={16} aria-hidden="true"/> CÓDIGO DA API PÚBLICA <ArrowUpRight size={15} aria-hidden="true"/></a>
              <a href="https://github.com/gustavormartins/gustavormartins.github.io/tree/main/labs/opslens" target="_blank" rel="noopener noreferrer">MVP LOCAL + TESTES <ArrowUpRight size={15} aria-hidden="true"/></a>
            </div>
          </div>
          <p className="opslens-disclosure">Limites: esta é uma API estateless de cálculo com até 12 eventos sintéticos por requisição; não há autenticação, persistência, integração industrial, telemetria real nem rate limiting distribuído. Para uso com dados de clientes seria necessário acrescentar autenticação, quotas, infraestrutura de dados e controles operacionais.</p>
        </section>
      </main>
      <footer className="opslens-page-footer"><div className="container"><Link href="/">GM / BLOHSH</Link><span>PYTHON · PROCESSOS · TESTES</span><Link href="/recrutador/">AVALIAR PERFIL TÉCNICO <ArrowUpRight size={14} aria-hidden="true"/></Link></div></footer>
    </div>
  );
}
