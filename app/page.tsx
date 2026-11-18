'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';
import { ContactFunnel } from '@/components/ContactFunnel';
import { motion, MotionConfig, useScroll, useSpring } from 'motion/react';
import { ArrowDown, ArrowRight, ArrowUpRight, AudioLines, CheckCircle2, Code2, Menu, Monitor, Terminal, X } from 'lucide-react';

type Panel = 'code' | 'process';
const ease = [0.22, 1, 0.36, 1] as const;

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -35px 0px' }}
      transition={{ duration: 0.68, delay, ease }}
    >{children}</motion.div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: '#sobre', text: 'Sobre' },
    { href: '#trabalhos', text: 'Projetos' },
    { href: '#processo', text: 'Processo' },
    { href: '#python-lab', text: 'Python Lab' },
    { href: '#contato', text: 'Contato' },
    { href: '/recrutador/', text: 'Recrutadores' }
  ];
  return (
    <header className="site-header">
      <nav className="container nav-inner" aria-label="Navegação principal">
        <BrandLogo />
        <div className="desktop-nav">{links.map(l => <a key={l.href} href={l.href}>{l.text}</a>)}</div>
        <Link className="nav-action" href="/recrutador/">MODO RECRUTADOR <ArrowUpRight size={15} aria-hidden="true" /></Link>
        <button className="mobile-nav-toggle" type="button" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Fechar menu' : 'Abrir menu'} onClick={() => setOpen(v => !v)}>{open ? <X size={22}/> : <Menu size={22}/>}</button>
      </nav>
      {open && <div className="mobile-nav-panel" id="mobile-nav">{links.map(l => <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.text}<ArrowUpRight size={15}/></a>)}</div>}
    </header>
  );
}

function ConsolePreview() {
  const [panel, setPanel] = useState<Panel>('code');
  return (
    <div className="console-card">
      <div className="console-bar"><span className="console-dots"><i/><i/><i/></span><span className="console-filename">~/gustavo/portfolio</span><span className="console-state"><span className="pulse-dot" /> ACTIVE</span></div>
      <div className="console-tabs" role="tablist" aria-label="Visualização do processo">
        <button role="tab" id="tab-code" aria-controls="panel-code" aria-selected={panel === 'code'} onClick={() => setPanel('code')}>01 / CODE</button>
        <button role="tab" id="tab-process" aria-controls="panel-process" aria-selected={panel === 'process'} onClick={() => setPanel('process')}>02 / PROCESS</button>
      </div>
      {panel === 'code' ? <div className="console-screen" id="panel-code" role="tabpanel" aria-labelledby="tab-code">
        <div><span className="line-no">01</span><span className="token-blue">const</span> developer = <span className="token-cyan">{'{'}</span></div>
        <div><span className="line-no">02</span>  name: <span className="token-green">&apos;Gustavo&apos;</span>,</div>
        <div><span className="line-no">03</span>  focus: <span className="token-green">&apos;software engineering&apos;</span>,</div>
        <div><span className="line-no">04</span>  stack: [<span className="token-green">&apos;Linux&apos;</span>, <span className="token-green">&apos;Rust&apos;</span>, <span className="token-green">&apos;Python&apos;</span>],</div>
        <div><span className="line-no">05</span>  mindset: <span className="token-green">&apos;solve &amp; improve&apos;</span></div>
        <div><span className="line-no">06</span><span className="token-cyan">{'}'}</span>;</div>
        <div className="console-command"><span>➜</span> git status <span className="console-caret">_</span></div>
        <p className="console-output">On branch: building-better-solutions</p>
      </div> : <div className="console-screen process-screen" id="panel-process" role="tabpanel" aria-labelledby="tab-process">
        <div className="process-line"><span>01</span><strong>Diagnosticar</strong><small>Entender o cenário</small></div>
        <div className="process-line"><span>02</span><strong>Desenvolver</strong><small>Implementar com propósito</small></div>
        <div className="process-line"><span>03</span><strong>Validar</strong><small>Testar, documentar, evoluir</small></div>
      </div>}
      <div className="console-footer"><Code2 size={14}/><span>IDEA → IMPLEMENTATION</span><span className="console-footer-right">LINUX / WEB</span></div>
    </div>
  );
}

