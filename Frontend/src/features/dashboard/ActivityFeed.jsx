import { useFetch } from '../../hooks/useFetch'
import { useShop }  from '../../hooks/useShop'
import activityService from '../../services/activityService'
import Card, { CardHeader, CardTitle } from '../../components/ui/Card'
import {
  PackagePlus, PackageX, Pencil, ArrowUpDown,
  ImagePlus, Activity, Clock, User,
} from 'lucide-react'

// ── Action config ────────────────────────────────────────────────
const ACTION_CONFIG = {
  product_created: {
    icon: PackagePlus,
    label: 'Added product',
    color: 'text-emerald-600',
    bg:    'bg-emerald-50 border-emerald-200',
  },
  product_updated: {
    icon: Pencil,
    label: 'Updated product',
    color: 'text-blue-600',
    bg:    'bg-blue-50 border-blue-200',
  },
  product_deleted: {
    icon: PackageX,
    label: 'Removed product',
    color: 'text-red-600',
    bg:    'bg-red-50 border-red-200',
  },
  stock_adjusted: {
    icon: ArrowUpDown,
    label: 'Stock adjusted',
    color: 'text-amber-600',
    bg:    'bg-amber-50 border-amber-200',
  },
  image_uploaded: {
    icon: ImagePlus,
    label: 'Image uploaded',
    color: 'text-violet-600',
    bg:    'bg-violet-50 border-violet-200',
  },
}

// ── Parse UTC timestamp from DB ──────────────────────────────────
// MySQL TIMESTAMP values come as UTC from the driver (timezone: '+00:00').
// Strings like "2026-05-16 03:31:00" lack the Z suffix, so new Date()
// treats them as local time. We append 'Z' if missing to force UTC parsing.
function parseUTC(raw) {
  if (!raw) return new Date(NaN)
  if (raw instanceof Date) return raw
  let str = String(raw).trim()
  // If it's already an ISO string with timezone info, parse as-is
  if (/[zZ]$/.test(str) || /[+-]\d{2}:\d{2}$/.test(str)) return new Date(str)
  // Replace space between date and time with 'T' for ISO format
  str = str.replace(' ', 'T')
  // Append 'Z' to indicate UTC
  return new Date(str + 'Z')
}

// ── Time formatter ───────────────────────────────────────────────
function timeAgo(date) {
  const now  = new Date()
  const then = parseUTC(date)
  if (isNaN(then.getTime())) return '—'
  const diff = Math.floor((now - then) / 1000)

  if (diff < 0)    return 'Just now'
  if (diff < 60)   return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`

  return then.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

// ── Change pill ──────────────────────────────────────────────────
function ChangePill({ label, oldVal, newVal, color = 'text-[#004643]' }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] bg-[#f7f4ed] border border-[#ebe6dc] rounded-md px-1.5 py-0.5 font-medium">
      <span className="text-[#9bb7b2] capitalize">{label}:</span>
      <span className="text-[#697773] line-through decoration-red-400/60">{oldVal}</span>
      <span className="text-[#9bb7b2]">→</span>
      <span className={`font-bold ${color}`}>{newVal}</span>
    </span>
  )
}

// ── Detail renderer ──────────────────────────────────────────────
function DetailSummary({ action, details }) {
  if (!details) return null

  // ── Product Created ──
  if (action === 'product_created') {
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 border border-emerald-200 rounded-md px-1.5 py-0.5 font-medium text-emerald-700">
          Price: ₹{details.price}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 border border-emerald-200 rounded-md px-1.5 py-0.5 font-medium text-emerald-700">
          Stock: {details.stock_quantity} units
        </span>
        {details.category && (
          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 border border-emerald-200 rounded-md px-1.5 py-0.5 font-medium text-emerald-700">
            {details.category}
          </span>
        )}
      </div>
    )
  }

  // ── Stock Adjusted ──
  if (action === 'stock_adjusted') {
    const { old_stock, new_stock, adjustment_type, reason } = details
    const isIncrease = new_stock > old_stock
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        <span className={`inline-flex items-center gap-1 text-[10px] border rounded-md px-1.5 py-0.5 font-bold ${
          isIncrease ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {old_stock} → {new_stock}
          <span className="font-normal ml-0.5">({isIncrease ? '+' : ''}{new_stock - old_stock})</span>
        </span>
        <span className="inline-flex items-center text-[10px] bg-amber-50 border border-amber-200 rounded-md px-1.5 py-0.5 font-medium text-amber-700 capitalize">
          {adjustment_type}
        </span>
        {reason && (
          <span className="inline-flex items-center text-[10px] bg-[#f7f4ed] border border-[#ebe6dc] rounded-md px-1.5 py-0.5 text-[#697773] italic">
            "{reason}"
          </span>
        )}
      </div>
    )
  }

  // ── Product Updated / Image Uploaded ──
  if ((action === 'product_updated' || action === 'image_uploaded') && details.changes) {
    const keys = Object.keys(details.changes)
    if (keys.length === 0) return null

    const formatLabel = (k) => k.replace(/_/g, ' ')
    const formatVal = (k, v) => {
      if (v === null || v === undefined) return '—'
      if (k.includes('price')) return `₹${v}`
      if (k === 'stock_quantity') return `${v} units`
      return String(v)
    }

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {keys.map((key) => {
          const change = details.changes[key]
          if (!change || typeof change !== 'object') return null
          return (
            <ChangePill
              key={key}
              label={formatLabel(key)}
              oldVal={formatVal(key, change.old)}
              newVal={formatVal(key, change.new)}
            />
          )
        })}
      </div>
    )
  }

  // ── Product Deleted ──
  if (action === 'product_deleted') {
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        <span className="inline-flex items-center text-[10px] bg-red-50 border border-red-200 rounded-md px-1.5 py-0.5 font-medium text-red-600">
          Permanently removed
        </span>
      </div>
    )
  }

  return null
}

