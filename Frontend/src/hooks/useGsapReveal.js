import { useLayoutEffect } from 'react'
import gsap from 'gsap'

export function useGsapReveal(containerRef, deps = []) {
  useLayoutEffect(() => {
    if (!containerRef.current) return undefined

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('[data-gsap-reveal]')
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.06,
          clearProps: 'transform,opacity,visibility',
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}
