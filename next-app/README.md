# Blohsh Portfolio — Next.js Motion Lab

> Experimental, isolated implementation. The current HTML portfolio and PR #1 remain untouched.

## Objective

Move the presentation layer to **Next.js App Router + TypeScript + Motion for React**, with a deliberate motion system: section reveals, scroll progress, transitions between selected projects, and CSS-led ambient movement. Animation must clarify hierarchy, not compete with it.

## What is implemented in this branch

- Accessible hero entrance with reduced-motion support
- Sticky progress line driven by Motion `useScroll` and `useSpring`
- Animated editorial ticker (disabled under prefers-reduced-motion)
- Three **verified** public projects in a curated interactive portfolio
- BlohshBlast visual from real GitHub source at an immutable commit (external image URL)
- Salinha Linux diagnostic pipeline as **illustration**, not real terminal output
- Replica Audio Player architecture as **concept**, with explicit nonfunctional status
- FluxGuard Python idea separately labeled **not implemented**
- No Casa/lista de presentes content in this new app

## Run locally

```bash
cd next-app
npm install
npm run typecheck
npm run build
npm run dev
```

Use Node 22 or later. This subdirectory currently **does not** replace the Vercel production root. A separate Vercel project pointing at `next-app` is recommended for preview before switching any production settings.

## Motion design principles

- **Fast:** entrance animations 400–720 ms, transitions 200–380 ms.
- **Bounded:** no huge parallax, autoplay video, forced cursor following or scroll hijacking.
- **User-controlled:** project selector is a real button with pressed state.
- **Accessible:** honors reduced-motion preference, clear focus, preserved semantic HTML.
- **Clean:** composition is primarily CSS, with Motion applied only where interaction needs it.

## Privacy & precision

The personal Lista de Casa project is intentionally excluded. The Replica Rust project is still in bootstrap stage. The Python FluxGuard is a project proposal only; no API or dashboard exists yet.

## Migration checklist

- [ ] Green Next.js CI build and typecheck
- [ ] Actual browser review at 1440, 390, 320 px
- [ ] Verify reduced-motion and keyboard navigation
- [ ] Host BlohshBlast capture locally in Next public assets rather than remote GitHub before production
- [ ] Lighthouse and accessibility audit
- [ ] Create a Vercel preview for `next-app`, with no production domain reassignment
- [ ] Final copy and status verification
- [ ] Approve migration prior to replacing the current portfolio

## Practical scope

This is a **prototype branch**, not a request to merge PR #1 or a claim that Next.js has been deployed to production.
