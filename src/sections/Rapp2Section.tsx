import { Section, FileBadge, Endpoint, REGION_COLORS, Stepper } from '../components/ui'

export default function Rapp2Section() {
  return (
    <Section
      id="rapp2"
      kicker="Section 5 · Persistence & Live Updates"
      title="rApp2 — Region-Partitioned Storage & Dashboard Broadcast"
      tint="#fbfcfe"
      intro={
        <>
          rApp2 (<FileBadge>fyp-cti-non-rt-ric/cti-rapp2/app.py</FileBadge>) is the persistence rApp. Every Mini
          RAG result lands in <strong>region-specific PostgreSQL tables</strong>, and each save triggers a
          notification that becomes a live WebSocket push to the dashboard — no polling.
        </>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <div className="card p-6">
          <h3 className="mb-4 font-bold">PostgreSQL — region-partitioned tables</h3>
          <div className="space-y-3">
            {([1, 2, 3, 4] as const).map((r) => {
              const color = REGION_COLORS[`region_${r}`]
              return (
                <div key={r} className="rounded-lg border border-line p-3" style={{ borderLeft: `4px solid ${color}` }}>
                  <div className="mb-1 text-xs font-bold" style={{ color }}>
                    Region {r}
                  </div>
                  <div className="flex flex-col gap-1 font-mono text-[11px] text-slate-600">
                    <span>mini_rag_region_{r}_events</span>
                    <span>mini_rag_region_{r}_mitigations</span>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            Separate tables per region reinforce the isolation model: a region's data can be queried, purged or
            audited independently.
          </p>
        </div>
        <div>
          <Stepper
            color="#0e7490"
            steps={[
              {
                title: 'Mini RAG posts the threat event',
                body: (
                  <>
                    <Endpoint>POST /api/mini-rag/events</Endpoint> — stored in the region's{' '}
                    <code className="font-mono text-xs">…_events</code> table.
                  </>
                ),
              },
              {
                title: 'Mini RAG posts the mitigation report',
                body: (
                  <>
                    <Endpoint>POST /api/mini-rag/mitigations</Endpoint> — stored in the region's{' '}
                    <code className="font-mono text-xs">…_mitigations</code> table.
                  </>
                ),
              },
              {
                title: 'rApp2 notifies the dashboard backend',
                body: 'Immediately after a successful save, rApp2 pings the dashboard backend with the new record.',
              },
              {
                title: 'Dashboard backend broadcasts over WebSocket',
                badge: 'dashboard_backend.py',
                body: (
                  <>
                    Connected clients on <Endpoint>/ws/{'{region_id}'}</Endpoint> receive the update instantly —
                    the dashboard refreshes live during the demo.
                  </>
                ),
              },
            ]}
          />
        </div>
      </div>
    </Section>
  )
}
