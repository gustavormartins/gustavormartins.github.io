# BlohshBlast — demonstração jogável real

## Origem

- Projeto: [gustavormartins/blohshblast.github.io](https://github.com/gustavormartins/blohshblast.github.io)
- Código-base congelado para esta entrega: `4db91055cc21f0a05f5474033e4a6e77cbddc7a8` (7 out 2026).
- Licença: MIT, incluída em `public/jogar/blohshblast/LICENSE.txt`.
- Rota de apresentação: `/jogar/` (Next.js).
- Execução real do jogo: `/jogar/blohshblast/` (documento estático HTML/CSS/JS).

## Por que incorporar o original em vez de um mockup?

O BlohshBlast já tem motor de tabuleiro, geração de peças, sistema de pontos, modos de jogo, missões e persistência local. A vitrine usa **esses mesmos scripts reais**. O iframe só carrega depois de um clique explícito. O jogador também pode abrir a execução em uma aba própria.

## Adaptações limitadas à demonstração do portfólio

1. HTML e scripts copiados do repositório original, sem reimplementação das regras.
2. A referência ao módulo `src/main.ts` foi removida **apenas da cópia estática**; o navegador não carrega TypeScript puro sem o build Vite. O runtime funcional `legacy-game.js` + `phase3.js` continua integral.
3. O logotipo PNG foi trocado pelo arquivo SVG original do mesmo repositório, pois as interfaces de atualização de arquivos textuais não permitem incorporar o PNG binário diretamente.
4. A política CSP não libera conexões à API remota do Render; esta versão trabalha exclusivamente com recursos locais. A progressão/leaderboard desta versão permanecem no navegador.
5. O Service Worker limita a limpeza de caches à família `blohsh-blast-*`. Seu escopo é somente `/jogar/blohshblast/`, sem capturar as demais páginas do portfólio.
6. O meta viewport foi alterado para permitir zoom/accessibilidade.

A camada nova TypeScript, os testes unitários do repositório do jogo e o backend não são incluídos nessa cópia. **Não afirmar que a demo comprova o build Vite ou sincronização global.**

## Como verificar

```bash
npm install
npm run build
python3 -m http.server 4173 --bind 127.0.0.1 --directory out
# Em outro terminal:
node scripts/test_blohshblast_demo.mjs
```

O navegador Playwright testa em 1440, 390 e 320 px:

- página `/jogar/` e jogo `/jogar/blohshblast/` servidos sem erro;
- jogo não montado antes do clique;
- menu, 64 células e acesso ao motor original;
- jogada de peça via API pública do próprio runtime, com aumento de pontuação;
- ausência de pedidos de recursos quebrados, erros JS e overflow horizontal;
- screenshots do jogo real incorporado ao portfólio.

## Evolução planejada

- Automatizar atualização de versão quando o upstream for estável.
- Investigar o build Vite/TypeScript do repo de origem e atualizar a cópia para a build mais recente.
- Integrar screenshot e CTAs sem bloquear ou forçar carregamento da demo em celulares.
- Fazer testes manuais de arraste/toque em dispositivos reais e uma auditoria de desempenho.

> Não apagar o histórico nem substituir o código fonte do BlohshBlast. Esta é uma cópia de demonstração, derivada do projeto original.
