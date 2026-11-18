import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDownRight, ArrowLeft, ArrowUpRight, BriefcaseBusiness, CheckCircle2, Code2, FileText, Github, Mail, Terminal, Workflow } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { PrintProfileButton } from '@/components/PrintProfileButton';
import './recruiter.css';

export const metadata: Metadata = {
  title: 'Para recrutadores — perfil técnico e projetos',
  description: 'Gustavo Martins: perfil para recrutamento em desenvolvimento de software. Python/FastAPI, Linux, desenvolvimento web e estudos de caso com código verificável.',
  alternates: { canonical: '/recrutador/' },
  openGraph: {
    title: 'Gustavo Martins — perfil técnico em 60 segundos',
    description: 'Projetos públicos, habilidades demonstradas e um convite direto para entrevista.',
    url: '/recrutador/',
    type: 'website'
  }
};

const invitationUrl = '/?demanda=recruitment#contato';

const projects = [
  {
    index: '01', kicker: 'PYTHON / BACKEND',
    name: 'Blohsh OpsLens',
    status: 'MVP LOCAL / EM EVOLUÇÃO',
    summary: 'API experimental que recebe eventos fictícios, valida dados e aplica regras de SLA, com armazenamento SQLite e testes automatizados.',
    evidence: ['FastAPI e validação', 'Idempotência de eventos', '17 testes de API'],
    repo: 'https://github.com/gustavormartins/gustavormartins.github.io/tree/main/labs/opslens',
    linkText: 'VER CÓDIGO E TESTES'
  },
  {
    index: '02', kicker: 'LINUX / TROUBLESHOOTING',
    name: 'Salinha Linux Compat Kit',
    status: 'FERRAMENTA COMUNITÁRIA',
    summary: 'Kit de diagnóstico e execução para AppImage, com análise de Wayland/XWayland, fallback de FUSE e registros de problemas de execução.',
    evidence: ['Bash e logs', 'AppImage / FUSE', 'Relatório técnico'],
    repo: 'https://github.com/gustavormartins/salinha-linux-compat-kit',
    linkText: 'VER PROJETO E DOCUMENTAÇÃO'
  },
  {
    index: '03', kicker: 'JAVASCRIPT / INTERAÇÃO',
    name: 'BlohshBlast',
    status: 'JOGO FUNCIONAL / EM EVOLUÇÃO',
    summary: 'Jogo de puzzle 8×8, com lógica de blocos, modos de partida e progressão. Projeto que reúne estado, interações, experiência visual e PWA.',
    evidence: ['Lógica de jogo', 'Interface responsiva', 'PWA e interação'],
    repo: 'https://github.com/gustavormartins/blohshblast.github.io',
    linkText: 'VER CÓDIGO DO JOGO'
  }
];

const competencies = [
  {
    group: 'BACKEND E AUTOMAÇÃO',
    items: ['Python', 'FastAPI', 'REST APIs', 'Pytest', 'SQL / SQLite'],
    comment: 'Evidência: OpsLens, com ingestão de eventos simulados e testes.',
    href: 'https://github.com/gustavormartins/gustavormartins.github.io/tree/main/labs/opslens'
  },
  {
    group: 'SISTEMAS E DIAGNÓSTICO',
    items: ['Linux', 'Bash', 'AppImage', 'Wayland / XWayland', 'Logs'],
    comment: 'Evidência: Salinha Linux Compat Kit e relatório de diagnóstico.',
    href: 'https://github.com/gustavormartins/salinha-linux-compat-kit'
  },
  {
    group: 'WEB E ENGENHARIA',
    items: ['JavaScript', 'Next.js', 'HTML / CSS', 'Git / GitHub', 'CI'],
    comment: 'Evidência: este portfólio Next.js, BlohshBlast e workflows.',
    href: 'https://github.com/gustavormartins/gustavormartins.github.io'
  }
];

