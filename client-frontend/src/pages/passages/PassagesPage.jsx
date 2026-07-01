import {
  Box, Typography, Stack, TextField, MenuItem, Chip, Button,
  Paper, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, TablePagination, Skeleton, Alert,
  IconButton, Tooltip, Divider,
} from '@mui/material'
import RefreshIcon       from '@mui/icons-material/Refresh'
import CheckCircleIcon   from '@mui/icons-material/CheckCircle'
import CancelIcon        from '@mui/icons-material/Cancel'
import FileDownloadIcon  from '@mui/icons-material/FileDownload'
import HistoryIcon       from '@mui/icons-material/History'
import { usePassages }         from '../../hooks/usePassages'
import { useEtablissements }   from '../../hooks/useEtablissements'

// ── Helpers ───────────────────────────────────────────────────────────────────

const MOTIF_LABELS = {
  STATUT_SUSPENDU:            'Compte suspendu',
  STATUT_EN_ATTENTE_PAIEMENT: 'Paiement en attente',
  DOUBLON_PASSAGE:            'Déjà passé aujourd\'hui',
  QR_CODE_INCONNU:            'QR Code non reconnu',
}

const formatDate  = (d)  => d  ? new Date(d).toLocaleDateString('fr-FR')  : '—'
const formatHeure = (dt) => dt ? new Date(dt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—'

// ── Export CSV ────────────────────────────────────────────────────────────────

function exportCsv(passages) {
  const header = ['Date', 'Heure', 'Matricule', 'Élève', 'Classe', 'Établissement', 'Résultat', 'Motif']
  const rows = passages.map(p => [
    formatDate(p.datePassage),
    formatHeure(p.heurePassage),
    p.eleveMatricule ?? '',
    p.eleveNomComplet ?? '',
    p.classeNom ?? '',
    p.etablissementNom ?? '',
    p.resultat ?? '',
    p.motifRefus ? (MOTIF_LABELS[p.motifRefus] ?? p.motifRefus) : '',
  ])
  const csv = [header, ...rows].map(r => r.map(c => `"${c}"`).join(';')).join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `passages_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Résumé compteurs ──────────────────────────────────────────────────────────

function SummaryBar({ passages, total, loading }) {
  const accordes = passages.filter(p => p.resultat === 'ACCORDE').length
  const refuses  = passages.filter(p => p.resultat === 'REFUSE').length
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
      <Chip label={`${total} au total`}          size="small" variant="outlined" />
      <Chip label={`${accordes} accordés`}        size="small" color="success" variant="outlined" icon={<CheckCircleIcon />} />
      <Chip label={`${refuses} refusés`}          size="small" color="error"   variant="outlined" icon={<CancelIcon />} />
      {loading && <Chip label="Chargement…" size="small" variant="outlined" />}
    </Stack>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PassagesPage() {
  const { etablissements } = useEtablissements()

  const {
    passages, total, page, rowsPerPage, loading, error,
    filtres, setFiltre,
    handlePageChange, handleRowsPerPageChange,
    recharger,
  } = usePassages()

  return (
    <Box>
      {/* En-tête */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={1}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <HistoryIcon color="primary" />
          <Typography variant="h5" fontWeight={600}>Historique des Passages</Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Exporter CSV (page courante)">
            <span>
              <Button
                size="small"
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                disabled={passages.length === 0}
                onClick={() => exportCsv(passages)}
              >
                CSV
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Actualiser">
            <IconButton size="small" onClick={recharger} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Filtres */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap" gap={1.5} alignItems="flex-end">

          <TextField
            label="Date début"
            type="date"
            size="small"
            value={filtres.dateDebut}
            onChange={(e) => setFiltre('dateDebut', e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ minWidth: 160 }}
          />

          <TextField
            label="Date fin"
            type="date"
            size="small"
            value={filtres.dateFin}
            onChange={(e) => setFiltre('dateFin', e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ minWidth: 160 }}
          />

          <TextField
            select
            label="Établissement"
            size="small"
            value={filtres.etablissementId}
            onChange={(e) => setFiltre('etablissementId', e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">Tous les établissements</MenuItem>
            {etablissements.map((e) => (
              <MenuItem key={e.id} value={String(e.id)}>{e.nom}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Résultat"
            size="small"
            value={filtres.resultat}
            onChange={(e) => setFiltre('resultat', e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="ACCORDE">Accordé</MenuItem>
            <MenuItem value="REFUSE">Refusé</MenuItem>
          </TextField>

          <TextField
            label="Recherche élève"
            placeholder="Nom, prénom, matricule…"
            size="small"
            value={filtres.search}
            onChange={(e) => setFiltre('search', e.target.value)}
            sx={{ minWidth: 220, flex: 1 }}
          />

        </Stack>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={recharger}>
          {error}
        </Alert>
      )}

      {/* Compteurs */}
      <SummaryBar passages={passages} total={total} loading={loading} />

      {/* Table */}
      <Paper variant="outlined">
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Date</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Heure</TableCell>
                <TableCell>Matricule</TableCell>
                <TableCell>Élève</TableCell>
                <TableCell>Classe</TableCell>
                <TableCell>Établissement</TableCell>
                <TableCell align="center">Résultat</TableCell>
                <TableCell>Motif de refus</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: rowsPerPage > 10 ? 8 : 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((__, j) => (
                      <TableCell key={j}><Skeleton /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : passages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                    Aucun passage trouvé pour ces critères
                  </TableCell>
                </TableRow>
              ) : (
                passages.map((p) => (
                  <TableRow key={p.passageId ?? p.id} hover>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                      {formatDate(p.datePassage)}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: 13 }}>
                      {formatHeure(p.heurePassage)}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: 13 }}>
                      {p.eleveMatricule ?? '—'}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {p.eleveNomComplet}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {p.classeNom ?? '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {p.etablissementNom ?? '—'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {p.resultat === 'ACCORDE'
                        ? <CheckCircleIcon color="success" fontSize="small" />
                        : <CancelIcon color="error" fontSize="small" />
                      }
                    </TableCell>
                    <TableCell>
                      {p.motifRefus
                        ? (
                          <Chip
                            label={MOTIF_LABELS[p.motifRefus] ?? p.motifRefus.replace(/_/g, ' ')}
                            size="small"
                            color="error"
                            variant="outlined"
                          />
                        )
                        : <Typography variant="body2" color="text.disabled">—</Typography>
                      }
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider />
        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[10, 25, 50, 100]}
          labelRowsPerPage="Lignes :"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} sur ${count}`}
        />
      </Paper>
    </Box>
  )
}
