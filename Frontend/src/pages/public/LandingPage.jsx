import { useState, useRef, useEffect, useMemo, memo } from 'react'
import { Link } from 'react-router-dom'
import {
  Store, BarChart3, Users, Shield, Zap, Globe,
  ArrowRight, ChevronDown, Play,
  MousePointer2, Sparkles, TrendingUp, ShoppingCart,
  Package, CreditCard, FileBarChart, ArrowUpRight,
  Star, Quote, Download, Monitor,
} from 'lucide-react'
import Button          from '../../components/ui/Button'
import AnimatedSection from '../../components/ui/AnimatedSection'
import Typewriter      from '../../components/ui/Typewriter'
import CountUp         from '../../components/ui/CountUp'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

/* ─── Theme reference ─────────────────────────────
   Sand Background  : #F0EDE5
   Light Surface    : #faf8f2
   Primary Teal     : #004643
   Ink / Text       : #182321
   Muted            : #697773
   Border           : #d9d4c8
────────────────────────────────────────────────── */

/* ─── Data ─────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon:  Store,
    title: 'Multi-Shop Management',
    desc:  'Own and operate multiple stores from a single unified dashboard. Every shop has complete data isolation — cashiers, products, and reports never mix.',
    gradient: 'from-white to-white/60',
    border:   'border-[#d9d4c8]',
    iconColor:'text-[#004643]',
  },
  {
    icon:  Zap,
    title: 'Lightning-Fast POS',
    desc:  'A distraction-free cashier terminal optimised for speed. Scan, add, checkout — the entire flow in under 10 seconds.',
    gradient: 'from-[#e5f2f1] to-white/60',
    border:   'border-[#d9d4c8]',
    iconColor:'text-[#004643]',
  },
  {
    icon:  BarChart3,
    title: 'Real-Time Analytics',
    desc:  'Revenue trends, profit margins, top-selling products, and daily summaries — all updating live as your cashiers sell.',
    gradient: 'from-white to-white/60',
    border:   'border-[#d9d4c8]',
    iconColor:'text-[#004643]',
  },
  {
    icon:  Users,
    title: 'Role-Based Access',
    desc:  'Owners see everything. Cashiers see only what they need. Two distinct interfaces, one secure system.',
    gradient: 'from-[#e5f2f1] to-white/60',
    border:   'border-[#d9d4c8]',
    iconColor:'text-[#004643]',
  },
  {
    icon:  Shield,
    title: 'ACID Transactions',
    desc:  'Every sale atomically deducts stock and records financials. No race conditions, no phantom inventory — backed by MySQL.',
    gradient: 'from-white to-white/60',
    border:   'border-[#d9d4c8]',
    iconColor:'text-[#004643]',
  },
  {
    icon:  Globe,
    title: 'Cloud-Native',
    desc:  'Your data is always available. Open your dashboard from any device, anywhere in the world — no local installation needed.',
    gradient: 'from-[#e5f2f1] to-white/60',
    border:   'border-[#d9d4c8]',
    iconColor:'text-[#004643]',
  },
]

const HOW_IT_WORKS = [
  { step: '01', icon: Store,        title: 'Create Your Account', desc: 'Register as an Owner in under a minute. No credit card required to explore.' },
  { step: '02', icon: Package,      title: 'Set Up Your Shop',    desc: 'Add your shop, upload your product catalog with images, cost prices, and stock levels.' },
  { step: '03', icon: Users,        title: 'Invite Cashiers',     desc: 'Create cashier accounts and assign them to specific shops. They only see what they need.' },
  { step: '04', icon: ShoppingCart, title: 'Start Selling',       desc: 'Cashiers log in to the POS terminal and begin processing sales instantly.' },
  { step: '05', icon: FileBarChart, title: 'Track Everything',    desc: 'Monitor revenue, profit, and stock in real time. Export financial reports to Excel.' },
]

const BETA_PERKS = [
  { icon: Store,        title: 'Unlimited Shops',        desc: 'Create and manage as many shops as you need — no artificial limits during beta.',            iconColor: 'text-[#004643]', bg: 'bg-[#e5f2f1]', border: 'border-[#d9d4c8]' },
  { icon: Users,        title: 'Unlimited Cashiers',     desc: 'Add every member of your team across all your locations at no cost.',                        iconColor: 'text-[#004643]', bg: 'bg-[#e5f2f1]/70', border: 'border-[#d9d4c8]' },
  { icon: BarChart3,    title: 'Full Analytics',         desc: 'Access every report, chart, and export feature — nothing is locked behind a paywall.',       iconColor: 'text-[#004643]', bg: 'bg-[#e5f2f1]', border: 'border-[#d9d4c8]' },
  { icon: Package,      title: 'Full Inventory Control', desc: 'Manage your entire product catalog with images, cost tracking, and stock alerts.',           iconColor: 'text-[#004643]', bg: 'bg-[#e5f2f1]/70', border: 'border-[#d9d4c8]' },
  { icon: FileBarChart, title: 'Excel Exports',          desc: 'Download any financial report as a formatted Excel file, always included.',                  iconColor: 'text-[#004643]', bg: 'bg-[#e5f2f1]', border: 'border-[#d9d4c8]' },
  { icon: Shield,       title: 'ACID-Safe Transactions', desc: 'Every sale is MySQL-backed and race-condition safe — enterprise grade, free.',              iconColor: 'text-[#004643]', bg: 'bg-[#e5f2f1]/70', border: 'border-[#d9d4c8]' },
]

const BETA_FAQ = [
  { q: 'How long is the free beta?',               a: "We're in active development. The beta is free for all early users and we'll give at least 60 days notice before any paid plans are introduced." },
  { q: 'Will my data be kept when paid plans launch?', a: 'Yes — 100%. All shops, products, cashiers, and historical transaction records are fully preserved.' },
  { q: 'Do I need a credit card to sign up?',      a: 'No. Zero payment info required. Just your name and email — you\'re in.' },
  { q: 'Can I invite my whole team right now?',    a: 'Absolutely. Create unlimited cashier accounts across all your shops today.' },
]

const STATS = [
  { value: 1200,  suffix: '+',  label: 'Shops Managed',    prefix: '' },
  { value: 98,    suffix: '%',  label: 'Uptime Guarantee', prefix: '' },
  { value: 4.8,   suffix: '/5', label: 'Customer Rating',  prefix: '', decimals: 1 },
  { value: 50000, suffix: '+',  label: 'Transactions/Day', prefix: '' },
]

const TESTIMONIALS = [
  {
    name:   'Maria Santos',
    role:   'Owner, 3 branches',
    avatar: 'MS',
    color:  'from-[#e5f2f1] to-[#F0EDE5]',
    text:   'ShopNest transformed how I manage my three stores. The real-time inventory sync alone saves me hours every week.',
    stars:  5,
  },
  {
    name:   'Jose Reyes',
    role:   'Retail Manager',
    avatar: 'JR',
    color:  'from-[#004643] to-[#e5f2f1]',
    text:   'The POS terminal is incredibly intuitive. My cashiers were fully trained in less than 15 minutes.',
    stars:  5,
  },
  {
    name:   'Ana Lim',
    role:   'Owner, Fashion Boutique',
    avatar: 'AL',
    color:  'from-[#004643] to-[#004643]',
    text:   'Financial reports used to take me a whole day. Now I export everything to Excel in one click.',
    stars:  5,
  },
]

const footerLinks = [
  { label: 'Privacy', path: '/privacy' },
  { label: 'Terms',   path: '/terms' },
  { label: 'Support', path: '/support' }
]

const DESKTOP_DOWNLOAD_URL = 'https://github.com/rumman2004/ShopNest-Desktop/releases'

/* ─── Scroll Progress Bar ───────────────────────────────────────── */
const ScrollProgressBar = memo(function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)
  const ticking = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(() => {
          const doc   = document.documentElement
          const total = doc.scrollHeight - doc.clientHeight
          setProgress(total > 0 ? (window.scrollY / total) * 100 : 0)
          ticking.current = false
        })
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-[#004643] via-[#0f766e] to-[#e5f2f1] transition-all duration-150"
        style={{ width: `${progress}%`, willChange: 'width' }}
      />
    </div>
  )
})

