export default function Card({
  children,
  className = '',
  hover     = false,
  glow      = null,
  padding   = 'p-6',
  ...props
}) {
  const glowMap = {
    blue:   'glow-blue',
    purple: 'glow-purple',
    green:  'glow-green',
    red:    'glow-red',
  }

  return (
    <div
      className={`
        glass-card
        ${padding}
        ${hover ? 'card-hover cursor-pointer' : ''}
        ${glow ? glowMap[glow] : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`flex items-center justify-between mb-5 ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-base font-semibold text-white/90 ${className}`}>
      {children}
    </h3>
  )
}

export function CardBody({ children, className = '' }) {
  return <div className={className}>{children}</div>
}