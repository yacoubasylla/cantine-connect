import { useState, useEffect, useCallback } from 'react'
import { utilisateurService } from '../services/utilisateurService'

export function useUtilisateurs() {
  const [page, setPage]               = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [data, setData]               = useState({ content: [], totalElements: 0 })
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState(null)

  const charger = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await utilisateurService.lister({
        page, size: rowsPerPage, sort: 'nom,asc',
      })
      setData(result)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [page, rowsPerPage])

  useEffect(() => { charger() }, [charger])

  const creer = async (dto) => {
    const created = await utilisateurService.creer(dto)
    charger()
    return created
  }

  const changerRole = async (id, role) => {
    await utilisateurService.changerRole(id, role)
    charger()
  }

  const desactiver = async (id) => {
    await utilisateurService.desactiver(id)
    charger()
  }

  const reactiver = async (id) => {
    await utilisateurService.reactiver(id)
    charger()
  }

  return {
    utilisateurs: data.content,
    total: data.totalElements,
    page, setPage,
    rowsPerPage, setRowsPerPage,
    loading, error,
    creer, changerRole, desactiver, reactiver,
    recharger: charger,
  }
}
