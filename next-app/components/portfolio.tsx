"use client";

import { useState } from "react";
import { motion, MotionConfig, useReducedMotion, useScroll, useSpring } from "motion/react";

type Project = {
  id: string;
  number: string;
  category: string;
  name: string;
  status: string;
  description: string;
  problem: string;
  solution: string;
  next: string;
  stack: string[];
  repo?: string;
  accent: "green" | "mint" | "amber";
};

const projects: Project[] = [
  {
    id: "blohshblast",
    number: "01",
    category: "GAME DEVELOPMENT / PWA",
    name: "BlohshBlast",
    status: "Funcional · em evolução",
    description: "Um puzzle de blocos com identidade própria, interações por toque e teclado e uma camada de produto que vai além da partida.",
    problem: "Criar uma mecânica de puzzle acessível em diferentes dispositivos, sem perder desempenho ou responsividade.",
    solution: "Tabuleiro 8×8, quatro modos, progressão, skins, estatísticas locais e experiência instalável como PWA.",
    next: "Consolidar os testes e avaliar ranking sincronizado. Ainda não existe uma demo pública estável verificada.",
    stack: ["JavaScript", "TypeScript", "PWA", "Game logic"],
    repo: "https://github.com/gustavormartins/blohshblast.github.io",
    accent: "green",
  },
  {
    id: "salinha",
    number: "02",
    category: "LINUX / TROUBLESHOOTING",
    name: "Salinha Linux Compat Kit",
    status: "Ferramenta comunitária",
    description: "Diagnósticos e caminhos de compatibilidade para executar um AppImage em ambientes Linux com Wayland, XWayland e FUSE.",
    problem: "Falhas de execução e mensagens gráficas difíceis de reproduzir e diagnosticar.",
    solution: "Lançador Bash, seleção de backend, extração temporária quando FUSE falha e verificações de DNS/HTTPS.",
    next: "Ampliar os testes em diferentes distribuições. A falha de rede original ainda não foi comprovadamente resolvida.",
    stack: ["Linux", "Bash", "Wayland", "AppImage"],
    repo: "https://github.com/gustavormartins/salinha-linux-compat-kit",
    accent: "mint",
  },
  {
    id: "replica",
    number: "03",
    category: "RUST / DESKTOP ENGINEERING",
    name: "Replica Audio Player",
    status: "Bootstrap · não funcional",
    description: "Uma aplicação nativa Linux em construção, pensada para música local e manutenção confiável desde o primeiro commit.",
    problem: "Estudar os desafios de separar UI, reprodução, metadados e persistência em software desktop nativo.",
    solution: "Estrutura inicial Rust, CI, linting com Clippy, testes e auditoria de dependências configurados.",
    next: "Implementar a primeira janela GTK4/Libadwaita, reprodução local e persistência. Esses recursos ainda não existem.",
    stack: ["Rust", "Linux", "CI/CD", "GTK4 planejado"],
    repo: "https://github.com/gustavormartins/Replica-audio-player",
    accent: "amber",
  },
];

const reveal = {
  initial: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0 },
};
const rawScreenshot =
  "https://raw.githubusercontent.com/gustavormartins/gustavormartins.github.io/b5fad07b7f1a6788d612ad8bf0dec159478b46ee/assets/projects/blohshblast-gameplay.png";

