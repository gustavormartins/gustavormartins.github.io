# Blohsh Portfolio 3.0

Portfólio de software de Gustavo Martins: desenvolvimento web, Linux, Rust e experimentos de backend. Esta branch contém a **migração experimental para Next.js + TypeScript + Motion**, com a identidade preta e verde neon Blohsh.

## Projetos selecionados

| Projeto | Demonstra |
| --- | --- |
| BlohshBlast | Interação, lógica de puzzle, interface responsiva, PWA |
| Salinha Linux Compat Kit | Diagnóstico, Bash, FUSE e Wayland/XWayland |
| Replica Audio Player | Estrutura Rust, CI, segurança e roadmap desktop |
| Blohsh OpsLens (lab) | API Python/FastAPI com eventos sintéticos, validação, idempotência e testes |

Os projetos possuem estados diferentes de maturidade. A interface do Replica e a reprodução de áudio ainda não são funcionais; o OpsLens não é um serviço público e requer autenticação antes de qualquer deploy real.

## Executar o Next.js

Requer Node.js 22 ou superior.

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

A configuração Next.js usa export estático. A pasta `out/` é gerada no build. Os recursos de imagem próprios são copiados por `scripts/prepare-next-assets.mjs`.

## Laboratório Python

`labs/opslens/` é uma incubadora de API local, mantida separada do site renderizado e pronta para migração futura a um repositório próprio. Os dados são **100% sintéticos**.

```bash
cd labs/opslens
python -m venv .venv
source .venv/bin/activate
pip install -e '.[test]'
pytest -q
uvicorn opslens.api:app --host 127.0.0.1 --port 8000
```

Leia [labs/opslens/README.md](labs/opslens/README.md) para exemplos de requests, limites de segurança e próximos passos.

## Critérios de publicação

- Mantenha o projeto pessoal fora das páginas e dos metadados públicos.
- Não declarar funções futuras como concluídas.
- Motion deve respeitar `prefers-reduced-motion`, sem rolagem sequestrada ou animações obrigatórias.
- Verificar build, types, teste de privacidade, navegação e overflow.
- Não substituir a produção antes de revisar o Preview e aprovar o merge.

## Migração

Esta branch está associada ao [PR #2](https://github.com/gustavormartins/gustavormartins.github.io/pull/2), atualmente baseado na atualização estática do [PR #3](https://github.com/gustavormartins/gustavormartins.github.io/pull/3). Não fazer merge automático.

Os arquivos HTML/CSS legados permanecem temporariamente no repositório como referência de migração. Removê-los ou arquivá-los somente após a confirmação da publicação Next.js.
