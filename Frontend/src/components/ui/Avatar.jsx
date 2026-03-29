import { User } from 'lucide-react'
import { getInitials, stringToColor } from '../../utils/helpers'

export default function Avatar({ name = '', src, size = 'md', className = '' }) {
  // --- Size configurations for container ---
  const sizeMap = {
    xs:  'w-6  h-6  text-[10px]',
    sm:  'w-8  h-8  text-xs',
    md:  'w-10 h-10 text-sm',
    lg:  'w-12 h-12 text-base',
    xl:  'w-16 h-16 text-lg',
    '2xl': 'w-20 h-20 text-xl',
  }

  // --- Size configurations for the Lucide fallback icon ---
  const iconSizeMap = {
    xs:  12,
    sm:  16,
    md:  20,
    lg:  24,
    xl:  32,
    '2xl': 40,
  }

  const currentClass = sizeMap[size] || sizeMap.md
  const iconSize     = iconSizeMap[size] || iconSizeMap.md

  // 1. If an image source is provided
  if (src) {
    return (
      <div 
        className={`
          relative shrink-0 rounded-full overflow-hidden 
          bg-[#06363D] border border-[#84BABF]/20 shadow-inner
          ${currentClass} ${className}
        `}
      >
        <img
          src={src}
          alt={name || 'Avatar'}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  // 2. If a name is provided, generate initials with a dynamic background
  if (name && name.trim().length > 0) {
    const bg = stringToColor(name)
    
    return (
      <div
        className={`
          rounded-full flex items-center justify-center shrink-0
          font-bold tracking-wider text-white drop-shadow-md
          shadow-lg border border-white/20
          ${currentClass} ${className}
        `}
        style={{ background: bg }}
        title={name}
      >
        {getInitials(name)}
      </div>
    )
  }

  // 3. Fallback: Premium Lucide Icon when no src or name exists
  return (
    <div
      className={`
        rounded-full flex items-center justify-center shrink-0
        bg-[#006F73]/20 border border-[#006F73]/40 text-[#84BABF]
        shadow-inner
        ${currentClass} ${className}
      `}
      title="User Profile"
    >
      <User size={iconSize} strokeWidth={2.5} />
    </div>
  )
}