function Arrow({ size = 15 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 18 18 5M7 5h11v11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Screen({ id }: { id: string }) {
  if (id === "blohshblast") {
    return (
      <div className="screen screen-game">
        <div className="screen-toolbar"><span className="led" /> RECORDED GAMEPLAY <span className="screen-extra">SOURCE-BASED / NO MOCKUP</span></div>
        {/* Captured from the real repository, pinned to an immutable Git commit. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={rawScreenshot} alt="BlohshBlast em uma partida real com tabuleiro verde e peças disponíveis" loading="eager" />
        <span className="screen-footnote">Captura autêntica do jogo executado</span>
      </div>
    );
  }

  if (id === "salinha") {
    const steps = [
      ["01", "DETECT", "KDE / WAYLAND"],
      ["02", "BACKEND", "XWAYLAND"],
      ["03", "FALLBACK", "FUSE / APPRUN"],
      ["04", "DIAGNOSE", "DNS / HTTPS / LOGS"],
    ];
    return (
      <div className="screen terminal-screen">
        <div className="screen-toolbar"><span className="led" /> SALINHA-COMPAT <span className="screen-extra">PIPELINE / CONCEPT</span></div>
        <div className="terminal-content">
          <span className="terminal-prompt">blohsh@linux ~ $ ./salinha-kde-compat.sh</span>
          <p className="terminal-note">Representação explicativa do fluxo documentado; não é saída real do script.</p>
          {steps.map(([n, label, value]) => (
            <div className="terminal-step" key={n}><span>{n}</span><b>{label}</b><em>{value}</em></div>
          ))}
          <span className="terminal-caret" aria-hidden="true">▌</span>
        </div>
      </div>
    );
  }

  return (
    <div className="screen replica-screen">
      <div className="screen-toolbar"><span className="led amber-led" /> REPLICA / ARCHITECTURE <span className="screen-extra">WIP / RUST</span></div>
      <div className="replica-art">
        <div className="replica-record"><div className="record-center" /></div>
        <div className="replica-arch">
          <span className="micro-label">RUST / LINUX / LOCAL-FIRST</span>
          <strong>Foundation first.</strong>
          <p>A arquitetura antes da interface.</p>
          <div className="arch-bar"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
          <div className="arch-chips"><span>CI ✓</span><span>Clippy ✓</span><span>GTK4 PLANNED</span></div>
        </div>
      </div>
      <span className="screen-footnote">Conceito visual — não representa um player funcional</span>
    </div>
  );
}

function ProjectCard({ project, index, active, onSelect, quiet }: { project: Project; index: number; active: boolean; onSelect: () => void; quiet: boolean }) {
  return (
    <motion.button
      type="button"
      className={`project-tab ${active ? "is-active" : ""}`}
      onClick={onSelect}
      aria-pressed={active}
      whileHover={quiet ? undefined : { x: 5 }}
      transition={{ duration: .2 }}
    >
      <span className="project-tab-index">{project.number} / 0{projects.length}</span>
      <span className="project-tab-label"><strong>{project.name}</strong><small>{project.category}</small></span>
      <span className="project-tab-icon" aria-hidden="true">{active ? "↗" : "+"}</span>
    </motion.button>
  );
}

function WorkSection({ quiet }: { quiet: boolean }) {
  const [selected, setSelected] = useState(0);
  const current = projects[selected];

  return (
    <section id="work" className="section work-section">
      <div className="section-header"><span className="section-index">02 / SELECTED WORK</span><h2>Projetos que <em>contam histórias.</em></h2><p>Menos quantidade. Mais contexto, decisões e resultados verificáveis.</p></div>
      <div className="work-layout">
        <div className="work-nav" aria-label="Selecionar projeto de destaque">
          {projects.map((project, i) => <ProjectCard key={project.id} project={project} index={i} active={i === selected} onSelect={() => setSelected(i)} quiet={quiet} />)}
          <a className="work-nav-all" href="https://github.com/gustavormartins" target="_blank" rel="noreferrer">Ver GitHub completo <Arrow /></a>
        </div>
        <motion.article key={current.id} className="work-showcase" initial={quiet ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .38 }}>
          <div className="showcase-top"><span>{current.category}</span><span className={`status-pill status-${current.accent}`}>{current.status}</span></div>
          <Screen id={current.id} />
          <div className="showcase-copy">
            <div><span className="eyebrow">CASE {current.number}</span><h3>{current.name}</h3><p>{current.description}</p></div>
            <div className="project-explanation">
              <div><span>DESAFIO</span><p>{current.problem}</p></div>
              <div><span>ABORDAGEM</span><p>{current.solution}</p></div>
              <div><span>PRÓXIMO PASSO</span><p>{current.next}</p></div>
            </div>
            <div className="tag-row">{current.stack.map(tag => <span key={tag}>{tag}</span>)}</div>
            {current.repo && <a className="text-link" href={current.repo} target="_blank" rel="noreferrer">Explorar repositório <Arrow /></a>}
          </div>
        </motion.article>
      </div>
    </section>
  );
}

export function Portfolio() {
  const quiet = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: .001 });
  const entrance = quiet ? { duration: 0 } : { duration: .72, ease: "easeOut" as const };

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">Pular para o conteúdo</a>
      <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />
      <div className="ambient ambient-1" aria-hidden="true" /><div className="ambient ambient-2" aria-hidden="true" />
      <header className="site-nav">
        <a className="wordmark" href="#home" aria-label="Gustavo Martins, início">GM<span>.</span> <small> / BLOHSH®</small></a>
        <nav aria-label="Menu principal"><a href="#about">Sobre</a><a href="#work">Projetos</a><a href="#lab">Laboratório</a></nav>
        <a className="contact-shortcut" href="mailto:gustavoromaom178@hotmail.com">CONTATO <Arrow size={13} /></a>
      </header>

      <main id="main">
        <section id="home" className="hero section">
          <motion.div className="hero-copy" initial={quiet ? false : "initial"} animate="show" transition={{ staggerChildren: quiet ? 0 : .14 }}>
            <motion.div variants={reveal} transition={entrance} className="hero-kicker"><span className="led" /> AVAILABLE FOR COLLABORATIONS <span> · PORTFOLIO / 2026</span></motion.div>
            <motion.h1 variants={reveal} transition={entrance}>Penso em sistemas.<br /><span>Construo</span> <i>possibilidades.</i></motion.h1>
            <motion.p variants={reveal} transition={entrance} className="hero-description">Sou Gustavo. Transformo problemas em soluções digitais, com atenção à engenharia, ao comportamento das interfaces e ao universo Linux.</motion.p>
            <motion.div variants={reveal} transition={entrance} className="hero-actions">
              <a className="cta-primary" href="#work">Explorar projetos <Arrow /></a>
              <a className="cta-secondary" href="#about">Minha abordagem <span>↓</span></a>
            </motion.div>
          </motion.div>
          <div className="hero-composition" aria-hidden="true">
            <div className="composition-orbit orbit-one" /><div className="composition-orbit orbit-two" />
            <div className="composition-cross">+</div>
            <div className="composition-core"><span>G</span><span>M</span></div>
            <div className="composition-tag tag-top">01 / ENGINEERING</div>
            <div className="composition-tag tag-bottom">SYSTEMS · DESIGN · CODE</div>
          </div>
          <div className="hero-bottom"><span>SCROLL TO EXPLORE</span><div className="hero-scroll-line" /><span>BASED IN BRAZIL</span></div>
        </section>

        <div className="ticker" aria-label="Tecnologias e áreas de interesse"><div className="ticker-track" aria-hidden="true">{Array.from({length:2},(_,i)=><span key={i}>SOFTWARE ENGINEERING <b>✳</b> LINUX <b>✳</b> PYTHON <b>✳</b> INTERACTIVE EXPERIENCES <b>✳</b> OPEN SOURCE <b>✳</b></span>)}</div></div>

        <section id="about" className="section about-section">
          <div className="section-index">01 / THE APPROACH</div>
          <div className="about-layout">
            <h2>Não é só <em>sobre código.</em></h2>
            <div><p>Gosto de entender por que as coisas falham, o que pode ser automatizado e como transformar uma necessidade em um produto que realmente funcione.</p>
            <div className="about-steps"><span>01 — INVESTIGAR</span><span>02 — CONSTRUIR</span><span>03 — VALIDAR</span></div></div>
          </div>
        </section>

        <WorkSection quiet={quiet} />

        <section id="lab" className="section lab-section">
          <span className="section-index">03 / WHAT'S NEXT</span>
          <div className="lab-heading"><h2>Próximo experimento.<br /><em>Python em produção.</em></h2><span className="lab-stage">CONCEITO / A IMPLEMENTAR</span></div>
          <div className="lab-grid">
            <div><span className="eyebrow">PROJECT PROPOSAL / FLUXGUARD</span><h3>Observabilidade de processos, do evento à decisão.</h3><p>Uma API Python que recebe eventos fictícios de processos industriais, identifica atrasos de SLA e expõe indicadores em tempo real. Dados sintéticos, sem informações corporativas.</p>
            <div className="tag-row"><span>Python</span><span>FastAPI</span><span>PostgreSQL</span><span>Pytest</span><span>Next.js</span></div>
            <p className="project-disclosure">Este é um projeto novo em planejamento. Nenhuma funcionalidade está sendo apresentada como pronta.</p></div>
            <div className="lab-terminal" aria-label="Exemplo ilustrativo de eventos processados pelo FluxGuard"><div className="screen-toolbar">FLUXGUARD / CONCEPT TERMINAL <span className="screen-extra">NO LIVE DATA</span></div><div><span>$ process-monitor --simulate</span><p>event.received <b>ASSEMBLY / LINE-01</b></p><p>sla.check <b>target: 120m</b></p><p>anomaly.detected <b>threshold exceeded</b></p><p>dashboard.status <b>prototype pending</b></p></div></div>
          </div>
        </section>

        <footer className="footer"><span>© 2026 GUSTAVO MARTINS · BLOHSH®</span><span>BUILT WITH PURPOSE / NOT JUST EFFECTS</span><a href="https://github.com/gustavormartins" target="_blank" rel="noreferrer">GITHUB <Arrow size={12} /></a></footer>
      </main>
    </MotionConfig>
  );
}
