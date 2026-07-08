import { REGION_COLORS } from './ui'

/**
 * Enhanced 2.5D recreation of the official system-architecture drawing:
 * a Non-RT RIC / O-Cloud / SMO platform slab hosting the global services,
 * four staggered Near-RT RIC region slabs, and a RAN layer per region
 * (O-CU / O-DU / O-RU + Cyber Probe) connected over E2.
 */

type Glyph =
  | 'server'
  | 'db'
  | 'chip'
  | 'bot'
  | 'bell'
  | 'funnel'
  | 'bug'
  | 'radar'
  | 'client'
  | 'node'

function GlyphShape({ kind, color }: { kind: Glyph; color: string }) {
  switch (kind) {
    case 'server':
      return (
        <g>
          <rect x={-13} y={-16} width={26} height={13} rx={2.5} fill="#334155" />
          <rect x={-13} y={0} width={26} height={13} rx={2.5} fill="#475569" />
          <circle cx={-7} cy={-9.5} r={1.8} fill="#4ade80" />
          <circle cx={-7} cy={6.5} r={1.8} fill="#60a5fa" />
          <rect x={-1} y={-11} width={11} height={3} rx={1.5} fill="#94a3b8" />
          <rect x={-1} y={5} width={11} height={3} rx={1.5} fill="#94a3b8" />
        </g>
      )
    case 'db':
      return (
        <g>
          <path d="M-12 -10 v20 a12 5 0 0 0 24 0 v-20" fill={color} />
          <ellipse cx={0} cy={-10} rx={12} ry={5} fill={color} />
          <ellipse cx={0} cy={-10} rx={12} ry={5} fill="white" opacity={0.35} />
          <path d="M-12 -3 a12 5 0 0 0 24 0" fill="none" stroke="white" strokeWidth={1.4} opacity={0.6} />
          <path d="M-12 4 a12 5 0 0 0 24 0" fill="none" stroke="white" strokeWidth={1.4} opacity={0.6} />
        </g>
      )
    case 'chip':
      return (
        <g>
          {[-9, -3, 3, 9].map((p) => (
            <g key={p}>
              <line x1={p} y1={-18} x2={p} y2={-13} stroke="#64748b" strokeWidth={2} />
              <line x1={p} y1={13} x2={p} y2={18} stroke="#64748b" strokeWidth={2} />
              <line x1={-18} y1={p} x2={-13} y2={p} stroke="#64748b" strokeWidth={2} />
              <line x1={13} y1={p} x2={18} y2={p} stroke="#64748b" strokeWidth={2} />
            </g>
          ))}
          <rect x={-13} y={-13} width={26} height={26} rx={5} fill={color} />
          <rect x={-8} y={-8} width={16} height={16} rx={3} fill="white" opacity={0.22} />
          <text y={4.5} textAnchor="middle" fontSize={10} fontWeight={800} fill="white">
            AI
          </text>
        </g>
      )
    case 'bot':
      return (
        <g>
          <line x1={0} y1={-19} x2={0} y2={-13} stroke={color} strokeWidth={2} />
          <circle cx={0} cy={-19} r={2.4} fill={color} />
          <rect x={-13} y={-13} width={26} height={22} rx={7} fill={color} />
          <circle cx={-5.5} cy={-3.5} r={3} fill="white" />
          <circle cx={5.5} cy={-3.5} r={3} fill="white" />
          <rect x={-6} y={3} width={12} height={2.6} rx={1.3} fill="white" opacity={0.85} />
          <rect x={-9} y={11} width={18} height={6} rx={3} fill={color} opacity={0.55} />
        </g>
      )
    case 'bell':
      return (
        <g>
          <path d="M0 -15 c-7 0 -10 5 -10 12 l-2 8 h24 l-2 -8 c0 -7 -3 -12 -10 -12z" fill="#f59e0b" />
          <circle cx={0} cy={9} r={3.4} fill="#d97706" />
          <circle cx={9} cy={-11} r={6} fill="#ef4444" />
          <text x={9} y={-7.6} textAnchor="middle" fontSize={8.5} fontWeight={800} fill="white">
            !
          </text>
        </g>
      )
    case 'funnel':
      return (
        <g>
          <path d="M-14 -15 h28 l-10 13 v12 l-8 5 v-17 z" fill={color} />
          <ellipse cx={0} cy={-15} rx={14} ry={4.5} fill="white" opacity={0.35} />
        </g>
      )
    case 'bug':
      return (
        <g>
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <line
              key={a}
              x1={Math.cos((a * Math.PI) / 180) * 10}
              y1={Math.sin((a * Math.PI) / 180) * 10}
              x2={Math.cos((a * Math.PI) / 180) * 16}
              y2={Math.sin((a * Math.PI) / 180) * 16}
              stroke="#dc2626"
              strokeWidth={2.4}
              strokeLinecap="round"
            />
          ))}
          <circle r={10.5} fill="#dc2626" />
          <circle r={5} fill="#fecaca" />
        </g>
      )
    case 'radar':
      return (
        <g>
          <circle r={13} fill="#0f172a" />
          <circle r={13} fill="none" stroke="#38bdf8" strokeWidth={1.4} opacity={0.7} />
          <circle r={8} fill="none" stroke="#38bdf8" strokeWidth={1} opacity={0.55} />
          <circle r={3.5} fill="none" stroke="#38bdf8" strokeWidth={1} opacity={0.45} />
          <g>
            <path d="M0 0 L13 -4 A13.6 13.6 0 0 0 10 -9 z" fill="#38bdf8" opacity={0.85} />
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3.2s" repeatCount="indefinite" />
          </g>
          <circle cx={5} cy={5} r={1.8} fill="#4ade80" />
        </g>
      )
    case 'client':
      return (
        <g>
          <rect x={-13} y={-14} width={26} height={20} rx={3.5} fill="#1e293b" />
          <rect x={-10} y={-11} width={20} height={14} rx={2} fill="#38bdf8" opacity={0.85} />
          <rect x={-4} y={8} width={8} height={3} fill="#1e293b" />
          <rect x={-9} y={11} width={18} height={3} rx={1.5} fill="#334155" />
        </g>
      )
    case 'node':
      return (
        <g>
          <rect x={-14} y={-9} width={28} height={18} rx={4} fill="#475569" />
          <rect x={-10} y={-5} width={20} height={3} rx={1.5} fill="#94a3b8" />
          <rect x={-10} y={1} width={12} height={3} rx={1.5} fill="#94a3b8" />
        </g>
      )
  }
}

