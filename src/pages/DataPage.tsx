import { motion } from 'framer-motion'
import { PageHeader, Block, Stepper, FileBadge, Endpoint, REGION_COLORS } from '../components/ui'
import dashboardVideo from '../assets/dashboard-video.mp4'

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
            notification that becomes a live WebSocket push to the dashboard, with no polling anywhere in the pipeline.
          </>
        }
      />

      <Block title="rApp2: region-partitioned persistence">
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
            <h4 className="mt-5 mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              Platform-wide tables
            </h4>
            <div className="flex flex-col gap-1 font-mono text-[11px] text-slate-600">
              <span>intelligence_evaluations</span>
              <span>intelligence_snapshots</span>
              <span>subscriptions</span>
              <span>notification_log</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Evaluation sessions and knowledge snapshots back the intelligence-growth view; the notification log is
              the idempotency guard that stops a threat being emailed twice.
            </p>
            <div className="mt-3">
              <FileBadge>cti-rapp2/app.py</FileBadge>
            </div>
          </div>
          <Stepper
            color="#0e7490"
            steps={[
              {
                title: 'Mini RAG posts the threat event',
                body: (
                  <>
                    <Endpoint>POST /api/mini-rag/events</Endpoint>, stored in the region's{' '}
                    <code className="font-mono text-xs">…_events</code> table.
                  </>
                ),
              },
              {
                title: 'Mini RAG posts the mitigation report',
                body: (
                  <>
                    <Endpoint>POST /api/mini-rag/mitigations</Endpoint>, stored in the region's{' '}
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
                    Connected clients on <Endpoint>/ws/{'{region_id}'}</Endpoint> receive the update instantly, so the
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
            affected component, per-threat mitigation insight, regional stats and metrics history. Shared or
            external intel carries a visible tag distinguishing it from local detections.
          </>
        }
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card card-hover p-6">
            <h3 className="mb-3 font-bold">Backend API</h3>
            <div className="flex flex-col items-start gap-2">
              <Endpoint>GET /cti/threats?region_id=region_1</Endpoint>
              <Endpoint>GET /cti/threats/{'{id}'}/insight</Endpoint>
              <Endpoint>GET /cti/stats?region_id=region_1</Endpoint>
              <Endpoint>GET /cti/metrics/history</Endpoint>
              <Endpoint>GET /cti/mitigations</Endpoint>
              <Endpoint>GET /cti/intelligence/growth</Endpoint>
              <Endpoint>GET /cti/intelligence/evaluations</Endpoint>
              <Endpoint>GET /inter-platform/threats/shared</Endpoint>
              <Endpoint>WS /ws/{'{region_id}'}</Endpoint>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              Internal hooks feed the live stream: <code className="font-mono text-[11px]">/internal/mini-rag/broadcast</code>,{' '}
              <code className="font-mono text-[11px]">/internal/mitigation/lifecycle</code> and{' '}
              <code className="font-mono text-[11px]">/internal/ipa/distribution</code>.
            </p>
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

      <Block
        title="Subscriptions, alerts and operator feedback"
        intro={
          <>
            Vendors, operators and security teams subscribe to one or more regions. When a threat is detected,
            analysed, mitigated or shared from a subscribed region, the notification service emails them the full
            picture, so they can act without watching the dashboard. What they do next is recorded and fed back.
          </>
        }
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="card overflow-hidden"
          >
            <div className="flex items-center gap-1.5 border-b border-line bg-slate-50 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="ml-2 text-[11px] font-semibold text-slate-500">What the alert email carries</span>
            </div>
            <dl className="px-5 py-3">
              {([
                ['Threat summary', 'the detected finding in one line'],
                ['Affected component', 'the O-RAN element that is exposed'],
                ['Affected interface', 'A1 / E2 / F1 / O1'],
                ['Severity & confidence', 'the graded assessment and its score'],
                ['Immediate actions', 'the "take action now" tier, first in the message'],
                ['Detailed mitigations', 'the longer-term recommendations'],
                ['Evidence correlation', 'the rule, value and threshold behind the alert'],
                ['Source region', 'and whether the intel arrived by sharing'],
              ] as const).map(([k, v]) => (
                <div key={k} className="flex items-baseline gap-3 border-b border-dashed border-line py-1.5 last:border-0">
                  <dt className="w-[152px] shrink-0 text-[10.5px] font-bold uppercase tracking-wide text-slate-400">
                    {k}
                  </dt>
                  <dd className="text-[12px] text-slate-600">{v}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
          <div className="space-y-4">
            <div className="card card-hover border-l-4 border-l-amber-500 p-5">
              <h4 className="mb-2 font-bold">Emailed once, never twice</h4>
              <p className="text-sm leading-relaxed text-slate-600">
                Delivery is gated by a notification log keyed per threat, so a re-broadcast or a restart cannot spam a
                subscriber. If SMTP is disabled the message is still rendered and logged, which keeps the path
                testable without sending mail.
              </p>
            </div>
            <div className="card card-hover border-l-4 border-l-emerald-600 p-5">
              <h4 className="mb-2 font-bold">Closing the loop</h4>
              <p className="mb-3 text-sm leading-relaxed text-slate-600">
                Operators record which recommended actions they actually applied, any extra action they took, and how
                useful the recommendation was. That feedback is persisted with the threat and can become reviewed
                regional knowledge, so a later comparable event is handled with stronger local context.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <Endpoint>POST /notifications/feedback</Endpoint>
                <Endpoint>GET /notifications/feedback</Endpoint>
              </div>
            </div>
            <div className="card card-hover p-5">
              <h4 className="mb-2 font-bold">Files</h4>
              <div className="flex flex-wrap gap-1.5">
                <FileBadge>dashboard-backend/notifications.py</FileBadge>
                <FileBadge>dashboard-backend/dashboard_backend.py</FileBadge>
              </div>
            </div>
          </div>
        </div>
      </Block>

      <Block
        title="The dashboard in action"
        intro={
          <>
            A recorded walkthrough of the live monitoring UI: region switching, live threat updates, mitigation
            insight and the shared-intel tags, followed by a link to the running deployment.
          </>
        }
        className="pb-16"
      >
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="card overflow-hidden"
        >
          <video
            src={dashboardVideo}
            controls
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
            className="w-full bg-slate-900"
          />
          <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-slate-50/60 px-5 py-3 text-xs text-slate-500">
            <span>Global dashboard demo: live threats, stats and mitigation insights across all four regions.</span>
            <a
              href="http://193.1.132.238/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-xs font-bold text-white shadow transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Open the live dashboard
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          </figcaption>
        </motion.figure>
      </Block>
    </div>
  )
}
