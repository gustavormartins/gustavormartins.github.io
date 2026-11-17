import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Github, Terminal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Estudos de caso',
  description: 'Projetos reais de Gustavo Martins: um puzzle web, um kit comunitário de diagnóstico Linux e um experimento de arquitetura Rust.',
};

const cases = [
  {
    slug: 'blohshblast', number: '01', label: 'GAME DEVELOPMENT / WEB', title: 'BlohshBlast', accent: 'Blast.',
    status: 'FUNCIONAL · EVOLUÇÃO',
    lead: 'Um puzzle 8×8 que cresceu de uma mecânica básica para um experimento completo de interface, progressão e experiência de jogo.',
    aspects: [
      ['O desafio', 'Projetar uma experiência rápida de entender, com interações por mouse e toque e regras previsíveis ao posicionar peças.'],
      ['A implementação', 'Grade 8×8, arrastar e soltar, histórico local, modos Classic/Zen/Hardcore/Daily, progressão, skins, missões e instalação PWA.'],
      ['Limites atuais', 'O ranking e os dados pessoais do jogo são locais ao navegador; não há classificação global sincronizada entre jogadores.']
    ],
    tags: ['JavaScript','CSS','Game Logic','PWA'],
    repo: 'https://github.com/gustavormartins/blohshblast.github.io'
  },
  {
    slug: 'salinha', number: '02', label: 'LINUX / TROUBLESHOOTING', title: 'Salinha Linux', accent: 'Compat Kit.',
    status: 'FERRAMENTA COMUNITÁRIA',
    lead: 'Um conjunto de scripts e documentação para entender falhas de execução AppImage e registrar evidências em ambientes Linux com Wayland.',
    aspects: [
      ['O problema', 'Problemas com FUSE, Vulkan e XWayland impediam o aplicativo de iniciar com consistência e dificultavam a identificação da causa.'],
      ['A abordagem', 'Launcher Bash com seleção de backend, fallback por extração temporária de AppImage e checagens de DNS/HTTPS acompanhadas de logs locais.'],
      ['Limites atuais', 'O kit documenta caminhos de diagnóstico, mas não existe confirmação de que a falha original do serviço de rede tenha sido resolvida em todos os ambientes.']
    ],
    tags: ['Bash','Linux','AppImage','FUSE','XWayland'],
    repo: 'https://github.com/gustavormartins/salinha-linux-compat-kit'
  },
  {
    slug: 'replica', number: '03', label: 'RUST / DESKTOP ENGINEERING', title: 'Replica', accent: 'Audio Player.',
    status: 'BOOTSTRAP · EM DESENVOLVIMENTO',
    lead: 'Um exercício de arquitetura para uma aplicação de áudio nativa Linux, com foco em modularidade, manutenção e qualidade desde o primeiro commit.',
    aspects: [
      ['O objetivo', 'Criar um player local-first capaz de organizar e reproduzir uma biblioteca de mídia com uma experiência nativa integrada ao Linux.'],
      ['O que já existe', 'Bootstrap Rust, pipeline CI, formatação, Clippy, testes e auditoria de dependências. A estrutura inicial permite evoluir a aplicação com segurança.'],
      ['O que falta', 'A interface GTK4/Libadwaita, reprodução, persistência e gerenciamento da biblioteca ainda não foram implementados; não é um player funcional.']
    ],
    tags: ['Rust','Linux','CI / Clippy','GTK4 planejado'],
    repo: 'https://github.com/gustavormartins/Replica-audio-player'
  }
];

