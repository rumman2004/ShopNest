import { useEffect, useRef, useState } from 'react'

/**
 * Returns a ref and a boolean `isVisible`.
 * Once the element enters the viewport, isVisible flips to true (one-shot).
 */
export const useScrollAnimation = (options = {}) => {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el) // fire once only
        }
      },
      {
        threshold: options.threshold ?? 0.15,
        rootMargin: options.rootMargin ?? '0px 0px -60px 0px',
        ...options,
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, []) // eslint-disable-line

  return [ref, isVisible]
}

/**
 * Staggered children: returns a ref + array of per-child visibility states.
 * Each child fires when it individually enters viewport.
 */
export const useStaggerAnimation = (count, options = {}) => {
  const refs      = Array.from({ length: count }, () => useRef(null)) // eslint-disable-line
  const [visible, setVisible] = useState(Array(count).fill(false))

  useEffect(() => {
    const observers = refs.map((ref, i) => {
      if (!ref.current) return null
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible((prev) => {
              const next = [...prev]
              next[i] = true
              return next
            })
            obs.unobserve(ref.current)
          }
        },
        { threshold: options.threshold ?? 0.1, ...options }
      )
      obs.observe(ref.current)
      return obs
    })
    return () => observers.forEach((o) => o?.disconnect())
  }, []) // eslint-disable-line

  return [refs, visible]
}