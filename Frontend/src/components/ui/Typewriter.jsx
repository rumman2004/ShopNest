import { useState, useEffect, useRef } from 'react'

export default function Typewriter({
  words     = [],
  speed     = 200,
  deleteSpeed = 50,
  pauseMs   = 800,
  className = '',
}) {
  const [displayed, setDisplayed] = useState('')
  const [wordIdx,   setWordIdx]   = useState(0)
  const [charIdx,   setCharIdx]   = useState(0)
  const [deleting,  setDeleting]  = useState(false)
  const [pausing,   setPausing]   = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!words.length) return
    if (pausing) {
      timerRef.current = setTimeout(() => {
        setPausing(false)
        setDeleting(true)
      }, pauseMs)
      return
    }

    const currentWord = words[wordIdx]

    if (!deleting) {
      if (charIdx < currentWord.length) {
        timerRef.current = setTimeout(() => {
          setDisplayed(currentWord.slice(0, charIdx + 1))
          setCharIdx((c) => c + 1)
        }, speed)
      } else {
        setPausing(true)
      }
    } else {
      if (charIdx > 0) {
        timerRef.current = setTimeout(() => {
          setDisplayed(currentWord.slice(0, charIdx - 1))
          setCharIdx((c) => c - 1)
        }, deleteSpeed)
      } else {
        setDeleting(false)
        setWordIdx((w) => (w + 1) % words.length)
      }
    }

    return () => clearTimeout(timerRef.current)
  }, [charIdx, deleting, pausing, wordIdx, words, speed, deleteSpeed, pauseMs])

  return (
    <span className={className}>
      {displayed}
      <span className="inline-block w-[2px] h-[1em] bg-blue-400 ml-0.5 align-middle animate-[blink_1s_step-end_infinite]" />
    </span>
  )
}