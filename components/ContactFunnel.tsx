'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, BriefcaseBusiness, Braces, Check, Copy, Globe2, Handshake, Mail, Terminal, Workflow } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type DemandId = 'web' | 'automation' | 'integrations' | 'linux' | 'recruitment' | 'partnership';

type Demand = {
  id: DemandId;
  number: string;
  title: string;
  category: string;
  description: string;
  subject: string;
  prompt: string;
  detailsLabel: string;
  detailsPlaceholder: string;
  timingLabel: string;
  timingPlaceholder: string;
  Icon: LucideIcon;
};

const contactEmail = 'gustavoromaom178@hotmail.com';

const demands: Demand[] = [
  {
    id: 'web', number: '01', title: 'Site ou aplicação', category: 'WEB / PRODUCT',
    description: 'Landing page, painel, experiência web ou MVP.',
    subject: 'Proposta de site ou aplicação web',
    prompt: 'Quero conversar sobre um site, aplicação ou experiência web.',
    detailsLabel: 'O que você quer construir?',
    detailsPlaceholder: 'Ex.: preciso de um painel para acompanhar pedidos com login e relatórios...',
    timingLabel: 'Prazo ou referências (opcional)',
    timingPlaceholder: 'Ex.: lançar em dois meses; já tenho um briefing e referências.',
    Icon: Globe2
  },
  {
    id: 'automation', number: '02', title: 'Automação', category: 'PYTHON / WORKFLOWS',
    description: 'Eliminar tarefas repetitivas e simplificar processos.',
    subject: 'Proposta de automação de processos',
    prompt: 'Quero automatizar uma tarefa ou um fluxo de trabalho.',
    detailsLabel: 'Qual processo precisa de automação?',
    detailsPlaceholder: 'Ex.: recebemos planilhas toda semana e queremos gerar relatórios automaticamente...',
    timingLabel: 'Ferramentas e frequência (opcional)',
    timingPlaceholder: 'Ex.: Excel, Python, Power Automate; diariamente.',
    Icon: Workflow
  },
  {
    id: 'integrations', number: '03', title: 'API ou integração', category: 'BACKEND / DATA',
    description: 'Conectar sistemas, estruturar dados e desenvolver serviços.',
    subject: 'Proposta de API ou integração de sistemas',
    prompt: 'Quero conversar sobre uma API, um backend ou integração entre serviços.',
    detailsLabel: 'Quais sistemas ou dados devem se conectar?',
    detailsPlaceholder: 'Ex.: integrar uma plataforma de pedidos com um banco de dados e um dashboard...',
    timingLabel: 'Tecnologias e restrições (opcional)',
    timingPlaceholder: 'Ex.: FastAPI, PostgreSQL, APIs REST, documentação disponível.',
    Icon: Braces
  },
  {
    id: 'linux', number: '04', title: 'Linux e diagnóstico', category: 'SYSTEMS / TROUBLESHOOTING',
    description: 'Análise técnica, scripts e compatibilidade em Linux.',
    subject: 'Demanda de Linux, scripts ou diagnóstico',
    prompt: 'Quero conversar sobre uma demanda técnica relacionada a Linux ou troubleshooting.',
    detailsLabel: 'Qual é o ambiente e o problema?',
    detailsPlaceholder: 'Ex.: aplicativo AppImage não abre no Fedora; preciso entender a falha e os logs...',
    timingLabel: 'Sistema e logs disponíveis (opcional)',
    timingPlaceholder: 'Ex.: Fedora KDE, Wayland; tenho logs sem dados sensíveis.',
    Icon: Terminal
  },
  {
    id: 'recruitment', number: '05', title: 'Recrutamento', category: 'CAREER / OPPORTUNITY',
    description: 'Vaga, entrevista, programa de formação ou oportunidade dev.',
    subject: 'Convite para oportunidade em desenvolvimento de software',
    prompt: 'Conheci seu portfólio e gostaria de apresentar uma oportunidade profissional.',
    detailsLabel: 'Qual é a vaga ou oportunidade?',
    detailsPlaceholder: 'Ex.: vaga de desenvolvedor júnior; principais atribuições, stack e requisitos...',
    timingLabel: 'Modalidade e próximos passos (opcional)',
    timingPlaceholder: 'Ex.: remoto, híbrido ou presencial; proposta de entrevista e data.',
    Icon: BriefcaseBusiness
  },
  {
    id: 'partnership', number: '06', title: 'Parceria ou outra ideia', category: 'COLLAB / OPEN SOURCE',
    description: 'Contribuição open source, parceria ou desafio diferente.',
    subject: 'Proposta de parceria ou colaboração',
    prompt: 'Quero propor uma parceria, colaboração ou outra ideia.',
    detailsLabel: 'Qual é a ideia ou proposta?',
    detailsPlaceholder: 'Ex.: colaboração open source ou ideia de produto para construir em conjunto...',
    timingLabel: 'Links ou próximos passos (opcional)',
    timingPlaceholder: 'Ex.: repositório, referência ou disponibilidade para conversar.',
    Icon: Handshake
  },
];

