import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Code2, Gamepad2, Layers3, MousePointer2, ShieldCheck, Smartphone, Terminal } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { PlayableBlohshBlast } from '@/components/PlayableBlohshBlast';
import './game.css';

export const metadata: Metadata = {
  title: 'Jogue BlohshBlast — demonstração interativa do projeto',
  description: 'Jogue o BlohshBlast original no próprio portfólio. Explore o tabuleiro 8×8, modos de jogo, pontuação e código-fonte.',
  alternates: { canonical: '/jogar/' },
  openGraph: {
    title: 'BlohshBlast — demonstração jogável',
    description: 'Interaja com o jogo real e conheça a engenharia por trás do projeto.',
    url: '/jogar/',
    type: 'website'
  }
};

const facts = [
  { index: '01', name: 'Lógica do jogo', desc: 'Verificação de colisão, encaixe de peças e limpeza de linhas.' },
  { index: '02', name: 'Interface responsiva', desc: 'Controles por mouse, teclado e toque; adaptação para telas menores.' },
  { index: '03', name: 'Progressão local', desc: 'Modos, missões, recordes e preferências mantidos neste navegador.' }
];

export default function GameShowcase() {
  return (
    <div className="play-demo-page">
      <a className="skip" href="#demonstracao">Ir direto à demonstração jogável</a>
      <header className="play-demo-header">
        <div className="container play-demo-header-inner">
          <BrandLogo/>
          <nav aria-label="Navegação da demonstração">
            <Link href="/#trabalhos"><ArrowLeft size={15} aria-hidden="true"/> PORTFÓLIO</Link>
            <Link href="/recrutador/">MODO RECRUTADOR <ArrowUpRight size={14} aria-hidden="true"/></Link>
          </nav>
        </div>
      </header>
      <main>
        <section className="container play-demo-intro">
          <div className="play-demo-intro-copy">
            <span className="play-demo-eyebrow"><span className="playable-led" aria-hidden="true"/> LIVE CODE / PROJECT 01</span>
            <h1>Blohsh<span>Blast.</span></h1>
            <p className="play-demo-subhead">Um projeto para <em>jogar, não só olhar.</em></p>
            <p className="play-demo-desc">Uma versão jogável do puzzle original, integrada ao portfólio. O tabuleiro, as peças e os pontos vêm do código do próprio jogo. Escolha um modo, tente completar linhas e veja a lógica funcionando.</p>
            <div className="play-demo-tags"><span>HTML / CSS / JS</span><span>GAME LOGIC</span><span>TOUCH & KEYBOARD</span><span>PWA</span></div>
          </div>
          <div className="play-demo-intro-aside" aria-label="Detalhes da demonstração">
            <span>BUILD / 2026</span>
            <strong>8 × 8</strong>
            <small>GRID / PUZZLE ARCADE</small>
            <div><ShieldCheck size={15} aria-hidden="true"/> Sem cadastro. Progresso armazenado localmente.</div>
          </div>
        </section>
        <section className="container play-demo-stage" aria-label="Experimente o BlohshBlast">
          <PlayableBlohshBlast />
          <div className="play-demo-help">
            <div><MousePointer2 size={19} aria-hidden="true"/><span><strong>No computador</strong> Arraste uma peça para o tabuleiro. O jogo também possui posicionamento via teclado.</span></div>
            <div><Smartphone size={19} aria-hidden="true"/><span><strong>No celular</strong> Toque e arraste uma peça. Para aproveitar toda a tela, abra o jogo na janela própria.</span></div>
            <div><Layers3 size={19} aria-hidden="true"/><span><strong>Regras</strong> Complete linhas ou colunas para liberar espaço. O jogo termina quando não houver encaixes possíveis.</span></div>
          </div>
        </section>
        <section className="container play-demo-engineering">
          <div className="play-demo-section-head"><span>01 / UNDER THE HOOD</span><h2>Mais do que<br/><em>um joguinho.</em></h2><p>Uma demonstração técnica que dá ao visitante a chance de experimentar interações reais e analisar o código que as implementa.</p></div>
          <div className="play-demo-facts">
            {facts.map(fact=><article key={fact.index}><span>{fact.index} /</span><h3>{fact.name}</h3><p>{fact.desc}</p></article>)}
          </div>
          <div className="play-demo-actions">
            <a href="https://github.com/gustavormartins/blohshblast.github.io" target="_blank" rel="noopener noreferrer"><Code2 size={17} aria-hidden="true"/> EXAMINAR CÓDIGO <ArrowUpRight size={15} aria-hidden="true"/></a>
            <Link href="/cases/#blohshblast"><Terminal size={17} aria-hidden="true"/> LER ESTUDO DE CASO <ArrowUpRight size={15} aria-hidden="true"/></Link>
          </div>
          <p className="play-demo-disclosure">Esta versão usa o runtime HTML/JavaScript original do BlohshBlast (código de 7 de outubro de 2026). A camada TypeScript ainda está sendo migrada no repositório. Ranking e recordes exibidos aqui são locais ao navegador — não há leaderboard público sincronizado.</p>
        </section>
      </main>
      <footer className="play-demo-footer">
        <div className="container"><Link href="/">GUSTAVO MARTINS DEV / BLOHSH</Link><span>JOGUE · INSPECIONE · AVALIE</span><Link href="/recrutador/"><Gamepad2 size={15} aria-hidden="true"/> VOLTAR AO PERFIL TÉCNICO</Link></div>
      </footer>
    </div>
  );
}
