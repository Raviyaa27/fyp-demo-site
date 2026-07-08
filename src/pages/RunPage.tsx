import { PageHeader, Block, Stepper, FileBadge } from '../components/ui'

export default function RunPage() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <PageHeader
        kicker="Running the Platform"
        title={
          <>
            Execution order & <span className="grad-text">startup guide</span>
          </>
        }
        lead={
          <>
            Services come up in dependency order: storage first, then the global knowledge layer, then the regional
            agents, and finally the traffic generators. This is also the recommended order for a live
            demonstration.
          </>
        }
      />

      <Block title="Startup sequence" className="pb-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_330px]">
          <Stepper
            steps={[
              {
                title: 'PostgreSQL database',
                body: 'Start the database that backs rApp2 (region-specific event and mitigation tables).',
              },
              {
                title: 'rApp2 — persistence API',
                badge: 'cti-rapp2/app.py',
                body: 'Brings up the /api/mini-rag/events and /api/mini-rag/mitigations endpoints and the dashboard notification hook.',
              },
              {
                title: 'Dashboard backend + frontend',
                badge: 'dashboard_backend.py',
                body: 'Start the WebSocket/REST backend, then the React dashboard, so live updates are visible from the very first event.',
              },
              {
                title: 'Global RAG API server',
                badge: 'rag/api_server.py',
                body: 'Loads the global knowledge base and ChromaDB vector store; exposes /api/analyze and /mcp for escalations.',
              },
              {
                title: 'Mini RAG agents — regions 1 to 4',
                badge: 'k8s/mini-rag-region-*.yaml',
                body: 'Deploy the four regional agents; each loads its own data/region_N/threats.json and regional vector DB.',
              },
              {
                title: 'Inter-Platform Agent',
                badge: 'inter-platform-agent/app/main.py',
                body: 'Enables cross-region STIX/TAXII-style sharing between the now-running Mini RAGs.',
              },
              {
                title: 'xApp1 Cyber Probe Manager (per region)',
                badge: 'xapp1_probe_manager_new.py',
                body: 'Starts listening on /api/events and knows the address of its regional Mini RAG.',
              },
              {
                title: 'xApp2 Threat Simulator (per region)',
                badge: 'xapp2_threat_simulator.py',
                body: 'Last to start — begins generating simulated A1/E2/F1 threats, driving the whole pipeline end-to-end.',
              },
            ]}
          />
          <div className="space-y-4">
            <div className="card card-hover border-l-4 border-l-cyan-700 p-5">
              <h4 className="mb-2 font-bold">rApp1 runs independently</h4>
              <p className="text-sm leading-relaxed text-slate-600">
                The CTI ingestion/pruning pipeline is a periodic CronJob (<FileBadge>rapp1-cronjob.yaml</FileBadge>).
                It should have run at least once before the RAG services start, so the knowledge bases are seeded —
                but it is not part of the live startup chain.
              </p>
            </div>
            <div className="card card-hover p-5">
              <h4 className="mb-2 font-bold">Demo tip</h4>
              <p className="text-sm leading-relaxed text-slate-600">
                Keep the dashboard visible while starting xApp2: the first simulated threats flow through detection,
                analysis, persistence and WebSocket broadcast within seconds, which makes the full pipeline easy to
                narrate to examiners.
              </p>
            </div>
          </div>
        </div>
      </Block>
    </div>
  )
}
