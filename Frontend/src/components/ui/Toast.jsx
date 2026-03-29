import { useToast } from '../../hooks/useToast'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

// Theme configuration for distinct, glowing notifications
const toastConfig = {
  success: {
    icon: CheckCircle,
    containerClass: 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_8px_32px_-8px_rgba(16,185,129,0.25)]',
    iconClass: 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]',
  },
  error: {
    icon: AlertCircle,
    containerClass: 'bg-rose-500/10 border-rose-500/30 shadow-[0_8px_32px_-8px_rgba(244,63,94,0.25)]',
    iconClass: 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]',
  },
  warning: {
    icon: AlertTriangle,
    containerClass: 'bg-amber-500/10 border-amber-500/30 shadow-[0_8px_32px_-8px_rgba(245,158,11,0.25)]',
    iconClass: 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]',
  },
  info: {
    icon: Info,
    containerClass: 'bg-[#006F73]/20 border-[#006F73]/40 shadow-[0_8px_32px_-8px_rgba(0,111,115,0.3)]',
    iconClass: 'text-[#84BABF] drop-shadow-[0_0_8px_rgba(132,186,191,0.5)]',
  },
}

function ToastItem({ toast, onRemove }) {
  const config = toastConfig[toast.type] ?? toastConfig.info
  const Icon   = config.icon

  return (
    <div
      className={`
        pointer-events-auto flex items-start gap-3 p-4
        backdrop-blur-xl rounded-2xl border min-w-[280px] max-w-sm
        animate-slide-left transform transition-all duration-300 ease-out
        ${config.containerClass}
      `}
    >
      {/* Dynamic Glowing Icon */}
      <div className={`shrink-0 mt-0.5 ${config.iconClass}`}>
        <Icon size={20} strokeWidth={2.5} />
      </div>
      
      {/* Message Content */}
      <div className="flex-1 flex flex-col justify-center min-h-[22px]">
        <p className="text-sm font-semibold text-[#E0EDE9] leading-snug tracking-wide">
          {toast.message}
        </p>
      </div>

      {/* Dismiss Action */}
      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 p-1 -mr-1 -mt-1 text-[#84BABF]/60 hover:text-white hover:bg-white/10 rounded-lg transition-all focus:outline-none"
        aria-label="Close notification"
      >
        <X size={16} strokeWidth={2.5} />
      </button>
    </div>
  )
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    // pointer-events-none ensures clicks bleed through the padding
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  )
}