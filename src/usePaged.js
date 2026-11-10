import { useCallback, useEffect, useState } from 'react'
import { api } from './api'

export function usePaged(path, limit = 10) {
  const [page, setPage] = useState(1)
  const [result, setResult] = useState({ data: [], hasMore: false })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const sep = path.includes('?') ? '&' : '?'
      setResult(await api(`${path}${sep}page=${page}&limit=${limit}`))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [path, page, limit])

  useEffect(() => {
    load()
  }, [load])

  return { ...result, page, setPage, loading, error, reload: load }
}
