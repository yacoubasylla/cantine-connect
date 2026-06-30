import apiClient from './apiClient'

export const dashboardService = {
  getStats: async () => {
    const today = new Date().toISOString().split('T')[0]

    const [etablissements, totalEleves, autorises, enAttente, suspendus, grace, passagesResp] =
      await Promise.all([
        apiClient.get('/etablissements').then((r) => r.data.data),
        apiClient.get('/eleves', { params: { size: 1 } }).then((r) => r.data.data.totalElements),
        apiClient.get('/eleves', { params: { statut: 'AUTORISE', size: 1 } }).then((r) => r.data.data.totalElements),
        apiClient.get('/eleves', { params: { statut: 'EN_ATTENTE_PAIEMENT', size: 1 } }).then((r) => r.data.data.totalElements),
        apiClient.get('/eleves', { params: { statut: 'SUSPENDU', size: 1 } }).then((r) => r.data.data.totalElements),
        apiClient.get('/eleves', { params: { statut: 'GRACE', size: 1 } }).then((r) => r.data.data.totalElements),
        apiClient.get('/passages', { params: { date: today, size: 10 } }).then((r) => r.data.data),
      ])

    return {
      nbEtablissements: etablissements.length,
      totalEleves,
      autorises,
      enAttente,
      suspendus,
      grace,
      passagesAujourdhui: passagesResp.totalElements,
      derniersPassages: passagesResp.content.slice(0, 5),
    }
  },
}