function ReplicaIllustration() {
  return <div className="replica-visual" role="img" aria-label="Ilustração conceitual de arquitetura do Replica: núcleo Rust, interface GTK4 e reprodução ainda planejadas">
    <div className="replica-toolbar"><span className="replica-dots"><i/><i/><i/></span><span>Replica / architecture</span><span className="replica-wip">WIP</span></div>
    <div className="replica-content">
      <div className="vinyl"><div/></div>
      <div className="replica-track"><span>LOCAL-FIRST / LINUX</span><strong>Rust core</strong><div className="equalizer">{Array.from({length:19}).map((_,i)=><i key={i} style={{height:(7+(i*13%25))+'px'}}/>)}</div><small>GTK4 · Audio engine · SQLite</small></div>
    </div>
    <span className="replica-caption">CONCEPT PREVIEW — NÃO É UM PLAYER FUNCIONAL</span>
  </div>;
}

function SalinhaDiagram() {
  const steps = [
    ['01','ENVIRONMENT','KDE · Wayland'],
    ['02','BACKEND','XWayland'],
    ['03','FALLBACK','AppImage / FUSE'],
    ['04','DIAGNOSE','Logs · DNS · HTTPS']
  ];
  return <div className="linux-diagram" aria-label="Fluxo técnico ilustrativo do Salinha Linux Compat Kit">
    <div className="linux-title"><Terminal size={14}/><span>salinha-compat.sh</span><small>diagnostic flow</small></div>
    <div className="linux-steps">{steps.map(([n,title,desc],i)=><motion.div key={n} className="linux-step" initial={{opacity:0,y:15}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.4}} transition={{duration:.42,delay:i*.09,ease}}><span>{n}</span><strong>{title}</strong><small>{desc}</small></motion.div>)}</div>
    <p>FLUXO DOCUMENTADO · NÃO REPRESENTA UMA EXECUÇÃO REAL</p>
  </div>;
}


// This is a local, synthetic UI demonstration, NOT a live API connection.
const demoEvents = [
  { event: "EVT-001", stage: "ASSEMBLY", duration: "98s", sla: "120s", type: "NORMAL", message: "Etapa dentro do prazo estabelecido", incident: false },
  { event: "EVT-002", stage: "INSPECTION", duration: "184s", sla: "120s", type: "SLA BREACHED", message: "Duração ultrapassou o SLA sintético", incident: true },
  { event: "EVT-003", stage: "PACKAGING", duration: "45s", sla: "120s", type: "PROCESS FAILED", message: "Falha fictícia reportada no processo", incident: true },
] as const;

function OpsLensDemo() {
  const [position, setPosition] = useState(0);
  const current = demoEvents[position];
  return (
    <div className="ops-panel" aria-label="Simulador sintético do OpsLens">
      <div className="ops-head">
        <span><span className="ops-led" aria-hidden="true" /> BLOHSH / OPSLENS</span>
        <small>DEMO LOCAL · DADOS FICTÍCIOS</small>
      </div>
      <div className="ops-body">
        <span className="ops-mini-label">EVENTO SELECIONADO / 0{position + 1}</span>
        <motion.div key={current.event} initial={{opacity:0,y:9}} animate={{opacity:1,y:0}} transition={{duration:.3}} className="ops-event" role="status" aria-live="polite" aria-atomic="true">
          <div className="ops-event-heading"><strong>{current.event}</strong><span className={current.incident ? "ops-alert" : "ops-success"}>{current.type}</span></div>
          <div className="ops-meter"><span style={{width: current.incident ? "96%" : "60%"}} /></div>
          <div className="ops-data"><span>STEP <b>{current.stage}</b></span><span>DURATION <b>{current.duration}</b></span><span>SLA <b>{current.sla}</b></span></div>
          <p>{current.message}</p>
        </motion.div>
        <button className="ops-next" type="button" onClick={() => setPosition(p => (p + 1) % demoEvents.length)}>
          SIMULAR PRÓXIMO EVENTO <ArrowRight size={15} aria-hidden="true" />
        </button>
        <p className="ops-disclaimer">Painel demonstrativo no navegador. Não recebe eventos reais nem está conectado à API local.</p>
      </div>
    </div>
  );
}

