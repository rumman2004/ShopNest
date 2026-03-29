import { useState, useEffect, useCallback, useRef } from 'react'

export const useFetch = (fetchFn, deps = [], immediate = true) => {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error,   setError]   = useState(null)
  const abortRef = useRef(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFn(...args)
      setData(result)
      return result
    } catch (err) {
      setError(err?.message || 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }, deps) // eslint-disable-line

  useEffect(() => {
    if (immediate) execute()
    return () => abortRef.current?.abort()
  }, [execute]) // eslint-disable-line

  const refetch = useCallback(() => execute(), [execute])

  return { data, loading, error, refetch, execute }
}