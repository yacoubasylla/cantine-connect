import { useState } from 'react'
import {
  Box, Typography, Button, Stack, TextField, MenuItem,
  Table, TableHead, TableBody, TableRow, TableCell,
  TablePagination, TableContainer, Paper,
  IconButton, CircularProgress, Alert, Tooltip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import { useEleves } from '../../hooks/useEleves'
import { useEtablissements } from '../../hooks/useEtablissements'
import StatutBadge from '../../components/StatutBadge'
import EleveFormDialog from './EleveFormDialog'

const STATUTS_FILTRE = [
  { value: '', label: 'Tous les statuts' },
  { value: 'AUTORISE', label: 'Autorisé' },
  { value: 'EN_ATTENTE_PAIEMENT', label: 'En attente' },
  { value: 'GRACE', label: 'Grâce' },
  { value: 'SUSPENDU', label: 'Suspendu' },
]

export default function ElevesPage() {
  const [filtres, setFiltres] = useState({ etablissementId: '', statut: '', search: '' })
  const [formOpen, setFormOpen] = useState(false)
  const [eleveToEdit, setEleveToEdit] = useState(null)

  const { etablissements } = useEtablissements()
  const {
    eleves, total, page, setPage, rowsPerPage, setRowsPerPage,
    loading, error, creer, modifier, supprimer,
  } = useEleves(filtres)

  const setFiltre = (name, value) =>
    setFiltres((prev) => ({ ...prev, [name]: value }))

  const handleAdd = () => { setEleveToEdit(null); setFormOpen(true) }
  const handleEdit = (eleve) => { setEleveToEdit(eleve); setFormOpen(true) }

  const handleSuccess = async (payload) => {
    if (eleveToEdit) {
      await modifier(eleveToEdit.id, payload)
    } else {
      await creer(payload)
    }
  }

  const handleDelete = async (id, nom, prenom) => {
    if (!window.confirm(`Supprimer ${prenom} ${nom} ?`)) return
    try { await supprimer(id) } catch (e) { alert(e.message) }
  }

  return (
    <Box>
      {/* ── En-tête ─────────────────────────────────────── */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Élèves</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Ajouter
        </Button>
      </Stack>

      {/* ── Filtres ─────────────────────────────────────── */}
      <Stack direction="row" spacing={2} mb={2} flexWrap="wrap">
        <TextField
          size="small" label="Recherche" placeholder="Nom, prénom, matricule…"
          value={filtres.search}
          onChange={(e) => setFiltre('search', e.target.value)}
          sx={{ minWidth: 220 }}
        />
        <TextField
          select size="small" label="Établissement"
          value={filtres.etablissementId}
          onChange={(e) => setFiltre('etablissementId', e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Tous</MenuItem>
          {etablissements.map((e) => (
            <MenuItem key={e.id} value={String(e.id)}>{e.nom}</MenuItem>
          ))}
        </TextField>
        <TextField
          select size="small" label="Statut"
          value={filtres.statut}
          onChange={(e) => setFiltre('statut', e.target.value)}
          sx={{ minWidth: 180 }}
        >
          {STATUTS_FILTRE.map((s) => (
            <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
          ))}
        </TextField>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* ── Tableau ─────────────────────────────────────── */}
      <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Matricule</TableCell>
              <TableCell>Nom / Prénom</TableCell>
              <TableCell>Établissement</TableCell>
              <TableCell>Classe</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="center">QR</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : eleves.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  Aucun élève trouvé
                </TableCell>
              </TableRow>
            ) : (
              eleves.map((eleve) => (
                <TableRow key={eleve.id} hover>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 13 }}>{eleve.matricule}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>{eleve.nom} {eleve.prenom}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{eleve.etablissementNom}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{eleve.classeLibelle}</Typography>
                  </TableCell>
                  <TableCell><StatutBadge statut={eleve.statutAcces} /></TableCell>
                  <TableCell align="center">
                    <Tooltip title={eleve.qrCodeToken}>
                      <QrCode2Icon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Modifier">
                      <IconButton size="small" onClick={() => handleEdit(eleve)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton size="small" color="error" onClick={() => handleDelete(eleve.id, eleve.nom, eleve.prenom)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0) }}
          rowsPerPageOptions={[10, 25, 50]}
          labelRowsPerPage="Lignes par page"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} sur ${count}`}
        />
      </TableContainer>

      <EleveFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={handleSuccess}
        eleveToEdit={eleveToEdit}
        etablissements={etablissements}
      />
    </Box>
  )
}