function Icon({
  x,
  y,
  kind,
  label,
  sub,
  color = '#3b82f6',
  labelColor = '#1e293b',
}: {
  x: number
  y: number
  kind: Glyph
  label: string
  sub?: string
  color?: string
  labelColor?: string
}) {
  return (
    <g transform={`translate(${x},${y})`}>
      <GlyphShape kind={kind} color={color} />
      <text y={30} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={labelColor}>
        {label}
      </text>
      {sub && (
        <text y={41} textAnchor="middle" fontSize={8.5} fill="#64748b">
          {sub}
        </text>
      )}
    </g>
  )
}

/** parallelogram slab with a soft 3D depth edge */
function Slab({
  x,
  y,
  w,
  h,
  skew,
  fill,
  edge,
  stroke,
}: {
  x: number
  y: number
  w: number
  h: number
  skew: number
  fill: string
  edge: string
  stroke: string
}) {
  const top = `${x + skew},${y} ${x + w + skew},${y} ${x + w},${y + h} ${x},${y + h}`
  const depth = 14
  const front = `${x},${y + h} ${x + w},${y + h} ${x + w},${y + h + depth} ${x},${y + h + depth}`
  return (
    <g>
      <polygon points={front} fill={edge} />
      <polygon points={top} fill={fill} stroke={stroke} strokeWidth={1.5} />
    </g>
  )
}

function MovingDot({ path, color, dur, delay = 0, r = 4 }: { path: string; color: string; dur: number; delay?: number; r?: number }) {
  return (
    <circle r={r} fill={color}>
      <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={path} />
    </circle>
  )
}

const REGIONS = [
  { n: 1, x: 30, y: 385 },
  { n: 2, x: 375, y: 495 },
  { n: 3, x: 715, y: 605 },
  { n: 4, x: 1045, y: 715 },
] as const