export default function CasesPage() {
  return <div className="case-root">
    <a href="#conteudo" className="skip">Pular para o conteúdo</a>
    <header className="site-header">
      <nav className="container nav-inner" aria-label="Navegação principal">
        <Link href="/" className="brand"><span className="brand-square">G<span>M</span></span><span className="brand-word">BLOHSH<span className="green">®</span></span></Link>
        <Link className="nav-action" href="/#trabalhos"><ArrowLeft size={15}/> VOLTAR AO PORTFÓLIO</Link>
        <Link className="cases-back-mobile" href="/#trabalhos"><ArrowLeft size={18}/> VOLTAR</Link>
      </nav>
    </header>
    <main id="conteudo" className="container">
      <div className="cases-hero"><span className="section-index">CASE STUDIES / 2026</span><h1>Código com<br/><em>contexto.</em></h1><p>Um bom projeto não é apenas um repositório. Aqui estão as decisões, os limites e o aprendizado por trás das soluções que escolhi mostrar.</p><nav className="case-nav" aria-label="Ir para um estudo de caso">{cases.map(p=><a href={'#'+p.slug} key={p.slug}>{p.number} / {p.title}</a>)}</nav></div>
      {cases.map(p=><article className="case-section" id={p.slug} key={p.slug}>
        <span className="section-index">{p.number} / {p.label}</span>
        <h2 className="case-name">{p.title} <em>{p.accent}</em></h2>
        <span className="case-state">{p.status}</span>
        <p className="case-lead">{p.lead}</p>
        {p.slug === 'blohshblast' && <figure className="case-figure"><img src="/assets/projects/blohshblast-gameplay.png" width="1160" height="780" alt="Captura autêntica do BlohshBlast, mostrando peças verdes no tabuleiro durante uma partida" loading="lazy"/><figcaption>INTERFACE REAL · CAPTURA PRODUZIDA A PARTIR DO CÓDIGO ORIGINAL</figcaption></figure>}
        {p.slug === 'salinha' && <div className="linux-diagram case-diagram" aria-label="Etapas documentadas do launcher do Salinha"><div className="linux-title"><Terminal size={14}/><span>Compatibility workflow</span><small>not a log trace</small></div><div className="linux-steps">{[['01','KDE / WAYLAND','Identificar sessão'],['02','XWAYLAND','Selecionar backend'],['03','APPIMAGE / FUSE','Fallback de execução'],['04','LOGS / NETWORK','Registrar DNS e HTTPS']].map(([n,title,desc])=><div key={n} className="linux-step"><span>{n}</span><strong>{title}</strong><small>{desc}</small></div>)}</div></div>}
        {p.slug === 'replica' && <div className="case-replica-plan"><div className="case-replica-line"><span>NOW</span><strong>Rust bootstrap</strong><small>CI · Clippy · cargo-audit</small></div><div className="case-replica-line"><span>NEXT</span><strong>GTK4 &amp; Libadwaita</strong><small>Interface nativa</small></div><div className="case-replica-line"><span>LATER</span><strong>Playback &amp; SQLite</strong><small>Biblioteca de áudio local</small></div><p>ROADMAP TÉCNICO · ITENS FUTUROS NÃO SÃO FUNCIONALIDADES CONCLUÍDAS</p></div>}
        <div className="case-grid">{p.aspects.map(([title,description],i)=><div className="case-box" key={title}><span>{String(i+1).padStart(2,'0')} /</span><h3>{title}</h3><p>{description}</p></div>)}</div>
        <div className="chip-row">{p.tags.map(tag=><span key={tag}>{tag}</span>)}</div>
        <div className="case-outlinks"><a href={p.repo} rel="noopener noreferrer" target="_blank"><Github size={16}/> VER REPOSITÓRIO <ArrowUpRight size={14}/></a>{p.slug === 'salinha' && <a href="https://github.com/gustavormartins/salinha-linux-compat-kit/blob/main/RELATORIO-TECNICO.md" rel="noopener noreferrer" target="_blank">RELATÓRIO TÉCNICO <ArrowUpRight size={14}/></a>}</div>
      </article>)}
      <div className="cases-bottom"><span className="section-index">BEYOND THE CODE</span><h2>Documentar também<br/><em>é engenharia.</em></h2><p>O histórico permanece no GitHub. Aqui, a seleção foca no que cada projeto ensina — sem divulgar projetos pessoais.</p><Link href="/#contato" className="btn btn-primary">ENTRE EM CONTATO <ArrowUpRight size={16}/></Link></div>
    </main>
    <footer className="site-footer"><div className="container footer-inner"><span>GM. / BLOHSH®</span><span>ENGINEERING / BUILDING IN PUBLIC</span><span>© 2026</span></div></footer>
  </div>;
}