export default function RecruiterMode() {
  return (
    <div className="recruiter-page">
      <a className="skip" href="#perfil">Pular para o perfil profissional</a>
      <div className="recruiter-ambient" aria-hidden="true" />
      <header className="recruiter-header">
        <div className="container recruiter-header-inner">
          <BrandLogo />
          <nav aria-label="Navegação do perfil para recrutadores" className="recruiter-top-nav">
            <Link href="/"><ArrowLeft size={15} aria-hidden="true" /> PORTFÓLIO</Link>
            <a href="#evidencias">PROJETOS</a>
            <Link className="recruiter-nav-cta" href={invitationUrl}>CONVIDAR PARA ENTREVISTA <ArrowUpRight size={15} aria-hidden="true"/></Link>
          </nav>
          <Link className="recruiter-header-mobile" href={invitationUrl}>CONVIDAR <ArrowUpRight size={15} aria-hidden="true"/></Link>
        </div>
      </header>

      <main id="perfil">
        <div className="container recruiter-hero">
          <div className="recruiter-hero-main">
            <span className="recruiter-kicker"><span className="recruiter-signal" aria-hidden="true"/> RECRUITER VIEW / LEITURA RÁPIDA</span>
            <h1>Do problema<br/>ao <em>código.</em></h1>
            <p className="recruiter-hero-lead">
              Sou <strong>Gustavo Martins</strong>. Atuo em processos e operações e desenvolvo projetos públicos para aprofundar minha prática em software, backend, automação e Linux.
            </p>
            <p className="recruiter-hero-subtitle">
              Busco oportunidades para crescer em desenvolvimento de software, contribuindo com investigação técnica, aprendizado contínuo e código documentado.
            </p>
            <div className="recruiter-actions">
              <Link href={invitationUrl} className="recruiter-button recruiter-button-primary">CONVIDAR PARA ENTREVISTA <ArrowUpRight size={17} aria-hidden="true"/></Link>
              <PrintProfileButton/>
            </div>
            <div className="recruiter-public-links" aria-label="Perfis profissionais">
              <a href="https://github.com/gustavormartins" target="_blank" rel="noopener noreferrer"><Github size={16} aria-hidden="true"/> GITHUB <ArrowUpRight size={13} aria-hidden="true"/></a>
              <a href="https://www.linkedin.com/in/gustavoromaomartins2005/" target="_blank" rel="noopener noreferrer"><BriefcaseBusiness size={16} aria-hidden="true"/> LINKEDIN <ArrowUpRight size={13} aria-hidden="true"/></a>
              <Link href="/cases/"><Code2 size={16} aria-hidden="true"/> ESTUDOS DE CASO <ArrowUpRight size={13} aria-hidden="true"/></Link>
            </div>
          </div>
          <aside className="recruiter-summary" aria-label="Resumo profissional">
            <div className="recruiter-window-header"><span><i/><i/><i/></span><strong>candidate.profile</strong><small>01 / SUMMARY</small></div>
            <div className="recruiter-summary-content">
              <span className="recruiter-code-comment">// O essencial em 60 segundos</span>
              <div className="recruiter-summary-line"><span>FOCO</span><strong>Desenvolvimento de software</strong></div>
              <div className="recruiter-summary-line"><span>PRÁTICA</span><strong>Python · Linux · Web</strong></div>
              <div className="recruiter-summary-line"><span>EXPERIÊNCIA</span><strong>Processos e operações</strong></div>
              <div className="recruiter-summary-line"><span>PROJETOS</span><strong>Backend · Sistemas · Interfaces</strong></div>
              <div className="recruiter-summary-tags"><span>INVESTIGAR</span><span>CONSTRUIR</span><span>VALIDAR</span></div>
              <div className="recruiter-summary-note"><CheckCircle2 size={16} aria-hidden="true"/><span>Competências vinculadas a evidências de código e documentação.</span></div>
            </div>
          </aside>
        </div>

        <div className="container recruiter-stats" aria-label="Indicadores de portfólio">
          <div><strong>03</strong><span>Projetos para avaliar</span></div>
          <div><strong>17</strong><span>Testes do OpsLens*</span></div>
          <div><strong>01</strong><span>Portfólio com código público</span></div>
          <p>*Testes registrados no MVP do OpsLens; não são uma certificação ou avaliação externa de desempenho.</p>
        </div>

        <section className="container recruiter-section" id="experiencia">
          <div className="recruiter-section-heading"><span>01 / CONTEXTO</span><h2>Experiência que conversa<br/><em>com desenvolvimento.</em></h2></div>
          <div className="recruiter-experience-grid">
            <div className="recruiter-experience-card">
              <span className="recruiter-card-eyebrow">ATUAÇÃO PROFISSIONAL</span>
              <h3>Energisa</h3>
              <p className="recruiter-experience-role">Jovem Aprendiz · Processos e operações</p>
              <p>Contato com organização de processos, análise de informações e demandas operacionais. Uso esse repertório para pensar software a partir de problemas práticos.</p>
            </div>
            <div className="recruiter-experience-card">
              <span className="recruiter-card-eyebrow">APRENDIZAGEM PROFISSIONAL</span>
              <h3>SENAI</h3>
              <p className="recruiter-experience-role">Gestão Industrial / Processos e Logística</p>
              <p>Formação orientada à melhoria contínua, processos e organização do trabalho. Em paralelo, evoluo projetos públicos em desenvolvimento de software.</p>
            </div>
          </div>
          <p className="recruiter-accuracy">Experiência apresentada conforme o estágio atual de formação e atuação — não equivale a experiência profissional prévia como desenvolvedor contratado.</p>
        </section>

        <section className="container recruiter-section" id="competencias">
          <div className="recruiter-section-heading"><span>02 / HABILIDADES COM EVIDÊNCIAS</span><h2>O que consigo <em>demonstrar.</em></h2><p>Competências organizadas por projeto. O nível de experiência varia entre as tecnologias; os links mostram implementações e documentação.</p></div>
          <div className="recruiter-skills-grid">
            {competencies.map((group, idx) => (
              <article key={group.group} className="recruiter-skills-card">
                <span className="recruiter-card-eyebrow">0{idx + 1} / {group.group}</span>
                <div className="recruiter-skill-tags">{group.items.map(item=><span key={item}>{item}</span>)}</div>
                <p>{group.comment}</p>
                <a href={group.href} target="_blank" rel="noopener noreferrer">VER EVIDÊNCIA <ArrowUpRight size={14} aria-hidden="true"/></a>
              </article>
            ))}
          </div>
        </section>

        <section className="container recruiter-section" id="evidencias">
          <div className="recruiter-section-heading"><span>03 / PROJETOS SELECIONADOS</span><h2>Menos promessas.<br/><em>Mais código.</em></h2><p>Uma amostra organizada para que a avaliação técnica não dependa apenas de uma lista de tecnologias.</p></div>
          <div className="recruiter-projects">
            {projects.map(project => (
              <article className="recruiter-project" key={project.index}>
                <div className="recruiter-project-top"><span>{project.index} / {project.kicker}</span><small>{project.status}</small></div>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
                <div className="recruiter-project-evidence">{project.evidence.map(tag=><span key={tag}>{tag}</span>)}</div>
                <a href={project.repo} target="_blank" rel="noopener noreferrer">{project.linkText} <ArrowUpRight size={15} aria-hidden="true"/></a>
              </article>
            ))}
          </div>
          <div className="recruiter-extra">
            <span><Terminal size={16} aria-hidden="true"/> TAMBÉM EM CONSTRUÇÃO</span>
            <p><strong>Replica Audio Player:</strong> repositório Rust com estrutura e automação de qualidade. A interface GTK4 e a reprodução de áudio ainda não estão implementadas.</p>
            <a href="https://github.com/gustavormartins/Replica-audio-player" target="_blank" rel="noopener noreferrer">VER REPOSITÓRIO <ArrowUpRight size={13} aria-hidden="true"/></a>
          </div>
        </section>

        <section className="recruiter-final" id="entrevista">
          <div className="container recruiter-final-inner">
            <div>
              <span className="recruiter-kicker">04 / NEXT CONVERSATION</span>
              <h2>Uma boa oportunidade<br/><em>começa com diálogo.</em></h2>
              <p>Tem uma vaga ou quer avaliar como meu perfil se encaixa no time? O convite abre um e-mail com assunto e estrutura de recrutamento já selecionados, pronto para você complementar.</p>
            </div>
            <div className="recruiter-final-actions">
              <Link className="recruiter-button recruiter-button-primary" href={invitationUrl}>CONVIDAR PARA ENTREVISTA <Mail size={18} aria-hidden="true"/></Link>
              <PrintProfileButton />
              <span><FileText size={14} aria-hidden="true"/> A impressão permite salvar este resumo em PDF.</span>
            </div>
          </div>
        </section>
      </main>
      <footer className="recruiter-footer">
        <div className="container"><Link href="/">GM. / BLOHSH®</Link><span>PERFIL PROFISSIONAL · 2026</span><a href="https://github.com/gustavormartins" target="_blank" rel="noopener noreferrer">GITHUB <ArrowUpRight size={13} aria-hidden="true"/></a></div>
      </footer>
    </div>
  );
}
