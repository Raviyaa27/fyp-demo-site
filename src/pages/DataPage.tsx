import { PageHeader, Block, Stepper, FileBadge, Endpoint, REGION_COLORS } from '../components/ui'

export default function DataPage() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <PageHeader
        kicker="Persistence & Live Monitoring"
        title={
          <>
            rApp2 storage and the <span className="grad-text">global dashboard</span>
          </>
        }
        lead={
          <>
            Every Mini RAG result lands in region-specific PostgreSQL tables via rApp2, and each save triggers a
            notification that becomes a live WebSocket push to the dashboard — no polling anywhere in the pipeline.
          </>
        }
      />

      <Block title="rApp2 — region-partitioned persistence">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <div className="card card-hover p-6">
            <h3 className="mb-4 font-bold">PostgreSQL tables</h3>
            <div className="space-y-3">
              {([1, 2, 3, 4] as const).map((r) => {
                const color = REGION_COLORS[`region_${r}`]
                return (
                  <div key={r} className="rounded-xl border border-line p-3" style={{ borderLeft: `4px solid ${color}` }}>
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
            <div className="mt-3">
              <FileBadge>fyp-cti-non-rt-ric/cti-rapp2/app.py</FileBadge>
            </div>
          </div>
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
                    Connected clients on <Endpoint>/ws/{'{region_id}'}</Endpoint> receive the update instantly — the
                    dashboard refreshes live during the demo.
                  </>
                ),
              },
            ]}
          />
        </div>
      </Block>

      <Block
        title="The global monitoring UI"
        intro={
          <>
            The dashboard is the single pane of glass over all four regions. A region selector switches the view;
            each region streams its own live updates. It shows threat lists with severity, status, confidence and
            affected component, per-threat mitigation insight, regional stats and metrics history — and shared/
            external intel carries a visible tag distinguishing it from local detections.
          </>
        }
        className="pb-16"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card card-hover p-6">
            <h3 className="mb-3 font-bold">Backend API</h3>
            <div className="flex flex-col items-start gap-2">
              <Endpoint>GET /cti/threats?region_id=region_1</Endpoint>
              <Endpoint>GET /cti/threats/{'{id}'}/insight?region_id=region_1</Endpoint>
              <Endpoint>GET /cti/stats?region_id=region_1</Endpoint>
              <Endpoint>GET /cti/metrics/history?region_id=region_1</Endpoint>
              <Endpoint>WS /ws/{'{region_id}'}</Endpoint>
            </div>
            <div className="mt-4">
              <FileBadge>dashboard-backend/dashboard_backend.py</FileBadge>
            </div>
          </div>
          <div className="card card-hover p-6">
            <h3 className="mb-3 font-bold">Frontend (React)</h3>
            <p className="mb-3 text-sm leading-relaxed text-slate-600">
              The UI consumes the REST API for initial loads and subscribes to the region's WebSocket channel for
              live pushes triggered by rApp2 saves. Users switch regions with the region selector.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <FileBadge>cti_dashboard/src/services/api.service.ts</FileBadge>
              <FileBadge>cti_dashboard/src/pages/DashboardNew.tsx</FileBadge>
              <FileBadge>cti_dashboard/src/pages/ThreatsPageNew.tsx</FileBadge>
              <FileBadge>cti_dashboard/src/components/RegionSelector.tsx</FileBadge>
            </div>
          </div>
        </div>
      </Block>
    </div>
  )
}
