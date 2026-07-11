# Multi-Region O-RAN CTI Platform — Project Explainer Site

Interactive technical walkthrough website for the Final Year Project:
**Multi-Region O-RAN CTI Platform with Mini RAG, Global RAG, rApps, xApps, Inter-Platform Threat Sharing, and Global Dashboard**.

Built with React + Vite + TypeScript + Tailwind CSS + Framer Motion.

## Pages

Hash-routed multi-page walkthrough (works on GitHub Pages without a server):

- **Overview** — hero, key stats, system-architecture image, the platform in six moves, page directory
- **Architecture** — animated 2.5D system-architecture diagram (Non-RT RIC platform over four Near-RT RIC regions with RAN layer), O-RAN usage, service cards
- **Knowledge** — rApp1 CTI ingestion/pruning pipeline and the Global RAG knowledge base
- **Detection** — interactive play-through simulation of the threat→mitigation path, Mini RAG strict decision logic, ThreatEvent contract
- **MCP** — the Model Context Protocol backbone: three FastMCP servers and their typed tools, plus the two pipelines (vertical escalation, horizontal distribution) with an animated diagram
- **Sharing** — inter-platform STIX/TAXII-style threat sharing with similarity-gated ingestion
- **Dashboard** — rApp2 region-partitioned persistence, the live monitoring UI, demo video and live-deployment link
- **Run Guide** — dependency-ordered startup sequence
- **Future** — planned research extensions: domain-wise CTI feeds, vendor/operator subscriptions, immediate-action highlighting, an end-to-end dApp and a UE penetration-testing tool

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build & deploy

```bash
npm run build              # outputs static site to dist/
npx gh-pages -d dist --nojekyll   # publish to gh-pages branch
```

`vite.config.ts` uses `base: './'`, so `dist/` works on GitHub Pages under any repository path.

## Structure

- `src/router.ts` — hash-based page navigation
- `src/components/` — Nav, shared UI, `IsometricArchitecture` (main diagram), `DetectionSim` (interactive simulator)
- `src/pages/` — one file per page