function makeDraft(demand: Demand, name: string, organization: string, description: string, details: string) {
  const recruiter = demand.id === 'recruitment';
  const subject = '[Portfolio GM] ' + demand.subject;
  const lines = [
    'Olá, Gustavo!',
    '',
    demand.prompt,
    '',
    'CONTEXTO DO CONTATO',
    'Tipo: ' + demand.title,
    'Nome: ' + (name.trim() || '[seu nome]'),
    (recruiter ? 'Empresa / recrutamento: ' : 'Empresa / projeto: ') + (organization.trim() || '[opcional]'),
    (recruiter ? 'Vaga ou oportunidade: ' : 'Demanda ou objetivo: ') + (description.trim() || '[descreva brevemente o que precisa]'),
    demand.timingLabel.replace(' (opcional)', '') + ': ' + (details.trim() || '[a definir]'),
    '',
    recruiter
      ? 'Podemos conversar sobre o perfil, a vaga e as próximas etapas?'
      : 'Você poderia me contar sobre sua disponibilidade para avaliar essa proposta?',
    '',
    'Obrigado(a)!',
    name.trim() || '[seu nome]',
    '',
    'Enviado a partir do formulário de contato do portfólio:',
    'https://gustavormartins.vercel.app/'
  ];
  const body = lines.join('\n');
  const href = 'mailto:' + contactEmail + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  return { subject, body, href };
}

export function ContactFunnel() {
  const [chosen, setChosen] = useState<DemandId | null>(null);
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [copied, setCopied] = useState(false);

  const demand = demands.find(item => item.id === chosen);
  const draft = demand ? makeDraft(demand, name, organization, description, details) : null;

  const choose = (id: DemandId) => {
    // Keep identity details, but never mix project-specific descriptions
    // into a different request type (especially recruitment).
    if (id !== chosen) {
      setDescription('');
      setDetails('');
    }
    setChosen(id);
    setCopied(false);
  };

  const copyDraft = async () => {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText('Assunto: ' + draft.subject + '\n\n' + draft.body);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="contact-funnel" id="solicitar-contato">
      <div className="funnel-header">
        <div>
          <span className="funnel-eyebrow">DIRECT CONTACT / 2 PASSOS</span>
          <h3>Como podemos <em>conversar?</em></h3>
          <p>Escolha o assunto para receber uma mensagem preparada para o seu contexto.</p>
        </div>
        <div className="funnel-progress" aria-label={chosen ? 'Passo dois de dois' : 'Passo um de dois'}>
          <span className="is-current">01</span><i aria-hidden="true" /><span className={chosen ? 'is-current' : ''}>02</span>
        </div>
      </div>

      {!demand ? (
        <div className="funnel-choose">
          <div className="funnel-step-label">01 — SELECIONE SUA DEMANDA</div>
          <div className="funnel-options">
            {demands.map(({ id, number, title, category, description: summary, Icon }) => (
              <button className="funnel-option" type="button" key={id} onClick={() => choose(id)}>
                <span className="funnel-option-top"><Icon size={22} strokeWidth={1.7} aria-hidden="true" /><small>{number} / {category}</small></span>
                <strong>{title}</strong>
                <span className="funnel-option-description">{summary}</span>
                <span className="funnel-option-arrow"><ArrowUpRight size={18} aria-hidden="true" /></span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="funnel-compose" aria-live="polite">
          <div className="funnel-compose-top">
            <button className="funnel-back" type="button" onClick={() => { setChosen(null); setCopied(false); }}>
              <ArrowLeft size={15} aria-hidden="true" /> ALTERAR DEMANDA
            </button>
            <span className="funnel-step-label">02 — PERSONALIZE SEU E-MAIL</span>
          </div>
          <div className="funnel-compose-heading">
            <span className="funnel-selected-category">{demand.category}</span>
            <h4>{demand.title}</h4>
            <p>Você pode deixar campos vazios e completar o texto no e-mail antes de enviar.</p>
          </div>

          <div className="funnel-fields">
            <label className="funnel-field">
              <span>Seu nome <small>OPCIONAL</small></span>
              <input value={name} onChange={e => { setName(e.target.value); setCopied(false); }} maxLength={70} placeholder="Como podemos chamar você?" autoComplete="name" />
            </label>
            <label className="funnel-field">
              <span>Empresa ou organização <small>OPCIONAL</small></span>
              <input value={organization} onChange={e => { setOrganization(e.target.value); setCopied(false); }} maxLength={100} placeholder="Empresa, equipe ou projeto independente" autoComplete="organization" />
            </label>
            <label className="funnel-field funnel-field-wide">
              <span>{demand.detailsLabel} <small>OPCIONAL</small></span>
              <textarea value={description} onChange={e => { setDescription(e.target.value); setCopied(false); }} maxLength={480} rows={4} placeholder={demand.detailsPlaceholder} />
            </label>
            <label className="funnel-field funnel-field-wide">
              <span>{demand.timingLabel}</span>
              <input value={details} onChange={e => { setDetails(e.target.value); setCopied(false); }} maxLength={140} placeholder={demand.timingPlaceholder} />
            </label>
          </div>

          {draft && (
            <div className="funnel-delivery">
              <div className="funnel-mail-summary">
                <span className="funnel-mail-icon"><Mail size={20} aria-hidden="true" /></span>
                <span><small>ASSUNTO PRÉ-PREENCHIDO</small><strong>{draft.subject}</strong></span>
              </div>
              <div className="funnel-mail-actions">
                <a className="btn btn-primary funnel-send" href={draft.href}>
                  ABRIR E-MAIL <ArrowUpRight size={17} aria-hidden="true" />
                </a>
                <button type="button" className="funnel-copy" onClick={copyDraft}>
                  {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                  {copied ? 'MENSAGEM COPIADA' : 'COPIAR MENSAGEM'}
                </button>
              </div>
              <details className="funnel-preview">
                <summary>Ver assunto e mensagem completa <ArrowRight size={15} aria-hidden="true" /></summary>
                <pre>{'Assunto: ' + draft.subject + '\n\n' + draft.body}</pre>
              </details>
              <p className="funnel-disclaimer">O botão abre seu aplicativo de e-mail, não envia a mensagem sozinho. Você pode revisar o texto, incluir links ou anexar briefing, currículo e referências antes de clicar em enviar. Nenhum dado é armazenado neste site.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
