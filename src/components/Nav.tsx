import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PAGES, PageId } from '../router'

export default function Nav({ page, navigate }: { page: PageId; navigate: (p: PageId) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/40 bg-white/70 shadow-[0_1px_20px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <button
          onClick={() => navigate('overview')}
          className="flex items-center gap-2.5 text-left font-extrabold tracking-tight"
        >
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-[11px] font-black text-white shadow-md">
            O-CTI
            <span className="absolute inset-0 animate-[shine_3.2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </span>
          <span className="hidden leading-tight sm:block">
            O-RAN CTI Platform
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Multi-Region · FYP
            </span>
          </span>
        </button>

        {/* desktop nav — fits without scrolling */}
        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {PAGES.map((p) => {
            const active = page === p.id
            return (
              <button
                key={p.id}
                onClick={() => navigate(p.id)}
                className={`relative rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                  active ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 shadow"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{p.label}</span>
              </button>
            )
          })}
        </nav>

        {/* mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden border-t border-line bg-white/95 backdrop-blur md:hidden"
          >
            <div className="grid gap-1 p-3">
              {PAGES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    navigate(p.id)
                    setOpen(false)
                  }}
                  className={`rounded-lg px-4 py-2.5 text-left text-sm font-semibold ${
                    page === p.id ? 'bg-blue-50 text-accent' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p.label}
                  <span className="block text-xs font-normal text-slate-400">{p.title}</span>
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
