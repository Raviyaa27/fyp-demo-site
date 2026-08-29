# Multi-Region O-RAN CTI Platform · Project Explainer Site

Interactive technical walkthrough website for the Final Year Project:
**Multi-Region O-RAN CTI Platform with Mini RAG, Global RAG, rApps, xApps, Inter-Platform Threat Sharing, and Global Dashboard**.

Built with React + Vite + TypeScript + Tailwind CSS + Framer Motion.

## Pages

Hash-routed multi-page walkthrough (works on GitHub Pages without a server):

- **Overview** · hero, key stats, system-architecture image, the platform in six moves, page directory
- **Architecture** · animated 2.5D system-architecture diagram (Non-RT RIC platform over four Near-RT RIC regions with RAN layer), O-RAN usage, service cards
- **Knowledge** · the CTI ingestion pipeline (ATT&CK, FiGHT, CVSS, CISA KEV → STIX 2.1 → pruning → ArangoDB → TAXII 2.1), domain feeds and the Global RAG knowledge base
- **Detection** · the Anomaly Detection Gateway: Prometheus, Loki, Falco and E2SM-KPM normalised into one schema, the deployed rule set, and the play-through pipeline simulation
- **Mitigation** · guarded automated response: the candidate lifecycle, five actuators, safety gates, verification and rollback
- **MCP** · the Model Context Protocol backbone: three FastMCP servers and their typed tools, plus the two pipelines (vertical escalation, horizontal distribution) with an animated diagram
- **Sharing** · inter-platform STIX/TAXII-style threat sharing with similarity-gated ingestion
- **Dashboard** · rApp2 region-partitioned persistence, subscriptions and operator feedback, the live monitoring UI, demo video and deployment link
- **Evaluation** · the frozen benchmark, the 54/36/10 composite score, the 750-event campaign, the OpenCTI comparison and the observability stack
- **Run Guide** · dependency-ordered startup sequence
- **Future** · what remains: an end-to-end dApp and a controlled UE penetration-testing tool

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

- `src/router.ts` · hash-based page navigation
- `src/components/` · Nav, shared UI, `IsometricArchitecture` (main diagram), `DetectionSim` (interactive simulator)
- `src/pages/` · one file per page
