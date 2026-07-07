# Multi-Region O-RAN CTI Platform — Project Explainer Site

Interactive technical walkthrough website for the Final Year Project:
**Multi-Region O-RAN CTI Platform with Mini RAG, Global RAG, rApps, xApps, Inter-Platform Threat Sharing, and Global Dashboard**.

Built with React + Vite + TypeScript + Tailwind CSS + Framer Motion.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build

```bash
npm run build    # outputs static site to dist/
```

`vite.config.ts` uses `base: './'`, so the contents of `dist/` work on GitHub Pages
under any repository path (e.g. push `dist/` to a `gh-pages` branch, or use a
Pages build workflow).

## Adding dashboard screenshots

Screenshot placeholders live in `src/sections/DashboardSection.tsx`
(`ScreenshotPlaceholder` components). Put your images in `public/screenshots/`
and replace a placeholder with:

```tsx
<figure className="card overflow-hidden">
  <img src="./screenshots/overview.png" alt="Global overview" />
  <figcaption className="px-4 py-3 text-sm text-slate-600">Caption…</figcaption>
</figure>
```

## Structure

- `src/components/` — Nav, Hero, shared UI (service cards, file badges, steppers, placeholders), main architecture SVG
- `src/sections/` — one file per site section (architecture, O-RAN network, rApp1 pipeline, detection flow, Mini RAG logic, rApp2 persistence, inter-platform sharing, dashboard gallery, startup guide)
