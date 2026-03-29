import { useScrollAnimation } from '../../hooks/useScrollAnimation'

// A premium, butter-smooth easing curve (Expo-Out / Apple-like Spring)
const SPRING_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)'

const VARIANTS = {
  'fade-up': {
    hidden:  { opacity: 0, transform: 'translateY(40px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
  'fade-down': {
    hidden:  { opacity: 0, transform: 'translateY(-40px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
  'fade-left': {
    hidden:  { opacity: 0, transform: 'translateX(40px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
  },
  'fade-right': {
    hidden:  { opacity: 0, transform: 'translateX(-40px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
  },
  'fade-in': {
    hidden:  { opacity: 0 },
    visible: { opacity: 1 },
  },
  'zoom-in': {
    hidden:  { opacity: 0, transform: 'scale(0.92)' },
    visible: { opacity: 1, transform: 'scale(1)' },
  },
  'zoom-up': {
    hidden:  { opacity: 0, transform: 'scale(0.95) translateY(30px)' },
    visible: { opacity: 1, transform: 'scale(1) translateY(0)' },
  },
}

export default function AnimatedSection({
  children,
  variant   = 'fade-up',
  delay     = 0,
  duration  = 800,
  className = '',
  as        = 'div',
  threshold = 0.15,
  withBlur  = false, // Disabled by default for performance
}) {
  const [ref, isVisible] = useScrollAnimation({ threshold })
  const Tag = as

  const v = VARIANTS[variant] ?? VARIANTS['fade-up']

  // Construct dynamic hidden states
  const currentHidden = {
    ...v.hidden,
    ...(withBlur ? { filter: 'blur(8px)' } : {}),
    willChange: `opacity, transform${withBlur ? ', filter' : ''}`, // Preps GPU for smooth playback
  }

  // Construct dynamic visible states
  const currentVisible = {
    ...v.visible,
    ...(withBlur ? { filter: 'blur(0px)' } : {}),
  }

  // Safely build the CSS transition string only for properties in use
  const transitions = [
    `opacity ${duration}ms ${SPRING_EASING} ${delay}ms`,
    v.hidden.transform ? `transform ${duration}ms ${SPRING_EASING} ${delay}ms` : null,
    withBlur ? `filter ${duration}ms ${SPRING_EASING} ${delay}ms` : null,
  ].filter(Boolean).join(', ')

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...currentHidden,
        transition: transitions,
        ...(isVisible ? currentVisible : {}),
      }}
    >
      {children}
    </Tag>
  )
}