function Portfolio() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 150, damping: 30, restDelta: 0.001 });
  return (
    <MotionConfig reducedMotion="user">
      <a href="#conteudo" className="skip">Pular para o conteúdo</a>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <div className="ambient-grid" aria-hidden="true"><div className="ambient-orb"/></div>
      <Header />
      <main id="conteudo">
        <section id="sobre" className="hero container">
          <div className="hero-copy">
            <motion.div className="eyebrow" initial={{ opacity:0, y:12 }} animate={{opacity:1,y:0}} transition={{duration:.55}}><span className="eyebrow-line"/> SOFTWARE / LINUX / EXPERIÊNCIAS DIGITAIS</motion.div>
            <motion.h1 aria-label="Do problema ao código." initial={{opacity:0,y:48}} animate={{opacity:1,y:0}} transition={{duration:.86,ease}}><span>Do problema</span><br/><span>ao <em>código.</em></span></motion.h1>
            <motion.p className="hero-description" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.7,delay:.2}}>Sou Gustavo Martins. Exploro engenharia de software, automação e Linux para transformar problemas reais em soluções que fazem sentido.</motion.p>
            <motion.div className="hero-actions" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.7,delay:.3}}>
              <a href="#trabalhos" className="btn btn-primary">EXPLORAR PROJETOS <ArrowUpRight size={18}/></a>
              <a href="https://github.com/gustavormartins" target="_blank" rel="noopener noreferrer" className="btn btn-secondary"><Code2 size={18}/> GITHUB</a>
            </motion.div>
            <Link href="/recrutador/" className="hero-recruiter-link"><span>RECRUTANDO?</span> ACESSE O PERFIL TÉCNICO EM 60 SEGUNDOS <ArrowUpRight size={15} aria-hidden="true"/></Link>
            <div className="hero-bottom"><span><span className="live-dot"/> ENGINEERING IN PROGRESS</span><a href="#trabalhos">SCROLL TO EXPLORE <ArrowDown size={15}/></a></div>
          </div>
          <motion.div className="hero-preview" initial={{opacity:0,x:45,rotate:2}} animate={{opacity:1,x:0,rotate:0}} transition={{duration:.9,delay:.22,ease}}>
            <ConsolePreview />
            <div className="hero-preview-label">01 / DEVELOPMENT WORKSPACE</div>
          </motion.div>
        </section>

        <div className="manifesto-band" aria-label="Áreas de atuação"><div className="manifesto-inner">ENGINEERING <span>✳</span> OPEN SOURCE <span>✳</span> PROBLEM SOLVING <span>✳</span> DIGITAL EXPERIENCES <span>✳</span> ENGINEERING <span>✳</span> OPEN SOURCE <span>✳</span></div></div>

        <section id="trabalhos" className="section-block container">
          <Reveal className="section-header"><div><div className="section-index">01 / WORK</div><h2>Projetos que <em>contam histórias.</em></h2></div><p>Uma curadoria de código, decisões e desafios. Menos quantidade, mais profundidade.</p></Reveal>
          <div className="work-grid">
            <Reveal className="work-card game-card">
              <div className="work-head"><span>01 / GAME DEVELOPMENT</span><span className="status-dot">FUNCIONAL / EVOLUÇÃO</span></div>
              <div className="game-card-grid">
                <div className="work-copy"><h3>Blohsh<span className="green">Blast.</span></h3><p>Um puzzle 8×8 que evoluiu para uma experiência com modos de jogo, progressão e recursos PWA.</p><div className="metrics"><div><strong>8 × 8</strong><small>GRID</small></div><div><strong>4</strong><small>MODOS</small></div><div><strong>PWA</strong><small>OFFLINE</small></div></div><div className="chip-row"><span>JavaScript</span><span>Game Logic</span><span>Web</span></div><div className="card-links"><Link className="game-play-link" href="/jogar/">▶ JOGAR DEMONSTRAÇÃO <ArrowUpRight size={15}/></Link><Link href="/cases/#blohshblast">ESTUDO DE CASO <ArrowUpRight size={15}/></Link><a href="https://github.com/gustavormartins/blohshblast.github.io" target="_blank" rel="noopener noreferrer">REPOSITÓRIO <Code2 size={14}/></a></div></div>
                <div className="screenshot-wrap"><div className="window-caption"><span className="live-dot"/> ORIGINAL GAMEPLAY <span>REAL CAPTURE</span></div><img src="/assets/projects/blohshblast-gameplay.png" alt="Captura real do tabuleiro do jogo BlohshBlast com blocos verdes durante uma partida" width="1160" height="780" loading="eager"/><small>Captura realizada a partir da interface do projeto.</small></div>
              </div>
            </Reveal>
            <Reveal className="work-card secondary-card" delay={.08}>
              <div className="work-head"><span>02 / LINUX · OPEN SOURCE</span><span>DIAGNOSTIC</span></div><h3>Salinha Linux<br/><em>Compat Kit.</em></h3><p>Kit comunitário para diagnosticar AppImage e problemas de inicialização no KDE/Wayland, com logs e fallback de montagem.</p><SalinhaDiagram/><div className="chip-row"><span>Bash</span><span>Linux</span><span>FUSE</span><span>XWayland</span></div><div className="card-links"><Link href="/cases/#salinha">ABRIR CASE <ArrowUpRight size={15}/></Link><a href="https://github.com/gustavormartins/salinha-linux-compat-kit" target="_blank" rel="noopener noreferrer">CÓDIGO <Code2 size={14}/></a></div>
            </Reveal>
            <Reveal className="work-card secondary-card" delay={.16}>
              <div className="work-head"><span>03 / RUST · LINUX</span><span className="wip-status">EARLY DEVELOPMENT</span></div><h3>Replica<br/><em>Audio Player.</em></h3><p>Um laboratório de arquitetura desktop nativa com Rust. O bootstrap e as verificações de CI já existem; reprodução e interface GTK4 ainda estão planejadas.</p><ReplicaIllustration/><div className="chip-row"><span>Rust</span><span>CI / Clippy</span><span>GTK4 planejado</span></div><div className="card-links"><Link href="/cases/#replica">ARQUITETURA E ROADMAP <ArrowUpRight size={15}/></Link><a href="https://github.com/gustavormartins/Replica-audio-player" target="_blank" rel="noopener noreferrer">CÓDIGO <Code2 size={14}/></a></div>
            </Reveal>
          </div>
        </section>

        <section id="processo" className="section-block process-section">
          <div className="container">
            <Reveal className="section-header"><div><div className="section-index">02 / MINDSET</div><h2>O processo faz<br/><em>parte da solução.</em></h2></div><p>Da hipótese à entrega: construir também significa entender limites e registrar aprendizados.</p></Reveal>
            <div className="process-grid">
              {[['01','Entender','Diagnosticar a situação, reproduzir o erro e encontrar a pergunta certa.'],['02','Construir','Escolher a arquitetura e o código que resolvem o problema sem complexidade desnecessária.'],['03','Evoluir','Testar, medir, documentar e melhorar sem maquiar o estágio do projeto.']].map(([n,title,desc],i)=>
                <Reveal className="process-item" key={n} delay={i*.08}><span>{n} /</span><h3>{title}<span className="green">.</span></h3><p>{desc}</p><ArrowUpRight size={22} className="process-arrow" aria-hidden="true"/></Reveal>)}
            </div>
          </div>
        </section>

        <section id="python-lab" className="section-block container python-section">
          <Reveal className="python-panel">
            <div className="python-info"><div className="section-index">03 / NEXT EXPERIMENT</div><span className="plan-badge">MVP LOCAL — AINDA NÃO PUBLICADO</span><h2>Python com<br/><em>problema real.</em></h2><p>O <strong>Blohsh OpsLens</strong> é um MVP local em FastAPI que recebe eventos sintéticos, aplica regras de SLA, evita duplicações e retorna métricas consultáveis. A API passou em <strong>17 testes locais</strong>; ainda não há deploy público nem autenticação para uso em produção.</p><div className="chip-row"><span>Python</span><span>FastAPI</span><span>SQLite</span><span>Pytest</span><span>Idempotência</span></div><a className="ops-source-link" href="https://github.com/gustavormartins/gustavormartins.github.io/tree/feature/portfolio-next-motion/labs/opslens" target="_blank" rel="noopener noreferrer">EXPLORAR O CÓDIGO DA API <ArrowUpRight size={15} /></a></div>
            <OpsLensDemo />
          </Reveal>
        </section>

        <section id="contato" className="contact-section">
          <div className="container">
            <Reveal>
              <div className="section-index">04 / LET'S BUILD</div>
              <div className="contact-intro">
                <div>
                  <h2>Tem uma ideia?<br/><em>Vamos construir.</em></h2>
                  <p>Precisa de um site, uma automação ou alguém para seu time? Escolha o tipo de contato e receba um e-mail pronto para revisar e enviar.</p>
                </div>
                <div className="contact-recruiter-note">
                  <span>PARA CLIENTES E RECRUTADORES</span>
                  <strong>Do problema à conversa.</strong>
                  <p>Compartilhe o contexto. Eu prefiro entender o desafio antes de falar de solução.</p>
                  <Link href="/recrutador/" className="contact-recruiter-profile">AVALIAR PERFIL PARA VAGAS <ArrowUpRight size={14} aria-hidden="true"/></Link>
                </div>
              </div>
              <ContactFunnel />
              <div className="contact-proof">
                <div className="contact-proof-header"><span>ANTES DE ENTRAR EM CONTATO</span><strong>Veja como eu trabalho.</strong></div>
                <a href="/cases/" className="contact-proof-link"><span><strong>Estudos de caso</strong><small>Desafios, decisões e limites documentados</small></span><ArrowUpRight size={17} aria-hidden="true"/></a>
                <a href="https://github.com/gustavormartins" target="_blank" rel="noopener noreferrer" className="contact-proof-link"><span><strong>Código público</strong><small>Repositórios e histórico de desenvolvimento</small></span><ArrowUpRight size={17} aria-hidden="true"/></a>
                <a href="https://github.com/gustavormartins/gustavormartins.github.io/tree/main/labs/opslens" target="_blank" rel="noopener noreferrer" className="contact-proof-link"><span><strong>Python em prática</strong><small>API experimental, testes e documentação</small></span><ArrowUpRight size={17} aria-hidden="true"/></a>
              </div>
              <div className="contact-social">
                <p>Prefere uma conversa profissional por outra plataforma?</p>
                <div className="contact-actions">
                  <a href="https://www.linkedin.com/in/gustavoromaomartins2005/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">LINKEDIN <ArrowUpRight size={17}/></a>
                  <a href="https://github.com/gustavormartins" target="_blank" rel="noopener noreferrer" className="btn btn-secondary"><Code2 size={17}/> GITHUB</a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <footer className="site-footer"><div className="container footer-inner"><span>GM. / BLOHSH®</span><span>DESIGNED &amp; DEVELOPED WITH PURPOSE</span><span>© 2026</span></div></footer>
    </MotionConfig>
  );
}

export default Portfolio;