/* ─── Floating Nav Dot ──────────────────────────────────────────── */
const NavDot = memo(function NavDot({ label, target }) {
  const scrollTo = () => document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  return (
    <button onClick={scrollTo} title={label} className="group relative flex items-center justify-end gap-2">
      <span className="
        absolute right-5 opacity-0 group-hover:opacity-100
        text-xs text-[#182321] bg-white px-2 py-1 rounded-md
        whitespace-nowrap pointer-events-none
        transition-opacity duration-200
        border border-[#d9d4c8]
      ">
        {label}
      </span>
      <span className="w-2 h-2 rounded-full bg-[#004643]/40 hover:bg-[#004643]/15 group-hover:scale-125 transition-all duration-200 border border-[#004643]/35" />
    </button>
  )
})

const DownloadAppButton = memo(function DownloadAppButton({ compact = false, className = '' }) {
  return (
    <a
      href={DESKTOP_DOWNLOAD_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        group relative isolate items-center justify-center overflow-hidden
        bg-gradient-to-br from-[#182321] via-[#004643] to-[#0f766e]
        text-white border border-white/15 shadow-lg shadow-[#004643]/20
        transition-all duration-300 ease-out
        hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#004643]/25
        active:translate-y-0 active:scale-[0.98]
        focus-visible:ring-2 focus-visible:ring-[#004643] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F0EDE5] focus-visible:outline-none
        ${compact
          ? 'hidden sm:inline-flex h-10 gap-2.5 rounded-xl px-3.5'
          : 'inline-flex min-h-[64px] w-full gap-3 rounded-2xl px-4 py-3 text-left sm:w-auto sm:px-5'
        }
        ${className}
      `}
    >
      <span className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(135deg,rgba(255,255,255,0.20),rgba(255,255,255,0)_42%)] opacity-80" />
      <span className="absolute -right-8 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full bg-[#e5f2f1]/15 blur-2xl transition-transform duration-500 group-hover:scale-125" />

      <span
        className={`
          relative flex shrink-0 items-center justify-center rounded-xl
          bg-white/12 text-[#e5f2f1] ring-1 ring-white/15 shadow-inner
          transition-colors duration-300 group-hover:bg-white/18
          ${compact ? 'h-7 w-7' : 'h-10 w-10'}
        `}
      >
        <Monitor size={compact ? 15 : 20} className="transition-transform duration-300 group-hover:scale-110" />
        {!compact && (
          <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-[#e5f2f1] ring-2 ring-[#004643]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#004643]" />
          </span>
        )}
      </span>

      <span className="relative min-w-0">
        <span className={`block font-bold leading-none ${compact ? 'text-xs' : 'text-base'}`}>
          {compact ? 'Download App' : 'Download Desktop App'}
        </span>
        {!compact && (
          <span className="mt-1 block text-[11px] font-semibold uppercase tracking-wide text-[#e5f2f1]/85">
            Windows | macOS | Linux
          </span>
        )}
      </span>

      {!compact && (
        <span className="relative ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#004643] shadow-sm transition-transform duration-300 group-hover:translate-y-0.5">
          <Download size={16} />
        </span>
      )}
    </a>
  )
})

/* ─── Dashboard Mockup ──────────────────────────────────────────── */
const DashboardMockup = memo(function DashboardMockup() {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 })
  const bars = useMemo(() => [65, 42, 88, 55, 72, 95, 38, 80, 60, 45, 90, 70], [])

  return (
    <div
      ref={ref}
      style={{
        opacity:    isVisible ? 1 : 0,
        transform:  isVisible ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.96)',
        transition: 'opacity 900ms cubic-bezier(0.25,0.46,0.45,0.94) 200ms, transform 900ms cubic-bezier(0.25,0.46,0.45,0.94) 200ms',
        willChange: isVisible ? 'auto' : 'opacity, transform',
      }}
      className="relative mt-20 max-w-5xl mx-auto"
    >
      {/* Outer glow - simplified for performance */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#004643]/20 via-[#235347]/15 to-[#F0EDE5]/25" />

      {/* Window chrome */}
      <div className="relative glass-strong rounded-2xl overflow-hidden border border-[#d9d4c8]">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#d9d4c8]/80 bg-white/90">
          <span className="w-3 h-3 rounded-full bg-red-400/70" />
          <span className="w-3 h-3 rounded-full bg-amber-400/70" />
          <span className="w-3 h-3 rounded-full bg-emerald-400/70" />
          <div className="flex-1 flex justify-center">
            <div className="glass-sm rounded-md px-4 py-1 text-xs text-[#697773] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#004643]" />
              shopnest.app/owner/dashboard
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="flex" style={{ minHeight: '380px' }}>
          {/* Sidebar */}
          <div className="w-16 border-r border-[#d9d4c8]/60 bg-white flex flex-col items-center py-4 gap-4">
            {[BarChart3, Store, Package, Users, FileBarChart].map((Icon, i) => (
              <div
                key={i}
                className={`
                  w-9 h-9 rounded-xl flex items-center justify-center transition-all
                  ${i === 0
                    ? 'bg-[#004643]/12 border border-[#004643]/30 text-[#182321]'
                    : 'text-[#697773]/60 hover:text-[#182321]'
                  }
                `}
              >
                <Icon size={16} />
              </div>
            ))}
          </div>

          {/* Main area */}
          <div className="flex-1 p-5 space-y-4 overflow-hidden">
            {/* Stat row */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Revenue', value: '₹128,400' },
                { label: 'Sales',   value: '1,284'    },
                { label: 'Profit',  value: '₹38,200'  },
                { label: 'Shops',   value: '4 Active' },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-[#e5f2f1] border border-[#d9d4c8] rounded-xl p-3"
                  style={{
                    opacity:    isVisible ? 1 : 0,
                    transform:  isVisible ? 'translateY(0)' : 'translateY(16px)',
                    transition: `opacity 600ms ease ${300 + i * 80}ms, transform 600ms ease ${300 + i * 80}ms`,
                  }}
                >
                  <p className="text-[10px] text-[#697773] mb-1">{s.label}</p>
                  <p className="text-sm font-bold text-[#182321]">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Chart area */}
            <div
              className="glass-sm rounded-xl p-4 border border-[#d9d4c8]"
              style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 700ms ease 600ms' }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-[#182321]">Revenue (Last 12 months)</p>
                <span className="text-[10px] text-[#697773] flex items-center gap-1">
                  <TrendingUp size={10} /> +23.4%
                </span>
              </div>
              <div className="flex items-end gap-1.5 h-24">
                {bars.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-gradient-to-t from-[#e5f2f1] to-[#0f766e]"
                    style={{
                      height:     isVisible ? `${h}%` : '0%',
                      transition: `height 800ms cubic-bezier(0.34,1.56,0.64,1) ${700 + i * 50}ms`,
                      opacity:    0.7 + (h / 100) * 0.3,
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m) => (
                  <span key={m} className="text-[8px] text-[#697773]/70">{m}</span>
                ))}
              </div>
            </div>

            {/* Bottom row */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className="glass-sm rounded-xl p-3 space-y-2 border border-[#d9d4c8]"
                style={{
                  opacity:    isVisible ? 1 : 0,
                  transform:  isVisible ? 'translateX(0)' : 'translateX(-20px)',
                  transition: 'opacity 600ms ease 900ms, transform 600ms ease 900ms',
                }}
              >
                <p className="text-[10px] font-semibold text-[#697773]">Recent Sales</p>
                {[
                  { id: '#8F2A', amount: '₹420', time: '2m ago' },
                  { id: '#8F29', amount: '₹890', time: '8m ago' },
                  { id: '#8F28', amount: '₹230', time: '15m ago' },
                ].map((s) => (
                  <div key={s.id} className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#697773]/80">{s.id}</span>
                    <span className="text-[10px] text-[#182321] font-semibold">{s.amount}</span>
                    <span className="text-[9px] text-[#697773]/70">{s.time}</span>
                  </div>
                ))}
              </div>

              <div
                className="glass-sm rounded-xl p-3 space-y-2 border border-[#d9d4c8]"
                style={{
                  opacity:    isVisible ? 1 : 0,
                  transform:  isVisible ? 'translateX(0)' : 'translateX(20px)',
                  transition: 'opacity 600ms ease 1000ms, transform 600ms ease 1000ms',
                }}
              >
                <p className="text-[10px] font-semibold text-[#697773]">Top Products</p>
                {[
                  { name: 'Product A', pct: 82, color: 'bg-[#004643]' },
                  { name: 'Product B', pct: 65, color: 'bg-[#0f766e]' },
                  { name: 'Product C', pct: 48, color: 'bg-[#5b8f85]' },
                ].map((p) => (
                  <div key={p.name}>
                    <div className="flex justify-between mb-0.5">
                      <span className="text-[9px] text-[#697773]/80">{p.name}</span>
                      <span className="text-[9px] text-[#697773]/80">{p.pct}%</span>
                    </div>
                    <div className="h-1 bg-[#d9d4c8] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${p.color} rounded-full`}
                        style={{
                          width:      isVisible ? `${p.pct}%` : '0%',
                          transition: 'width 1000ms cubic-bezier(0.34,1.56,0.64,1) 1100ms',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating badges */}
      <div
        className="absolute -left-10 top-1/3 glass-strong rounded-xl px-3 py-2 border border-[#d9d4c8] hidden lg:flex items-center gap-2"
        style={{
          opacity:    isVisible ? 1 : 0,
          transform:  isVisible ? 'translateX(0)' : 'translateX(-30px)',
          transition: 'opacity 600ms ease 1200ms, transform 600ms ease 1200ms',
        }}
      >
        <div className="w-6 h-6 rounded-full bg-[#004643]/12 flex items-center justify-center">
          <TrendingUp size={12} className="text-[#182321]" />
        </div>
        <div>
          <p className="text-[10px] text-[#697773]">Revenue</p>
          <p className="text-xs font-bold text-[#182321]">+23.4%</p>
        </div>
      </div>

      <div
        className="absolute -right-10 top-1/4 glass-strong rounded-xl px-3 py-2 border border-[#d9d4c8] hidden lg:flex items-center gap-2"
        style={{
          opacity:    isVisible ? 1 : 0,
          transform:  isVisible ? 'translateX(0)' : 'translateX(30px)',
          transition: 'opacity 600ms ease 1300ms, transform 600ms ease 1300ms',
        }}
      >
        <div className="w-6 h-6 rounded-full bg-[#e5f2f1]/80 flex items-center justify-center">
          <Sparkles size={12} className="text-[#182321]" />
        </div>
        <div>
          <p className="text-[10px] text-[#697773]">Live Sync</p>
          <p className="text-xs font-bold text-[#182321]">Real-time</p>
        </div>
      </div>
    </div>
  )
})

/* ─── POS Mockup ────────────────────────────────────────────────── */
const PosMockup = memo(function PosMockup() {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 })
  const [activeItem, setActiveItem] = useState(null)

  const cartItems = [
    { name: 'Espresso Shot', qty: 2, price: '₹80'  },
    { name: 'Croissant',     qty: 1, price: '₹120' },
    { name: 'Bottled Water', qty: 3, price: '₹45'  },
  ]

  return (
    <div
      ref={ref}
      style={{
        opacity:    isVisible ? 1 : 0,
        transform:  isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 800ms ease 300ms, transform 800ms ease 300ms',
        willChange: isVisible ? 'auto' : 'opacity, transform',
      }}
      className="glass-strong rounded-2xl overflow-hidden border border-[#d9d4c8] max-w-lg mx-auto lg:mx-0"
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#d9d4c8]/80 bg-white">
        <div className="w-2 h-2 rounded-full bg-[#004643] animate-pulse" />
        <p className="text-xs text-[#697773] font-medium">POS Terminal — Cashier: Maria</p>
        <div className="ml-auto text-xs text-[#182321]/70 font-mono">
          {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div className="flex gap-0">
        {/* Products grid */}
        <div className="flex-1 p-4 border-r border-[#d9d4c8]/80">
          <p className="text-[10px] text-[#697773]/80 mb-3 uppercase tracking-wider">Products</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: 'Espresso',  price: '₹80'  },
              { name: 'Croissant', price: '₹120' },
              { name: 'Latte',     price: '₹150' },
              { name: 'Water',     price: '₹45'  },
            ].map((p, i) => (
              <button
                key={p.name}
                onClick={() => setActiveItem(i)}
                className={`
                  text-left p-2.5 rounded-xl border transition-all duration-150
                  ${activeItem === i
                    ? 'bg-[#004643]/15 border-[#e5f2f1]/60 scale-95'
                    : 'bg-[#faf8f2] border-[#d9d4c8] hover:bg-white/90'
                  }
                `}
                style={{
                  opacity:    isVisible ? 1 : 0,
                  transition: `opacity 500ms ease ${400 + i * 80}ms, transform 150ms ease`,
                }}
              >
                <p className="text-[10px] font-semibold text-[#182321]">{p.name}</p>
                <p className="text-[10px] text-[#697773] mt-0.5">{p.price}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="w-40 p-3 flex flex-col bg-white">
          <p className="text-[10px] text-[#697773]/80 mb-2 uppercase tracking-wider">Cart</p>
          <div className="space-y-1.5 flex-1">
            {cartItems.map((item, i) => (
              <div
                key={item.name}
                className="flex items-center justify-between py-1 border-b border-[#d9d4c8]/80 last:border-0"
                style={{
                  opacity:    isVisible ? 1 : 0,
                  transform:  isVisible ? 'translateX(0)' : 'translateX(20px)',
                  transition: `opacity 500ms ease ${600 + i * 100}ms, transform 500ms ease ${600 + i * 100}ms`,
                }}
              >
                <div>
                  <p className="text-[9px] text-[#182321] leading-tight">{item.name}</p>
                  <p className="text-[9px] text-[#697773]">x{item.qty}</p>
                </div>
                <p className="text-[9px] font-semibold text-[#182321]">{item.price}</p>
              </div>
            ))}
          </div>
          <div
            className="border-t border-[#d9d4c8]/80 pt-2 mt-2"
            style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 500ms ease 1000ms' }}
          >
            <div className="flex justify-between mb-2">
              <span className="text-[10px] text-[#697773]">Total</span>
              <span className="text-[10px] font-bold text-[#182321]">₹415</span>
            </div>
            <button className="w-full py-1.5 rounded-lg bg-gradient-to-r from-[#004643] to-[#0f766e] text-white text-[9px] font-semibold">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})

/* ─── Navbar ────────────────────────────────────────────────────── */
const Navbar = memo(function Navbar({ scrolled }) {
  return (
    <nav
      className={`
        fixed top-3 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-6xl
        rounded-2xl px-5 h-14 flex items-center justify-between
        transition-all duration-500
        ${scrolled
          ? 'glass-strong border border-[#d9d4c8] shadow-glass'
          : 'glass border border-[#d9d4c8]/80'
        }
      `}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#004643] to-[#0f766e] flex items-center justify-center shadow-lg">
          <Store size={15} className="text-white" />
        </div>
        <span className="text-lg font-bold gradient-text">ShopNest</span>
      </div>

      <div className="hidden md:flex items-center gap-1">
        {[
          { label: 'Features',     href: '#features'    },
          { label: 'How It Works', href: '#how-it-works'},
          { label: 'Reviews',      href: '#reviews'     },
          { label: 'Pricing',      href: '#pricing'     },
        ].map(({ label, href }) => (
          <a
            key={href}
            href={href}
            onClick={(e) => {
              e.preventDefault()
              document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-3 py-1.5 text-sm text-[#697773] hover:text-[#182321] rounded-lg hover:bg-white/80 transition-all duration-150"
          >
            {label}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-2.5">
        <DownloadAppButton compact />
        <Link to="/login" className="hidden sm:block">
          <Button variant="ghost" size="sm">Sign In</Button>
        </Link>
        <Link to="/register">
          <Button variant="gradient" size="sm">Get Started</Button>
        </Link>
      </div>
    </nav>
  )
})

/* ─── Main Component ────────────────────────────────────────────── */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const heroRef                 = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToFeatures = () => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F0EDE5]">
      <ScrollProgressBar />

      {/* Side nav dots */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col gap-4">
        {[
          { label: 'Hero',        target: '#hero'        },
          { label: 'Preview',     target: '#preview'     },
          { label: 'Features',    target: '#features'    },
          { label: 'How It Works',target: '#how-it-works'},
          { label: 'POS Demo',    target: '#pos-demo'    },
          { label: 'Stats',       target: '#stats'       },
          { label: 'Pricing',     target: '#pricing'     },
          { label: 'Reviews',     target: '#reviews'     },
        ].map((dot) => <NavDot key={dot.target} {...dot} />)}
      </div>

      <Navbar scrolled={scrolled} />

      {/* ════ HERO ════ */}
      <section
        id="hero"
        ref={heroRef}
        className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center relative"
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#d9d4c8] text-xs font-medium text-[#182321] mb-8 animate-slide-up"
          style={{ animationDelay: '100ms' }}
        >
          <Sparkles size={12} className="text-[#697773]" />
          Cloud-Based Multi-Tenant POS System
          <span className="w-1.5 h-1.5 rounded-full bg-[#004643] animate-pulse" />
        </div>

        <h1
          className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.08] animate-slide-up"
          style={{ animationDelay: '200ms' }}
        >
          <span className="gradient-text">Manage Every Shop.</span>
          <br />
          <span className="text-[#182321]">Sell with </span>
          <span className="relative inline-block">
            <Typewriter
              words={['Confidence.', 'Speed.', 'Clarity.', 'ShopNest.']}
              speed={80}
              deleteSpeed={45}
              pauseMs={2000}
              className="gradient-text"
            />
          </span>
        </h1>

        <p
          className="text-lg md:text-xl text-[#697773] max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up"
          style={{ animationDelay: '350ms' }}
        >
          ShopNest is a professional POS & lightweight ERP for small-to-medium businesses.
          Real-time inventory, multi-shop control, and ACID-safe financial records —
          all wrapped in a beautiful glassmorphic interface.
        </p>

        <div
          className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center animate-slide-up"
          style={{ animationDelay: '450ms' }}
        >
          <Link to="/register">
            <Button
              variant="gradient"
              size="xl"
              iconRight={<ArrowRight size={20} />}
              className="group border border-[#e5f2f1]/30 shadow-md w-full sm:w-auto"
            >
              Start Free Trial
            </Button>
          </Link>
          <DownloadAppButton />
          <button
            onClick={scrollToFeatures}
            className="
              inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-medium
              glass border border-[#d9d4c8] text-[#182321]
              hover:bg-[#e5f2f1]/80
              transition-all duration-200 w-full sm:w-auto
            "
          >
            <Play size={16} className="text-[#697773]" />
            See How It Works
          </button>
        </div>

        <div
          className="flex flex-wrap items-center justify-center gap-6 mt-12 animate-fade-in"
          style={{ animationDelay: '600ms' }}
        >
          {[
            { icon: Shield,        text: 'ACID Transactions'   },
            { icon: Zap,           text: 'Sub-second Response' },
            { icon: Globe,         text: 'Cloud-Native'        },
            { icon: MousePointer2, text: 'No Setup Required'   },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm text-[#697773]">
              <Icon size={14} className="text-[#182321]/70" />
              {text}
            </div>
          ))}
        </div>

        <button
          onClick={scrollToFeatures}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#697773]/80 hover:text-[#182321] transition-colors animate-bounce"
          aria-label="Scroll down"
        >
          <ChevronDown size={28} />
        </button>
      </section>

      {/* ════ DASHBOARD PREVIEW ════ */}
      <section id="preview" className="px-6 pb-24">
        <AnimatedSection variant="fade-up" className="text-center mb-4">
          <span className="text-xs font-semibold text-[#697773] uppercase tracking-widest">Live Preview</span>
        </AnimatedSection>
        <AnimatedSection variant="fade-up" delay={100} className="text-center mb-3">
          <h2 className="text-3xl md:text-4xl font-bold text-[#182321]">Your Dashboard, Reimagined</h2>
        </AnimatedSection>
        <AnimatedSection variant="fade-up" delay={200} className="text-center mb-16">
          <p className="text-[#697773] max-w-xl mx-auto">
            A real-time overview of every shop's performance — revenue, profit, stock,
            and top products — all in one beautiful interface.
          </p>
        </AnimatedSection>
        <DashboardMockup />
      </section>

      {/* ════ FEATURES ════ */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <AnimatedSection variant="fade-up" className="text-center mb-4">
          <span className="text-xs font-semibold text-[#697773] uppercase tracking-widest">Core Features</span>
        </AnimatedSection>
        <AnimatedSection variant="fade-up" delay={100} className="text-center mb-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#182321]">Everything You Need to Run Retail</h2>
        </AnimatedSection>
        <AnimatedSection variant="fade-up" delay={200} className="text-center mb-16">
          <p className="text-[#697773] max-w-xl mx-auto">
            From inventory management to financial exports — ShopNest covers the entire
            retail lifecycle without the enterprise price tag.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc, gradient, border, iconColor }, i) => (
            <AnimatedSection key={title} variant="fade-up" delay={i * 80} className="group">
              <div className={`
                h-full p-6 rounded-2xl border transition-all duration-300
                bg-gradient-to-br ${gradient} ${border}
                hover:scale-[1.02] hover:shadow-glass-lg
                backdrop-blur-xl cursor-default
              `}>
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center mb-5
                  bg-white/90 border border-[#d9d4c8]
                  group-hover:scale-110 transition-transform duration-300
                `}>
                  <Icon size={22} className={iconColor} />
                </div>
                <h3 className="text-base font-semibold text-[#182321] mb-2.5">{title}</h3>
                <p className="text-sm text-[#697773] leading-relaxed">{desc}</p>
                <div className="flex items-center gap-1 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className={`text-xs font-medium ${iconColor}`}>Learn more</span>
                  <ArrowUpRight size={12} className={iconColor} />
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ════ HOW IT WORKS ════ */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-24">
        <AnimatedSection variant="fade-up" className="text-center mb-4">
          <span className="text-xs font-semibold text-[#697773] uppercase tracking-widest">Getting Started</span>
        </AnimatedSection>
        <AnimatedSection variant="fade-up" delay={100} className="text-center mb-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#182321]">Up & Running in Minutes</h2>
        </AnimatedSection>
        <AnimatedSection variant="fade-up" delay={200} className="text-center mb-20">
          <p className="text-[#697773] max-w-lg mx-auto">
            No complex setup. No IT team needed. Five steps and your entire business is live.
          </p>
        </AnimatedSection>

        <div className="relative">
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-px">
            <div className="w-full h-full bg-gradient-to-r from-[#004643]/0 via-[#0f766e]/50 to-[#004643]/0" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }, i) => (
              <AnimatedSection key={step} variant="fade-up" delay={i * 120} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-5">
                    <div className="w-16 h-16 rounded-2xl glass border border-[#d9d4c8] flex flex-col items-center justify-center relative z-10 bg-white">
                      <Icon size={20} className="text-[#697773] mb-0.5" />
                      <span className="text-[9px] font-mono text-[#697773]/80">{step}</span>
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-[#004643]/10 blur-lg" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#182321] mb-2">{title}</h3>
                  <p className="text-xs text-[#697773] leading-relaxed">{desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        <AnimatedSection variant="fade-up" delay={600} className="text-center mt-14">
          <Link to="/register">
            <Button variant="gradient" size="lg" iconRight={<ArrowRight size={16} />}>
              Start Your Free Trial
            </Button>
          </Link>
        </AnimatedSection>
      </section>

      {/* ════ POS DEMO ════ */}
      <section id="pos-demo" className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <AnimatedSection variant="fade-right">
              <span className="text-xs font-semibold text-[#697773] uppercase tracking-widest">Cashier Experience</span>
            </AnimatedSection>
            <AnimatedSection variant="fade-right" delay={100}>
              <h2 className="text-3xl md:text-4xl font-bold text-[#182321] mt-3 mb-5 leading-tight">
                A POS Terminal Built for
                <span className="gradient-text"> Speed & Clarity</span>
              </h2>
            </AnimatedSection>
            <AnimatedSection variant="fade-right" delay={200}>
              <p className="text-[#697773] leading-relaxed mb-8">
                The cashier interface is intentionally minimal — no distractions, just speed.
                Search products, add to cart, enter tendered amount, and print a receipt.
                The entire checkout flow takes under 10 seconds.
              </p>
            </AnimatedSection>

            <div className="space-y-4">
              {[
                { icon: Zap,         title: 'Instant Product Search',  desc: 'Find any product in under a second with debounced live search.' },
                { icon: CreditCard,  title: 'Auto Change Calculation', desc: 'Enter the tendered amount and change is calculated instantly.' },
                { icon: Shield,      title: 'Race-Condition Safe',     desc: 'Stock deduction and sale recording happen in one atomic transaction.' },
                { icon: FileBarChart,title: 'Daily Sales Summary',     desc: "Cashiers can review their shift's sales and totals at any time." },
              ].map(({ icon: Icon, title, desc }, i) => (
                <AnimatedSection key={title} variant="fade-right" delay={300 + i * 80}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#e5f2f1]/80 border border-[#d9d4c8] flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={15} className="text-[#182321]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#182321]">{title}</p>
                      <p className="text-sm text-[#697773]">{desc}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          <AnimatedSection variant="fade-left" delay={200}>
            <PosMockup />
          </AnimatedSection>
        </div>
      </section>

      {/* ════ STATS ════ */}
      <section id="stats" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#004643]/30 via-[#e5f2f1]/30 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <AnimatedSection variant="fade-up" className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#182321] mb-3">Trusted by Businesses Like Yours</h2>
            <p className="text-[#697773] max-w-lg mx-auto">Numbers that speak to the reliability and scale of ShopNest.</p>
          </AnimatedSection>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(({ value, suffix, label, prefix, decimals }, i) => (
              <AnimatedSection key={label} variant="zoom-in" delay={i * 100}>
                <div className="glass-card border-[#d9d4c8] p-6 text-center">
                  <p className="text-3xl md:text-4xl font-black gradient-text mb-2">
                    <CountUp end={value} suffix={suffix} prefix={prefix} decimals={decimals} duration={2200} />
                  </p>
                  <p className="text-sm text-[#697773]">{label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ════ TESTIMONIALS ════ */}
      <section id="reviews" className="max-w-7xl mx-auto px-6 py-24">
        <AnimatedSection variant="fade-up" className="text-center mb-4">
          <span className="text-xs font-semibold text-[#697773] uppercase tracking-widest">Testimonials</span>
        </AnimatedSection>
        <AnimatedSection variant="fade-up" delay={100} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#182321]">What Our Users Say</h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, role, avatar, color, text, stars }, i) => (
            <AnimatedSection key={name} variant="fade-up" delay={i * 120}>
              <div className="glass-card border-[#d9d4c8] p-6 h-full flex flex-col">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: stars }).map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <Quote size={20} className="text-[#182321]/10 mb-3" />
                <p className="text-sm text-[#182321] leading-relaxed flex-1 mb-6">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-[#182321] text-sm font-bold border border-[#d9d4c8]`}>
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#182321]">{name}</p>
                    <p className="text-xs text-[#697773]">{role}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ════ BETA / PRICING ════ */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-24">
        <AnimatedSection variant="fade-up" className="text-center mb-4">
          <span className="text-xs font-semibold text-[#697773] uppercase tracking-widest">Pricing</span>
        </AnimatedSection>

        {/* Hero banner */}
        <AnimatedSection variant="zoom-in" delay={80}>
          <div className="relative rounded-3xl overflow-hidden mb-16 border border-[#d9d4c8] shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-[#004643]/10 via-white/60 to-[#e5f2f1]/40" />
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#004643]/8 pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#004643]/5 pointer-events-none" />

            <div className="relative px-8 md:px-16 py-14 md:py-20">
              <AnimatedSection variant="fade-up" delay={150} className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#e5f2f1] border border-[#004643]/30 text-sm font-semibold text-[#182321]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#004643] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#004643]" />
                  </span>
                  Currently in Open Beta
                </div>
              </AnimatedSection>

              <AnimatedSection variant="fade-up" delay={220} className="text-center mb-5">
                <h2 className="text-4xl md:text-6xl font-black text-[#182321] leading-tight">
                  Free. <span className="gradient-text">Forever</span> During Beta.
                </h2>
              </AnimatedSection>

              <AnimatedSection variant="fade-up" delay={300} className="text-center mb-10">
                <p className="text-lg text-[#697773] max-w-2xl mx-auto leading-relaxed">
                  ShopNest is completely free while we're in beta. Every feature — unlimited shops,
                  cashiers, analytics, and exports — is yours at no cost. Help us shape the product
                  and lock in early-adopter pricing when we launch.
                </p>
              </AnimatedSection>

              <AnimatedSection variant="zoom-in" delay={400} className="flex justify-center mb-10">
                <div className="glass-strong rounded-2xl px-10 py-6 border border-[#004643]/25 text-center">
                  <div className="flex items-end justify-center gap-3 mb-1">
                    <div className="flex items-start gap-1 opacity-50">
                      <span className="text-base text-[#697773] mt-3">₹</span>
                      <span className="text-4xl font-black text-[#697773] line-through decoration-red-400">999</span>
                      <span className="text-sm text-[#697773]/80 mt-auto mb-1">/mo</span>
                    </div>
                    <span className="text-[#697773]/80 text-2xl font-light mb-1">→</span>
                    <div className="flex items-end gap-1">
                      <span className="text-6xl md:text-7xl font-black gradient-text leading-none">FREE</span>
                    </div>
                  </div>
                  <p className="text-sm text-[#182321] font-medium mt-1">No credit card · No commitment · No catch</p>
                </div>
              </AnimatedSection>

              <AnimatedSection variant="fade-up" delay={500} className="flex justify-center">
                <Link to="/register">
                  <Button variant="gradient" size="xl" iconRight={<ArrowRight size={20} />} className="shadow-2xl shadow-[#004643]/20">
                    Claim Your Free Account
                  </Button>
                </Link>
              </AnimatedSection>
            </div>
          </div>
        </AnimatedSection>

        {/* Perks grid */}
        <AnimatedSection variant="fade-up" delay={100} className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-[#182321] mb-2">Everything Included. No Asterisks.</h3>
          <p className="text-[#697773] text-sm max-w-md mx-auto">Every single feature is fully unlocked for every beta user.</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {BETA_PERKS.map(({ icon: Icon, title, desc, iconColor, bg, border }, i) => (
            <AnimatedSection key={title} variant="fade-up" delay={i * 70}>
              <div className={`flex items-start gap-4 p-5 rounded-2xl border ${bg} ${border} backdrop-blur-xl hover:scale-[1.02] transition-transform duration-200`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white border border-[#004643]/25">
                  <Icon size={18} className={iconColor} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#182321] mb-1">{title}</p>
                  <p className="text-xs text-[#697773] leading-relaxed">{desc}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Roadmap teaser */}
        <AnimatedSection variant="fade-up" delay={100}>
          <div className="glass-card border-[#d9d4c8] p-6 md:p-8 mb-20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-[#697773]" />
                  <span className="text-xs font-semibold text-[#697773] uppercase tracking-widest">Roadmap</span>
                </div>
                <h4 className="text-lg font-bold text-[#182321] mb-1">Paid Plans — Coming Eventually</h4>
                <p className="text-sm text-[#697773] max-w-lg">
                  When we're ready to monetize, beta users who signed up early will receive a{' '}
                  <span className="text-[#182321] font-semibold">permanent discount</span> locked to their account. There's no downside to joining now.
                </p>
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                {[
                  { name: 'Starter',    price: '₹499/mo', color: 'text-[#697773]',  bg: 'bg-white/80',  border: 'border-[#d9d4c8]' },
                  { name: 'Business',   price: '₹999/mo', color: 'text-[#182321]',  bg: 'bg-[#e5f2f1]/80',  border: 'border-[#d9d4c8]' },
                  { name: 'Enterprise', price: 'Custom',  color: 'text-[#182321]',  bg: 'bg-[#004643]/12',  border: 'border-[#d9d4c8]' },
                ].map(({ name, price, color, bg, border }) => (
                  <div key={name} className={`flex items-center justify-between gap-6 px-4 py-2.5 rounded-xl border ${bg} ${border} opacity-70`}>
                    <span className="text-sm font-medium text-[#182321]">{name}</span>
                    <span className={`text-sm font-bold ${color}`}>{price}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#e5f2f1] text-[#004643] border border-[#d9d4c8]">
                      Future
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* FAQ */}
        <AnimatedSection variant="fade-up" delay={100} className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-[#182321] mb-2">Common Questions</h3>
          <p className="text-[#697773] text-sm">Straight answers, no marketing speak.</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {BETA_FAQ.map(({ q, a }, i) => (
            <AnimatedSection key={q} variant="fade-up" delay={i * 80}>
              <div className="glass-card border-[#d9d4c8] p-5 h-full">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#e5f2f1] border border-[#d9d4c8] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-[#182321]">Q</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#182321] mb-2">{q}</p>
                    <p className="text-sm text-[#697773] leading-relaxed">{a}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <AnimatedSection variant="fade-up" delay={200} className="text-center mt-16">
          <p className="text-[#697773] text-sm mb-5">
            Join <span className="text-[#182321] font-semibold">1,200+ shops</span> already running on ShopNest
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register">
              <Button variant="gradient" size="lg" iconRight={<ArrowRight size={16} />}>Get Started — It's Free</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">Already have an account?</Button>
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* ════ FINAL CTA BANNER ════ */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <AnimatedSection variant="zoom-in">
          <div className="relative rounded-3xl overflow-hidden border border-[#d9d4c8] shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-[#004643]/12 via-white/70 to-[#004643]/8" />
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#004643]/8 pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[#004643]/6 pointer-events-none" />

            <div className="relative px-8 py-16 text-center">
              <AnimatedSection variant="fade-up">
                <h2 className="text-3xl md:text-5xl font-black text-[#182321] mb-4">
                  Ready to Transform
                  <br />
                  <span className="gradient-text">Your Business?</span>
                </h2>
              </AnimatedSection>
              <AnimatedSection variant="fade-up" delay={150}>
                <p className="text-[#697773] max-w-lg mx-auto mb-8 text-lg">
                  Join hundreds of shop owners who've already streamlined their operations
                  with ShopNest. Start your free trial today — no credit card required.
                </p>
              </AnimatedSection>
              <AnimatedSection variant="fade-up" delay={300}>
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
                  <Link to="/register">
                    <Button variant="gradient" size="xl" iconRight={<ArrowRight size={20} />}>Start Free Trial</Button>
                  </Link>
                  <DownloadAppButton />
                  <Link to="/login">
                    <Button variant="secondary" size="xl">Sign In Instead</Button>
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#d9d4c8] py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#004643] to-[#0f766e] flex items-center justify-center shadow-inner">
            <Store size={12} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-[#182321]">ShopNest</span>
        </div>

        {/* Copyright */}
        <p className="text-xs text-[#697773]">
          © {new Date().getFullYear()} ShopNest POS. All rights reserved.
        </p>

        {/* Dynamic Routing Links */}
        <div className="flex gap-4">
          {footerLinks.map((link) => (
            <Link 
              key={link.label} 
              to={link.path} 
              className="text-xs font-medium text-[#697773] hover:text-[#182321] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        
      </div>
    </footer>
    </div>
  )
}