const SURFACE: Record<number, string> = { 1: '#dcfce7', 2: '#fef3c7', 3: '#fce7f3', 4: '#ede9fe' }
const EDGE: Record<number, string> = { 1: '#86efac', 2: '#fcd34d', 3: '#f9a8d4', 4: '#c4b5fd' }

export default function IsometricArchitecture() {
  return (
    <div className="card overflow-x-auto p-3">
      <svg viewBox="0 0 1440 1000" className="min-w-[1050px]" role="img" aria-label="System architecture — Non-RT RIC platform over four Near-RT RIC regions">
        <defs>
          <marker id="ia-rose" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill="#f43f5e" />
          </marker>
          <marker id="ia-violet" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill="#8b5cf6" />
          </marker>
          <marker id="ia-slate" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill="#64748b" />
          </marker>
          <linearGradient id="ia-plat" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#dbeafe" />
            <stop offset="100%" stopColor="#bfdbfe" />
          </linearGradient>
        </defs>

        {/* ================= Non-RT RIC platform ================= */}
        <Slab x={300} y={112} w={790} h={148} skew={90} fill="url(#ia-plat)" edge="#93c5fd" stroke="#60a5fa" />
        <text x={1015} y={250} textAnchor="end" fontSize={15} fontWeight={800} fill="#1e3a8a">
          Non-RT RIC / O-Cloud / SMO
        </text>

        <Icon x={470} y={168} kind="server" label="MCP Server" color="#334155" />
        <Icon x={610} y={168} kind="db" label="Threat Intel" sub="database rApp2" color="#0e7490" />
        <Icon x={755} y={166} kind="chip" label="Global RAG Agent" color="#be123c" />
        <Icon x={905} y={168} kind="funnel" label="Threat Data" sub="Ingestion rApp1" color="#2563eb" />
        <Icon x={1035} y={166} kind="bell" label="Vendor Notification" sub="rApp" />

        {/* Global dashboard */}
        <g transform="translate(1215,52)">
          <rect x={0} y={0} width={150} height={96} rx={8} fill="#0f172a" />
          <rect x={6} y={6} width={138} height={78} rx={4} fill="#f8fafc" />
          <rect x={12} y={12} width={56} height={5} rx={2.5} fill="#ef4444" />
          <rect x={12} y={22} width={44} height={5} rx={2.5} fill="#f59e0b" />
          <rect x={12} y={32} width={50} height={5} rx={2.5} fill="#eab308" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={80 + i * 15} y={62 - i * 11} width={10} height={16 + i * 11} rx={2} fill="#22c55e">
              <animate attributeName="height" values={`${16 + i * 11};${24 + i * 11};${16 + i * 11}`} dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
              <animate attributeName="y" values={`${62 - i * 11};${54 - i * 11};${62 - i * 11}`} dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
            </rect>
          ))}
          <rect x={12} y={62} width={56} height={16} rx={3} fill="#3b82f6" opacity={0.25} />
          <rect x={65} y={96} width={20} height={10} fill="#334155" />
          <rect x={48} y={106} width={54} height={6} rx={3} fill="#475569" />
          <text x={75} y={130} textAnchor="middle" fontSize={12} fontWeight={800} fill="#0f172a">
            Global Dashboard
          </text>
        </g>
        <line x1={1128} y1={150} x2={1205} y2={110} stroke="#f43f5e" strokeWidth={2.2} markerEnd="url(#ia-rose)" markerStart="url(#ia-rose)" opacity={0.85} />

        {/* CTI sources */}
        <g>
          <Icon x={1230} y={272} kind="db" label="Mitre ATT&CK" color="#6366f1" />
          <Icon x={1330} y={318} kind="db" label="Mitre FiGHT" color="#8b5cf6" />
          <Icon x={1230} y={368} kind="db" label="Others" color="#a855f7" />
          <path d="M1200 288 C 1080 300, 1000 250, 942 202" fill="none" stroke="#64748b" strokeWidth={1.8} markerEnd="url(#ia-slate)" />
          <text x={1085} y={272} fontSize={9.5} fill="#64748b" fontWeight={600}>
            CTI feeds
          </text>
        </g>

        {/* ================= Region slabs ================= */}
        {REGIONS.map(({ n, x, y }) => {
          const color = REGION_COLORS[`region_${n}`]
          return (
            <g key={n}>
              {/* RIC slab */}
              <Slab x={x} y={y} w={330} h={132} skew={58} fill={SURFACE[n]} edge={EDGE[n]} stroke={color} />
              <text x={x + 12} y={y + 127} fontSize={11.5} fontWeight={800} fill={color}>
                Near-RT RIC {n}
              </text>

              <Icon x={x + 105} y={y + 32} kind="bug" label="Threat Simulator" sub="xApp2" labelColor="#334155" />
              <Icon x={x + 295} y={y + 32} kind="radar" label="Probe Manager" sub="xApp1" labelColor="#334155" />
              <line x1={x + 128} y1={y + 32} x2={x + 268} y2={y + 32} stroke="#dc2626" strokeWidth={1.6} strokeDasharray="5 4" markerEnd="url(#ia-slate)">
                <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1s" repeatCount="indefinite" />
              </line>
              <text x={x + 198} y={y + 25} textAnchor="middle" fontSize={8.5} fill="#dc2626" fontWeight={600}>
                simulate threats
              </text>

              <Icon x={x + 142} y={y + 92} kind="client" label="MCP Client" labelColor="#334155" />
              <Icon x={x + 218} y={y + 90} kind="bot" label="Mini RAG Agent" sub="Local RAG" color={color} labelColor="#334155" />
              <Icon x={x + 318} y={y + 88} kind="bot" label="Inter-Platform" sub="Agent" color="#8b5cf6" labelColor="#334155" />

              {/* E2 down to RAN */}
              <g transform={`translate(${x + 150},${y + 152})`}>
                <line x1={0} y1={0} x2={0} y2={34} stroke={color} strokeWidth={3} opacity={0.8} markerEnd="url(#ia-slate)" markerStart="url(#ia-slate)" />
                <text x={8} y={22} fontSize={9.5} fontWeight={700} fill={color}>
                  E2 Interface
                </text>
              </g>

              {/* RAN slab */}
              <Slab x={x + 30} y={y + 190} w={280} h={92} skew={44} fill="white" edge="#e2e8f0" stroke={color} />
              <Icon x={x + 95} y={y + 218} kind="node" label="O-CU" labelColor="#334155" />
              <Icon x={x + 300} y={y + 218} kind="node" label="O-RU" labelColor="#334155" />
              <Icon x={x + 195} y={y + 246} kind="node" label="O-DU" labelColor="#334155" />
              <line x1={x + 118} y1={y + 216} x2={x + 272} y2={y + 216} stroke="#dc2626" strokeWidth={1.4} markerEnd="url(#ia-slate)" />
              <line x1={x + 278} y1={y + 232} x2={x + 222} y2={y + 244} stroke="#2563eb" strokeWidth={1.4} markerEnd="url(#ia-slate)" />
              <line x1={x + 170} y1={y + 244} x2={x + 116} y2={y + 230} stroke="#16a34a" strokeWidth={1.4} markerEnd="url(#ia-slate)" />
              {/* cyber probe mast */}
              <g transform={`translate(${x + 52},${y + 232})`}>
                <line x1={0} y1={14} x2={0} y2={-16} stroke="#334155" strokeWidth={2.4} />
                <path d="M-7 14 L0 -2 L7 14" fill="none" stroke="#334155" strokeWidth={1.4} />
                <circle cx={0} cy={-18} r={2.6} fill="#0ea5e9" />
                <path d="M-8 -22 a11 11 0 0 1 16 0" fill="none" stroke="#0ea5e9" strokeWidth={1.6} opacity={0.9}>
                  <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.6s" repeatCount="indefinite" />
                </path>
                <path d="M-12 -27 a17 17 0 0 1 24 0" fill="none" stroke="#0ea5e9" strokeWidth={1.6} opacity={0.5}>
                  <animate attributeName="opacity" values="0.5;0.1;0.5" dur="1.6s" begin="0.3s" repeatCount="indefinite" />
                </path>
                <text y={28} textAnchor="middle" fontSize={9} fontWeight={700} fill="#334155">
                  Cyber Probe
                </text>
              </g>
              <text x={x + 190} y={y + 312} textAnchor="middle" fontSize={13} fontWeight={800} fill={color}>
                Region {n}
              </text>
            </g>
          )
        })}

        {/* ================= Cross-layer links ================= */}
        {REGIONS.map(({ n, x, y }, i) => {
          const color = REGION_COLORS[`region_${n}`]
          const ragX = x + 218 // Mini RAG icon
          const ragY = y + 70
          const mcpPath = `M ${ragX - 14} ${ragY} C ${ragX - 70} ${ragY - 160}, 420 ${330 - i * 12}, 466 260`
          const ragPath = `M ${ragX + 12} ${ragY - 6} C ${ragX + 40} ${ragY - 170}, 700 ${345 - i * 16}, 752 262`
          const a1x = x + 356
          const a1Path = `M ${a1x} ${y + 26} C ${a1x + 44} ${y - 80}, ${856 + i * 42} 330, ${866 + i * 42} 264`
          return (
            <g key={n}>
              {/* RAG communication (light blue, thick) */}
              <path d={ragPath} fill="none" stroke="#7dd3fc" strokeWidth={4} opacity={0.4} strokeLinecap="round" />
              <MovingDot path={ragPath} color="#0284c7" dur={3.4} delay={i * 0.8} />
              {/* MCP (dark slate, thin) */}
              <path d={mcpPath} fill="none" stroke="#64748b" strokeWidth={1.3} opacity={0.45} markerEnd="url(#ia-slate)" />
              <MovingDot path={mcpPath} color="#334155" dur={4.2} delay={i * 1.05} r={3} />
              {/* A1 (rose, two-way) */}
              <path d={a1Path} fill="none" stroke="#f43f5e" strokeWidth={1.5} opacity={0.55} markerEnd="url(#ia-rose)" markerStart="url(#ia-rose)" />
              {i === 0 && (
                <>
                  <text x={430} y={330} fontSize={10} fontWeight={700} fill="#475569" transform="rotate(-28 430 330)">
                    MCP
                  </text>
                  <text x={700} y={352} fontSize={10} fontWeight={700} fill="#0284c7" transform="rotate(-30 700 352)">
                    RAG Communication
                  </text>
                  <text x={588} y={318} fontSize={10} fontWeight={700} fill="#e11d48">
                    A1 Interface
                  </text>
                </>
              )}
              {/* inter-platform hop to next region */}
              {i < 3 && (
                <>
                  <path
                    d={`M ${x + 322} ${y + 128} C ${x + 350} ${y + 215}, ${REGIONS[i + 1].x - 10} ${REGIONS[i + 1].y - 15}, ${REGIONS[i + 1].x + 88} ${REGIONS[i + 1].y + 24}`}
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    strokeDasharray="7 5"
                    opacity={0.75}
                    markerEnd="url(#ia-violet)"
                    markerStart="url(#ia-violet)"
                  >
                    <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1.6s" repeatCount="indefinite" />
                  </path>
                  <text
                    x={(x + 322 + REGIONS[i + 1].x + 40) / 2}
                    y={(y + 160 + REGIONS[i + 1].y) / 2 + 26}
                    fontSize={9.5}
                    fontWeight={700}
                    fill="#7c3aed"
                    textAnchor="middle"
                  >
                    Inter-Platform Communication
                  </text>
                </>
              )}
              <circle cx={0} cy={0} r={0} fill={color} />
            </g>
          )
        })}

        {/* legend */}
        <g fontSize={11} fill="#475569" transform="translate(40,80)">
          <text fontSize={12.5} fontWeight={800} fill="#1e293b" y={-26}>
            Legend
          </text>
          <line x1={0} y1={-8} x2={34} y2={-8} stroke="#7dd3fc" strokeWidth={5} strokeLinecap="round" opacity={0.6} />
          <text x={42} y={-4}>RAG escalation / communication</text>
          <line x1={0} y1={14} x2={34} y2={14} stroke="#64748b" strokeWidth={1.8} />
          <text x={42} y={18}>MCP tool calls</text>
          <line x1={0} y1={36} x2={34} y2={36} stroke="#f43f5e" strokeWidth={1.8} markerEnd="url(#ia-rose)" markerStart="url(#ia-rose)" />
          <text x={42} y={40}>A1 Interface</text>
          <line x1={0} y1={58} x2={34} y2={58} stroke="#8b5cf6" strokeWidth={2} strokeDasharray="7 5" />
          <text x={42} y={62}>Inter-platform threat sharing</text>
        </g>
      </svg>
    </div>
  )
}
