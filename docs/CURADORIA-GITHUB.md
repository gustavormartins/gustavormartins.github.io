# Blohsh Portfolio 2.0 — Plano de curadoria do GitHub

> Estado: proposta de organização, sem exclusões, arquivamentos, mudanças de visibilidade ou alterações de repositórios externos.

## Princípio editorial

O portfólio não deve ser uma listagem automática dos repositórios por data de atualização. Selecionar projetos pelo que demonstram em **engenharia de software, capacidade de resolução, maturidade e relevância para oportunidades**.

### Pinned repositories — sugestão (até 6)

1. [BlohshBlast](https://github.com/gustavormartins/blohshblast.github.io) — jogo web funcional, evolução de produto, PWA.
2. [Salinha Linux Compat Kit](https://github.com/gustavormartins/salinha-linux-compat-kit) — troubleshooting e Bash com relatório técnico; não afirmar correção completa da falha de rede.
3. [Lista de Casa](https://github.com/gustavormartins/Lista-de-Casa) — exemplo de React/FastAPI/SQLite; divulgar como protótipo, requer autenticação de backend.
4. [Replica Audio Player](https://github.com/gustavormartins/Replica-audio-player) — arquitetura e DevSecOps em Rust; bootstrap inicial, ainda sem playback funcional.
5. [Portfólio](https://github.com/gustavormartins/gustavormartins.github.io) — identidade e qualidade da interface.
6. [WinOptmize](https://github.com/gustavormartins/WinOptmize) — somente após testar comportamentos destrutivos, revisar README e corrigir erros e scripts de risco.

> A seleção acima é uma proposta de pins, não foi aplicada no perfil do GitHub.

## Grupos para revisão manual

| Repositório | Encaminhamento inicial |
|---|---|
| `blohshblast.github.io` | Destaque; mostrar fase atual, link para demo quando validada |
| `salinha-linux-compat-kit` | Destaque; documentar condições de reprodução e limitações |
| `Lista-de-Casa` | Destaque como protótipo; revisar PIN no frontend e fluxo de autenticação |
| `Replica-audio-player` | Destaque como WIP; não representar funcionalidades planejadas como prontas |
| `gustavormartins.github.io` | Destaque e melhoria contínua; esta branch reúne o redesign |
| `WinOptmize` | Reserva para pin; auditar segurança/efeitos colaterais |
| `Windows-Shell-Resilience-Tester` | Revisar README, escopo, testes e riscos antes de promoção |
| `manejo-app` | Candidato a futuro destaque se houver demonstração funcional e casos de uso |
| `coiote-branding-website` | Revisar para incluir em seção de trabalhos de cliente ou experimento visual |
| `fornitura-glow` | Revisar relevância e maturidade; não selecionar só por estética |
| `report.github.io` | Classificar como relatório acadêmico/técnico, não produto web completo |
| `My-First-Python-Script` | Manter como marco de aprendizado; não precisa ser pin |
| `Index000` | Revisar conteúdo e utilidade; possível experimento histórico |
| `minha-lista` | Revisar se vazio ou duplicado; não apagar sem conferir histórico |
| `para-a-bia` | Verificar conteúdo pessoal e exposição pública; avaliar privacidade com o proprietário |

## Checklist antes de divulgar um projeto

- [ ] README com problema real, contexto, arquitetura e execução local reproduzível.
- [ ] Status preciso: concluído, funcional com limitações, protótipo ou em desenvolvimento.
- [ ] Imagens ou vídeo reais, com autorização, e links que funcionam.
- [ ] Testes e comandos de build verificados, não apenas descritos.
- [ ] Limitações e dívidas técnicas documentadas.
- [ ] Licença e instruções de contribuição coerentes com a intenção do mantenedor.
- [ ] Sem segredos, credenciais, dados pessoais, tokens ou autenticação apenas visual.
- [ ] Descrição e topics do GitHub concisos, sem tecnologias não usadas.
- [ ] Sem afirmar métricas de acesso, desempenho ou impacto sem medição.

## Pontos técnicos descobertos

- O portfólio principal renderiza os projetos diretamente no HTML; `json/projects.json` contém itens antigos, links com `#` e nomes que não correspondem à curadoria.
- `js/main.js` busca repositórios por atualizações, não pela curadoria; não há indicação de que esteja ativo no HTML atual. **Não remover sem validar dependências.**
- O README de `Lista-de-Casa` documenta um PIN exposto no frontend, que não é um controle de acesso seguro. Priorizar autenticação no servidor e verificação de credenciais/dados de usuários antes de ampliar exposição.
- O `Replica-audio-player` é explicitamente um bootstrap, não um player de áudio funcional.
- O relatório do `salinha-linux-compat-kit` não confirma a correção da falha original de rede. Comunicar esse limite.

## Próximas etapas sem operação destrutiva

1. Aprovar os pins e ajustar os metadados dos seis repositórios escolhidos.
2. Melhorar README, screenshots reais, instruções de execução e status.
3. Rever repositórios com conteúdo potencialmente pessoal antes de recomendar visibilidade.
4. Só depois analisar arquivar, tornar privado ou fundir repositórios redundantes, um a um, com autorização explícita.

**Regra:** não apagar projetos por estética. Um perfil organizado é um perfil que orienta visitantes, não necessariamente um perfil com poucos repositórios.
