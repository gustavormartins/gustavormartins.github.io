'use client';

import { useState } from 'react';
import { ArrowUpRight, Gamepad2, RotateCcw } from 'lucide-react';

const GAME_URL = '/jogar/blohshblast/';

/**
 * Mounts the actual original HTML/JS game only after a deliberate click.
 * The game runs in its own document with its own save state and keyboard/touch
 * controls; no simulation or fake score is drawn by this React component.
 */
export function PlayableBlohshBlast() {
  const [playing, setPlaying] = useState(false);
  const [session, setSession] = useState(0);

  return (
    <div className="playable-demo" id="demonstracao" aria-label="Demonstração jogável do BlohshBlast">
      <div className="playable-topbar">
        <div><span className="playable-led" aria-hidden="true"/><strong>BLOHSHBLAST.EXE</strong><span className="playable-runtime">HTML / JS ORIGINAL</span></div>
        <span className="playable-version">INTERACTIVE / REAL GAME</span>
      </div>
      <div className="playable-viewport">
        {playing ? (
          <iframe
            key={session}
            src={GAME_URL}
            title="BlohshBlast original: jogo de blocos interativo com controles por toque, mouse e teclado"
            className="playable-frame"
            allow="fullscreen"
            loading="eager"
          />
        ) : (
          <div className="playable-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/projects/blohshblast-gameplay.png" alt="Captura original de uma partida do BlohshBlast com blocos verdes no tabuleiro" width="1160" height="780" />
            <div className="playable-start-shade">
              <div className="playable-start-info">
                <span className="playable-kicker">PLAY THE ACTUAL PROJECT / 8×8 PUZZLE</span>
                <h3>O código vira<br/><em>experiência.</em></h3>
                <p>Tabuleiro real, peças aleatórias, pontuação e modos de jogo. Sem protótipo em vídeo ou resultado fabricado.</p>
                <button type="button" className="playable-start-button" onClick={()=>setPlaying(true)}>
                  <Gamepad2 size={21} aria-hidden="true"/> INICIAR DEMONSTRAÇÃO <ArrowUpRight size={17} aria-hidden="true"/>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="playable-footbar">
        <div className="playable-footnote">
          <span className="playable-led" aria-hidden="true"/>
          {playing ? 'Jogo original carregado · progresso e recordes locais no navegador' : 'A demo inicia somente após o seu clique'}
        </div>
        <div className="playable-controls">
          {playing && (
            <button className="playable-reset" type="button" onClick={()=>setSession(v=>v+1)} title="Recarregar o jogo (progresso local é preservado)">
              <RotateCcw size={14} aria-hidden="true"/> RECARREGAR
            </button>
          )}
          <a href={GAME_URL} target="_blank" rel="noopener noreferrer">
            ABRIR EM TELA PRÓPRIA <ArrowUpRight size={14} aria-hidden="true"/>
          </a>
        </div>
      </div>
    </div>
  );
}