// ── Skeleton ─────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="flex items-start gap-3 px-5 py-3.5 animate-pulse">
      <div className="w-8 h-8 rounded-lg bg-[#e5f2f1] shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="w-3/4 h-3 bg-[#d9d4c8]/50 rounded-full mb-2" />
        <div className="w-1/2 h-2.5 bg-[#d9d4c8]/30 rounded-full" />
      </div>
      <div className="w-10 h-3 bg-[#d9d4c8]/30 rounded-full shrink-0 mt-1" />
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────────
export default function ActivityFeed() {
  const { shopId } = useShop()

  const { data, loading } = useFetch(
    () => shopId ? activityService.getByShop(shopId, { limit: 20 }) : Promise.resolve(null),
    [shopId]
  )

  const logs = data?.data?.logs ?? []

  return (
    <Card className="flex flex-col h-full min-h-[400px]">
      <CardHeader className="border-b border-[#ebe6dc] pb-4">
        <CardTitle className="flex items-center gap-2">
          <Activity size={18} className="text-[#004643]" />
          Recent Activity
        </CardTitle>
      </CardHeader>

      <div className="flex-1 overflow-y-auto no-scrollbar -mx-6 mb-2">
        {loading ? (
          <>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
          </>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 px-6 text-center opacity-70">
            <Activity size={32} className="text-[#c8ddda] mb-3" />
            <p className="text-sm font-semibold text-[#697773]">No activity yet</p>
            <p className="text-xs text-[#697773] mt-1">
              Actions like adding or updating products will appear here.
            </p>
          </div>
        ) : (
          logs.map((log) => {
            const config = ACTION_CONFIG[log.action] || ACTION_CONFIG.product_updated
            const Icon   = config.icon

            return (
              <div
                key={log.log_id}
                className="flex items-start gap-3 px-5 py-3 hover:bg-[#f7f4ed] transition-colors duration-150 border-b border-[#ebe6dc] last:border-0 group"
              >
                {/* Icon */}
                <div className={`shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center ${config.bg}`}>
                  <Icon size={15} className={config.color} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#182321] leading-tight">
                    <span className={`${config.color} font-bold`}>{config.label}</span>
                    {log.entity_name && (
                      <span className="text-[#182321]"> — {log.entity_name}</span>
                    )}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <DetailSummary action={log.action} details={log.details} />
                  </div>

                  {/* User */}
                  {log.user_name && (
                    <div className="flex items-center gap-1 mt-1">
                      <User size={9} className="text-[#9bb7b2]" />
                      <span className="text-[9px] text-[#9bb7b2] font-medium">{log.user_name}</span>
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <div className="shrink-0 flex flex-col items-end gap-0.5 mt-0.5">
                  <span className="text-[10px] text-[#697773] font-semibold whitespace-nowrap">
                    {parseUTC(log.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    {', '}
                    {parseUTC(log.created_at).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={9} className="text-[#c8ddda]" />
                    <span className="text-[9px] text-[#9bb7b2] font-medium whitespace-nowrap">
                      {timeAgo(log.created_at)}
                    </span>
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}
