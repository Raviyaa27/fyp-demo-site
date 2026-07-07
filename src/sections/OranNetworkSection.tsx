import { Section, RegionChip, FileBadge, REGION_COLORS } from '../components/ui'

const perRegion = [
  'Own Mini RAG agent',
  'Own regional threat knowledge base',
  'Own regional vector database',
  'Own event & mitigation tables in rApp2',
  'Own WebSocket / dashboard stream',
]

export default function OranNetworkSection() {
  return (
    <Section
      id="oran-network"
      kicker="O-RAN Foundations"
      title="How the O-RAN Network Is Used"
      tint="#fbfcfe"
      intro={
        <>
          The project models a multi-region O-RAN deployment with <strong>four independent Near-RT RIC
          environments</strong> under a single Non-RT RIC / SMO layer. Crucially, the O-RAN network is{' '}
          <strong>not treated as one flat system</strong>: CTI processing is separated per Near-RT RIC region, so
          each RIC learns from its own threats while still being able to escalate to Global RAG and share
          intelligence with peers.
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {([1, 2, 3, 4] as const).map((r) => {
          const color = REGION_COLORS[`region_${r}`]
          return (
            <div key={r} className="card p-5" style={{ borderTop: `3px solid ${color}` }}>
              <div className="mb-2 flex items-center justify-between">
                <RegionChip region={r} />
                <span className="font-mono text-xs text-slate-400">ric-{r}</span>
              </div>
              <h3 className="mb-2 font-bold">Near-RT RIC {r}</h3>
              <p className="mb-3 text-xs text-slate-500">A separate regional RAN control domain with:</p>
              <ul className="space-y-1.5 text-[13px] text-slate-600">
                {perRegion.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="mb-3 font-bold">Near-RT RIC side (regional)</h3>
          <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
            <li>
              <FileBadge>xapp2_threat_simulator.py</FileBadge> simulates threat telemetry targeting O-RAN
              interfaces such as <strong>A1, E2 and F1</strong>.
            </li>
            <li>
              <FileBadge>xapp1_probe_manager_new.py</FileBadge> is the <strong>Cyber Probe Manager xApp</strong> —
              it receives events from xApp2 and forwards them to the correct regional Mini RAG.
            </li>
            <li>
              The <strong>Mini RAG agent</strong> acts as the regional intelligence / mitigation assistant for its
              Near-RT RIC, and later consumes shared intel so the Cyber Probe Manager can act defensively.
            </li>
          </ul>
        </div>
        <div className="card p-6">
          <h3 className="mb-3 font-bold">Non-RT RIC / SMO side (global)</h3>
          <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
            <li>
              Hosts the rApps: <strong>rApp1</strong> (prepares CTI knowledge), <strong>rApp2</strong> (stores
              threats and mitigation reports), <strong>Global RAG</strong>, the{' '}
              <strong>Inter-Platform Agent</strong> and the <strong>Dashboard Backend</strong>.
            </li>
            <li>
              <strong>Global RAG</strong> provides full CTI reasoning whenever a regional Mini RAG's confidence is
              too low.
            </li>
            <li>
              The <strong>dashboard</strong> monitors all four Near-RT RIC regions from one global view, while the
              monitored interface set spans <strong>A1 · E2 · F1 · O1 · Open Fronthaul</strong>.
            </li>
          </ul>
        </div>
      </div>
    </Section>
  )
}
