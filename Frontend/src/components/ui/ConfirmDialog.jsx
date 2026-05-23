import Modal from './Modal'
import Button from './Button'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title   = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel  = 'Cancel',
  variant = 'danger',
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showClose={false}>
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center">
          <AlertTriangle size={28} className="text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#182321] mb-1">{title}</h3>
          <p className="text-sm text-[#697773] leading-5">{message}</p>
        </div>
        <div className="flex gap-3 w-full">
          <Button variant="secondary" onClick={onClose} fullWidth disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={onConfirm} fullWidth loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
