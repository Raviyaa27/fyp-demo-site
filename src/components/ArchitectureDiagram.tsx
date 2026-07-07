import { REGION_COLORS } from './ui'

const regions = [1, 2, 3, 4] as const
const colX = [60, 340, 620, 900] // left edge of each region column
const COL_W = 240
const cx = (i: number) => colX[i] + COL_W / 2

function Box({
  x,
  y,
  w,
  h,
  title,
  sub,
  color = '#334155',
  fill = 'white',
}: {
  x: number
  y: number
  w: number
  h: number
  title: string
  sub?: string
  color?: string
  fill?: string
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={fill} stroke={color} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 4 : h / 2 + 4)} textAnchor="middle" fontSize={13} fontWeight={700} fill="#1b2432">
        {title}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" fontSize={10} fontFamily="JetBrains Mono, monospace" fill="#64748b">
          {sub}
        </text>
      )}
    </g>
  )
}

export default function ArchitectureDiagram() {
  return (
    <div className="card overflow-x-auto p-4">
      <svg viewBox="0 0 1200 800" className="min-w-[900px]" role="img" aria-label="Multi-region O-RAN CTI platform architecture">
        <defs>
          {[...new Set(['#be123c', '#475569', '#7c3aed', ...regions.map((r) => REGION_COLORS[`region_${r}`])])].map((c) => (
            <marker key={c} id={`arr-${c.slice(1)}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" fill={c} />
            </marker>
          ))}
        </defs>

        {/* ---- Non-RT RIC / SMO layer ---- */}
        <rect x={40} y={26} width={1120} height={170} rx={14} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth={1.5} />
        <text x={60} y={52} fontSize={14} fontWeight={800} fill="#1b2432">
          Non-RT RIC / SMO / Global CTI Layer
        </text>
        <Box x={60} y={70} w={160} h={100} title="rApp1" sub="CTI ingest + prune" color="#0e7490" />
        <Box x={240} y={70} w={160} h={100} title="rApp2" sub="events + mitigations API" color="#0e7490" />
        <Box x={420} y={70} w={150} h={100} title="PostgreSQL" sub="region tables" color="#475569" />
        <Box x={600} y={70} w={170} h={100} title="Global RAG" sub="/api/analyze · /mcp" color="#be123c" fill="#fff1f2" />
        <Box x={800} y={70} w={170} h={100} title="Inter-Platform Agent" sub="STIX/TAXII sharing" color="#7c3aed" fill="#f5f3ff" />
        <Box x={1000} y={70} w={150} h={100} title="Dashboard Backend" sub="/ws/{region_id}" color="#475569" />

        {/* top-layer internal arrows */}
        <line x1={220} y1={120} x2={240} y2={120} stroke="#475569" strokeWidth={2} markerEnd="url(#arr-475569)" />
        <line x1={400} y1={120} x2={420} y2={120} stroke="#475569" strokeWidth={2} markerEnd="url(#arr-475569)" />
        <path d="M320 70 C 320 40, 1075 30, 1075 70" fill="none" stroke="#475569" strokeWidth={2} className="flow-line-slow" markerEnd="url(#arr-475569)" />
        <text x={690} y={38} textAnchor="middle" fontSize={10} fill="#64748b">
          rApp2 notifies dashboard backend → WebSocket broadcast
        </text>

        {/* interfaces band */}
        <rect x={40} y={222} width={1120} height={34} rx={8} fill="#eff6ff" stroke="#bfdbfe" />
        <text x={600} y={244} textAnchor="middle" fontSize={12} fontWeight={600} fill="#1d4ed8">
          Monitored O-RAN interfaces: A1 · E2 · F1 · O1 · Open Fronthaul
        </text>

        {/* ---- Region columns ---- */}
        {regions.map((r, i) => {
          const color = REGION_COLORS[`region_${r}`]
          const x = colX[i]
          return (
            <g key={r}>
              <rect x={x} y={300} width={COL_W} height={430} rx={14} fill={`${color}0d`} stroke={color} strokeWidth={1.5} />
              <text x={cx(i)} y={326} textAnchor="middle" fontSize={13} fontWeight={800} fill={color}>
                Region {r} — Near-RT RIC (ric-{r})
              </text>
              <Box x={x + 20} y={344} w={COL_W - 40} h={56} title="xApp2 Threat Simulator" sub="A1 / E2 / F1 threats" color={color} />
              <line x1={cx(i)} y1={400} x2={cx(i)} y2={424} stroke={color} strokeWidth={2} className="flow-line" markerEnd={`url(#arr-${color.slice(1)})`} />
              <Box x={x + 20} y={426} w={COL_W - 40} h={56} title="xApp1 Cyber Probe Mgr" sub="POST /api/events" color={color} />
              <line x1={cx(i)} y1={482} x2={cx(i)} y2={506} stroke={color} strokeWidth={2} className="flow-line" markerEnd={`url(#arr-${color.slice(1)})`} />
              <Box x={x + 20} y={508} w={COL_W - 40} h={56} title={`Mini RAG Region ${r}`} sub="/api/v1/analyze-threat" color={color} />
              <line x1={cx(i)} y1={564} x2={cx(i)} y2={588} stroke={color} strokeWidth={2} className="flow-line" markerEnd={`url(#arr-${color.slice(1)})`} />
              <Box x={x + 20} y={590} w={COL_W - 40} h={56} title="Regional KB + Vector DB" sub={`data/region_${r}/threats.json`} color={color} />
              <text x={cx(i)} y={676} textAnchor="middle" fontSize={10} fontWeight={600} fill={color}>
                Local learning updates only this region
              </text>
              <text x={cx(i)} y={694} textAnchor="middle" fontSize={10} fill="#64748b">
                Isolated from other regions
              </text>

              {/* escalation: Mini RAG -> Global RAG (dashed rose) */}
              <path
                d={`M ${cx(i) + 40} 508 C ${cx(i) + 40} ${330 - i * 10}, 685 ${240 - i * 6}, 685 172`}
                fill="none"
                stroke="#be123c"
                strokeWidth={1.8}
                className="flow-line-slow"
                markerEnd="url(#arr-be123c)"
                opacity={0.85}
              />
              {/* persistence: Mini RAG -> rApp2 (solid slate) */}
              <path
                d={`M ${cx(i) - 60} 508 C ${cx(i) - 60} ${350 - i * 12}, 320 ${270 - i * 8}, 320 172`}
                fill="none"
                stroke="#94a3b8"
                strokeWidth={1.4}
                markerEnd="url(#arr-475569)"
                opacity={0.7}
              />
              {/* sharing: Inter-Platform Agent <-> region (purple dashed) */}
              <path
                d={`M 885 172 C 885 ${250 - i * 6}, ${cx(i) + 88} ${300 - i * 4}, ${cx(i) + 88} 300`}
                fill="none"
                stroke="#7c3aed"
                strokeWidth={1.6}
                className="flow-line-slow"
                markerEnd={`url(#arr-${color.slice(1)})`}
                opacity={0.7}
              />
            </g>
          )
        })}

        {/* legend */}
        <g fontSize={11} fill="#475569">
          <line x1={70} y1={766} x2={110} y2={766} stroke="#be123c" strokeWidth={2} className="flow-line-slow" />
          <text x={118} y={770}>Escalation to Global RAG (only when local match is weak)</text>
          <line x1={480} y1={766} x2={520} y2={766} stroke="#7c3aed" strokeWidth={2} className="flow-line-slow" />
          <text x={528} y={770}>Cross-region intel via Inter-Platform Agent only</text>
          <line x1={850} y1={766} x2={890} y2={766} stroke="#94a3b8" strokeWidth={2} />
          <text x={898} y={770}>Events + mitigation reports → rApp2</text>
        </g>
      </svg>
    </div>
  )
}
