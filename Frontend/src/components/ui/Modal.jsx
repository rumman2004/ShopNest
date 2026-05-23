import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import Button from './Button'

export default function Modal({
  isOpen,
  onClose,
  title,
  eyebrow,
  description,
  icon,
  children,
  size     = 'md',
  showClose= true,
  className= '',
  bodyClassName = '',
}) {
  const overlayRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeMap = {
    sm: 'max-w-lg',
    md: 'max-w-2xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    full: 'max-w-[95vw]',
  }

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-fade-in bg-[#182321]/55 backdrop-blur-md"
    >
      <div
        className={`
          w-full max-h-[min(90vh,780px)] overflow-hidden rounded-lg
          bg-[#faf8f2] border border-[#d9d4c8]
          shadow-[0_24px_80px_rgba(24,35,33,0.30)]
          animate-scale-in
          ${sizeMap[size] ?? sizeMap.md}
          ${className}
        `}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-start justify-between gap-4 border-b border-[#d9d4c8] bg-white px-5 sm:px-6 py-4">
            <div className="flex min-w-0 items-start gap-3">
              {icon && (
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#c8ddda] bg-[#e5f2f1] text-[#004643]">
                  {icon}
                </div>
              )}
              <div className="min-w-0">
                {eyebrow && (
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-[#697773]">
                    {eyebrow}
                  </p>
                )}
                {title && (
                  <h2 className="text-lg sm:text-xl font-bold leading-tight text-[#182321]">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-1 max-w-xl text-sm leading-5 text-[#697773]">
                    {description}
                  </p>
                )}
              </div>
            </div>
            {showClose && (
              <Button
                variant="ghost"
                size="xs"
                onClick={onClose}
                icon={<X size={16} />}
                className="ml-auto shrink-0"
                aria-label="Close"
              />
            )}
          </div>
        )}
        {/* Body */}
        <div className={`max-h-[calc(90vh-86px)] overflow-y-auto px-5 sm:px-6 py-5 ${bodyClassName}`}>
          {children}
        </div>
      </div>
    </div>
  )
}
