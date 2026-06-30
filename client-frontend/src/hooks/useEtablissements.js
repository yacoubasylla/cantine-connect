import { useState, useEffect, useCallback } from 'react'
import { etablissementService } from '../services/etablissementService'

export function useEtablissements() {
  const [etablissements, setEtablissements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const charger = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await etablissementService.lister()
      setEtablissements(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { charger() }, [charger])

  const creer = async (dto) => {
    const created = await etablissementService.creer(dto)
    setEtablissements((prev) => [...prev, created])
    return created
  }

  return { etablissements, loading, error, creer, recharger: charger }
}
