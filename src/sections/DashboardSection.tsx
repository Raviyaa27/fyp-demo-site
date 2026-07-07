import { Section, FileBadge, Endpoint, ScreenshotPlaceholder } from '../components/ui'

export default function DashboardSection() {
  return (
    <Section
      id="dashboard"
      kicker="Sections 6 & 7 · Monitoring"
      title="Global Dashboard & Screenshot Gallery"
      tint="#fbfcfe"
      intro={
        <>
          The dashboard is the <strong>global monitoring UI</strong> over all four Near-RT RIC regions. A region
          selector (<FileBadge>RegionSelector.tsx</FileBadge>) switches the view; each region streams its own live
          updates over WebSocket. It shows threat lists with severity, status, confidence and affected component,
          per-threat mitigation insight, regional stats, metrics history — and tags shared/external intel
          distinctly from local detections.
        </>
      }
    >
      <div className="mb-10 grid gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="mb-3 font-bold">Backend API</h3>
          <div className="flex flex-col items-start gap-2">
            <Endpoint>GET /cti/threats?region_id=region_1</Endpoint>
            <Endpoint>GET /cti/threats/{'{id}'}/insight?region_id=region_1</Endpoint>
            <Endpoint>GET /cti/stats?region_id=region_1</Endpoint>
            <Endpoint>GET /cti/metrics/history?region_id=region_1</Endpoint>
            <Endpoint>WS /ws/{'{region_id}'}</Endpoint>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <FileBadge>dashboard-backend/dashboard_backend.py</FileBadge>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="mb-3 font-bold">Frontend (React)</h3>
          <p className="mb-3 text-sm leading-relaxed text-slate-600">
            The UI consumes the REST API for initial loads and subscribes to the region's WebSocket channel for
            live pushes triggered by rApp2 saves.
          </p>
          <div className="flex flex-wrap gap-1.5">
            <FileBadge>cti_dashboard/src/services/api.service.ts</FileBadge>
            <FileBadge>cti_dashboard/src/pages/DashboardNew.tsx</FileBadge>
            <FileBadge>cti_dashboard/src/pages/ThreatsPageNew.tsx</FileBadge>
            <FileBadge>cti_dashboard/src/components/RegionSelector.tsx</FileBadge>
          </div>
        </div>
      </div>

      <h3 className="mb-4 text-lg font-bold">Screenshot gallery</h3>
      <p className="mb-6 text-sm text-slate-500">
        Replace each placeholder below with a real capture from the running dashboard.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <ScreenshotPlaceholder tall caption="Global overview — all four regions with live threat counts, severity distribution and regional stats." />
        <ScreenshotPlaceholder tall caption="Threats page — region-filtered threat list with severity, status, confidence and affected component." />
        <ScreenshotPlaceholder caption="Mitigation insight panel — structured recommendation for a selected threat, including escalation source (local vs Global RAG)." />
        <ScreenshotPlaceholder caption="Metrics history — time-series view of detections per region." />
        <ScreenshotPlaceholder caption="Live update in action — WebSocket push arriving after a Mini RAG saves to rApp2." />
        <ScreenshotPlaceholder caption="Shared/external intel — a threat received from a peer region, shown with its 'shared' tag." />
      </div>
    </Section>
  )
}
