import { ReactNode } from 'react'
import { motion } from 'framer-motion'

export const REGION_COLORS: Record<string, string> = {
  region_1: '#2563eb',
  region_2: '#059669',
  region_3: '#d97706',
  region_4: '#7c3aed',
}

export function Section({
  id,
  kicker,
  title,
  intro,
  children,
  tint,
}: {
  id: string
  kicker: string
  title: string
  intro?: ReactNode
  children: ReactNode
  tint?: string
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-line py-16" style={{ background: tint }}>
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-kicker">{kicker}</span>
          <h2 className="mb-3 text-2xl font-bold sm:text-3xl">{title}</h2>
          {intro && <div className="mb-8 max-w-3xl text-[15px] leading-relaxed text-slate-600">{intro}</div>}
        </motion.div>
        {children}
      </div>
    </section>
  )
}

export function FileBadge({ children }: { children: ReactNode }) {
  return (
    <span className="badge-file">
      <svg width="10" height="12" viewBox="0 0 10 12" fill="none" className="shrink-0">
        <path d="M1 1h5l3 3v7H1V1z" stroke="currentColor" strokeWidth="1" fill="white" />
      </svg>
      {children}
    </span>
  )
}

export function Endpoint({ children }: { children: ReactNode }) {
  return <span className="badge-endpoint">{children}</span>
}

export function RegionChip({ region }: { region: 1 | 2 | 3 | 4 }) {
  const color = REGION_COLORS[`region_${region}`]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
      style={{ background: `${color}18`, color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      Region {region}
    </span>
  )
}

export function ServiceCard({
  title,
  layer,
  color = '#1d4ed8',
  children,
  files = [],
  endpoints = [],
}: {
  title: string
  layer?: string
  color?: string
  children: ReactNode
  files?: string[]
  endpoints?: string[]
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45 }}
      className="card flex flex-col p-5"
      style={{ borderTop: `3px solid ${color}` }}
    >
      <div className="mb-1 flex items-center justify-between gap-2">
        <h3 className="font-bold">{title}</h3>
        {layer && (
          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            {layer}
          </span>
        )}
      </div>
      <div className="mb-3 text-sm leading-relaxed text-slate-600">{children}</div>
      {endpoints.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {endpoints.map((e) => (
            <Endpoint key={e}>{e}</Endpoint>
          ))}
        </div>
      )}
      {files.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1.5 border-t border-line pt-3">
          {files.map((f) => (
            <FileBadge key={f}>{f}</FileBadge>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export type Step = {
  title: string
  body: ReactNode
  badge?: string
  color?: string
}

/** Animated vertical stepper timeline */
export function Stepper({ steps, color = '#1d4ed8' }: { steps: Step[]; color?: string }) {
  return (
    <ol className="relative ml-3 border-l-2 border-dashed" style={{ borderColor: `${color}55` }}>
      {steps.map((s, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          className="relative pb-7 pl-8 last:pb-0"
        >
          <span
            className="absolute -left-[15px] top-0 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shadow"
            style={{ background: s.color ?? color }}
          >
            {i + 1}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold">{s.title}</h4>
            {s.badge && <FileBadge>{s.badge}</FileBadge>}
          </div>
          <div className="mt-1 text-sm leading-relaxed text-slate-600">{s.body}</div>
        </motion.li>
      ))}
    </ol>
  )
}

export function ScreenshotPlaceholder({ caption, tall = false }: { caption: string; tall?: boolean }) {
  return (
    <figure className="card overflow-hidden">
      <div
        className={`flex ${tall ? 'h-64' : 'h-44'} flex-col items-center justify-center gap-2 border-b border-dashed border-line bg-slate-50 text-slate-400`}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <circle cx="8.5" cy="9.5" r="1.5" />
          <path d="M21 15l-5-5-9 8" />
        </svg>
        <span className="text-xs font-medium">Screenshot placeholder — replace with your capture</span>
      </div>
      <figcaption className="px-4 py-3 text-sm text-slate-600">{caption}</figcaption>
    </figure>
  )
}
