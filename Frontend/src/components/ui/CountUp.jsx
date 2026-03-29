import { useEffect, useRef, useState } from 'react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

export default function CountUp({
  end,
  duration  = 2000,
  prefix    = '',
  suffix    = '',
  decimals  = 0,
  className = '',
}) {
  const [ref, isVisible]  = useScrollAnimation({ threshold: 0.5 })
  const [count, setCount] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!isVisible || started.current) return
    started.current = true

    const startTime = performance.now()
    const animate   = (now) => {
      const elapsed  = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3)
      setCount(eased * end)
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  )
}