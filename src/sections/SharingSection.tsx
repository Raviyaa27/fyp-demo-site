import { Section, Stepper, FileBadge, Endpoint, REGION_COLORS } from '../components/ui'

export default function SharingSection() {
  return (
    <Section
      id="sharing"
      kicker="Section 6 · Cross-Region Collaboration"
      title="Inter-Platform Threat Sharing"
      intro={
        <>
          Confirmed threats in one region become intelligence for the others — but only through the{' '}
          <strong>Inter-Platform Agent</strong> (<FileBadge>inter-platform-agent/app/main.py</FileBadge>), never by
          writing directly into another region's database. Shared records are always tagged as{' '}
          <strong>external/shared intel</strong>, distinct from internally detected threats.
        </>
      }
    >
      {/* sharing diagram: region 1 -> agent -> regions 2,3,4 */}
      <div className="card mb-10 overflow-x-auto p-4">
        <svg viewBox="0 0 1000 260" className="min-w-[760px]" role="img" aria-label="Inter-platform sharing flow">
          <defs>
            <marker id="sp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0L10 5L0 10z" fill="#7c3aed" />
            </marker>
          </defs>
          <rect x={30} y={95} width={190} height={70} rx={10} fill={`${REGION_COLORS.region_1}0d`} stroke={REGION_COLORS.region_1} strokeWidth={1.5} />
          <text x={125} y={124} textAnchor="middle" fontSize={13} fontWeight={700}>Region 1 detects</text>
          <text x={125} y={144} textAnchor="middle" fontSize={11} fill="#64748b">confirmed threat + mitigation</text>

          <line x1={220} y1={130} x2={330} y2={130} stroke="#7c3aed" strokeWidth={2} className="flow-line" markerEnd="url(#sp)" />
          <text x={275} y={118} textAnchor="middle" fontSize={10} fill="#7c3aed">STIX/TAXII bundle</text>

          <rect x={332} y={85} width={220} height={90} rx={10} fill="#f5f3ff" stroke="#7c3aed" strokeWidth={1.5} />
          <text x={442} y={118} textAnchor="middle" fontSize={13} fontWeight={700} fill="#5b21b6">Inter-Platform Agent</text>
          <text x={442} y={140} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="#7c3aed">inter-platform-agent/app/main.py</text>
          <text x={442} y={158} textAnchor="middle" fontSize={10} fill="#7c3aed">fan-out to peer regions</text>

          {([2, 3, 4] as const).map((r, i) => {
            const color = REGION_COLORS[`region_${r}`]
            const y = 30 + i * 85
            return (
              <g key={r}>
                <path d={`M 552 130 C 640 130, 640 ${y + 32}, 700 ${y + 32}`} fill="none" stroke="#7c3aed" strokeWidth={1.8} className="flow-line-slow" markerEnd="url(#sp)" />
                <rect x={702} y={y} width={268} height={64} rx={10} fill={`${color}0d`} stroke={color} strokeWidth={1.5} />
                <text x={836} y={y + 26} textAnchor="middle" fontSize={12} fontWeight={700}>Region {r} Mini RAG</text>
                <text x={836} y={y + 46} textAnchor="middle" fontSize={10} fill="#64748b">known? → ingest only if new</text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
        <Stepper
          color="#7c3aed"
          steps={[
            {
              title: 'Threat confirmed in the source region',
              body: 'A detected threat with its mitigation report becomes a candidate for sharing.',
            },
            {
              title: 'Inter-Platform Agent builds a STIX/TAXII-style bundle',
              badge: 'inter-platform-agent/app/main.py',
              body: 'The threat intel is packaged in a standards-inspired sharing format and sent to peer regions.',
            },
            {
              title: 'Receiving region checks: "Do I already know this?"',
              body: (
                <>
                  The receiving Mini RAG compares the incoming intel against its local KB and returns{' '}
                  <strong>YES/NO, a similarity score, reasoning and a threshold decision</strong> — e.g. YES if
                  similarity ≥ 75%, otherwise NO.
                </>
              ),
            },
            {
              title: 'Unknown intel is ingested — into that region only',
              body: (
                <>
                  <Endpoint>POST /api/v1/ingest-local-knowledge</Endpoint> appends the intel to the receiving
                  region's Mini RAG KB and vector DB. Known intel is skipped, preventing duplicates.
                </>
              ),
            },
            {
              title: 'rApp2 records the shared threat',
              body: 'The external threat and its mitigation report are saved via the rApp2 Mini RAG persistence endpoints, tagged as external/shared intel — not internally detected.',
            },
            {
              title: 'Dashboard shows it with a visible "shared" tag',
              body: 'Shared/external threats appear separately or clearly tagged, so reviewers can distinguish local detections from peer intelligence.',
            },
            {
              title: 'Cyber Probe Manager can act on it',
              body: 'The receiving region’s xApp1 can use the shared mitigation intelligence for local defensive action — before that threat ever hits the region.',
            },
          ]}
        />
        <div className="space-y-4">
          <div className="card border-l-4 border-l-region4 p-5">
            <h4 className="mb-2 font-bold">Similarity-gated ingestion</h4>
            <div className="rounded-lg bg-slate-800 p-4 font-mono text-[12px] leading-relaxed text-slate-200">
              <div className="text-slate-400">// receiving Mini RAG decision</div>
              <div>known = similarity(incoming, localKB)</div>
              <div>
                <span className="text-emerald-300">if</span> known ≥ <span className="text-amber-300">0.75</span>{' '}
                → <span className="text-emerald-300">YES</span> (skip)
              </div>
              <div>
                <span className="text-emerald-300">else</span> → <span className="text-rose-300">NO</span> (ingest + tag
                as shared)
              </div>
            </div>
          </div>
          <div className="card p-5">
            <h4 className="mb-2 font-bold">Why not sync databases directly?</h4>
            <p className="text-sm leading-relaxed text-slate-600">
              Direct DB writes across regions would break the isolation model and hide provenance. Routing
              everything through the agent keeps each region in control of what it accepts, deduplicates on
              arrival, and preserves a clear external/shared audit trail.
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
}
