import { useToast } from '../../hooks/useToast'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

// Theme configuration for distinct, glowing notifications
const toastConfig = {
  success: {
    icon: CheckCircle,
    containerClass: 'bg-white border-emerald-200 shadow-lg',
    iconClass: 'text-emerald-600',
  },
  error: {
    icon: AlertCircle,
    containerClass: 'bg-white border-rose-200 shadow-lg',
    iconClass: 'text-rose-600',
  },
  warning: {
    icon: AlertTriangle,
    containerClass: 'bg-white border-amber-200 shadow-lg',
    iconClass: 'text-amber-600',
  },
  info: {
    icon: Info,
    containerClass: 'bg-white border-[#c8ddda] shadow-lg',
    iconClass: 'text-[#004643]',
  },
}

function ToastItem({ toast, onRemove }) {
  const config = toastConfig[toast.type] ?? toastConfig.info
  const Icon   = config.icon

  return (
    <div
      className={`
        pointer-events-auto flex items-start gap-3 p-4
        rounded-lg border min-w-[280px] max-w-sm
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
        <p className="text-sm font-semibold text-[#182321] leading-snug tracking-wide">
          {toast.message}
        </p>
      </div>

      {/* Dismiss Action */}
      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 p-1 -mr-1 -mt-1 text-[#697773] hover:text-[#004643] hover:bg-[#e5f2f1] rounded-lg transition-all focus:outline-none"
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
