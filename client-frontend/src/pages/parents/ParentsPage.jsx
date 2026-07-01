import { useState } from 'react'
import {
  Box, Typography, Button, Stack, Alert, CircularProgress,
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
  TablePagination, Paper, IconButton, Tooltip, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
} from '@mui/material'
import AddIcon        from '@mui/icons-material/Add'
import EditIcon       from '@mui/icons-material/Edit'
import DeleteIcon     from '@mui/icons-material/Delete'
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom'
import { useParents } from '../../hooks/useParents'

function ParentFormDialog({ open, onClose, onSuccess, editTarget }) {
  const isEdit = Boolean(editTarget)
  const [utilisateurId, setUtilisateurId] = useState(editTarget ? String(editTarget.utilisateurId) : '')
  const [eleveIds, setEleveIds]           = useState(
    editTarget ? (editTarget.enfants ?? []).map((e) => String(e.id)).join(', ') : ''
  )
  const [saving, setSaving] = useState(false)
  const [err, setErr]       = useState(null)

  const handleSubmit = async () => {
    if (!isEdit && !utilisateurId.trim()) { setErr('ID utilisateur obligatoire'); return }
    setSaving(true); setErr(null)
    const ids = eleveIds.split(',').map((s) => Number(s.trim())).filter(Boolean)
    try {
      if (isEdit) {
        await onSuccess(editTarget.id, ids)
      } else {
        await onSuccess({ utilisateurId: Number(utilisateurId), eleveIds: ids })
      }
      onClose()
    } catch (e) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Modifier les enfants' : 'Nouveau compte parent'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} mt={1}>
          {err && <Alert severity="error">{err}</Alert>}
          {!isEdit && (
            <TextField
              label="ID utilisateur (rôle PARENT)"
              type="number"
              value={utilisateurId}
              onChange={(e) => setUtilisateurId(e.target.value)}
              fullWidth
              helperText="L'utilisateur doit déjà exister avec le rôle PARENT dans la gestion des utilisateurs."
            />
          )}
          <TextField
            label="IDs des élèves associés"
            value={eleveIds}
            onChange={(e) => setEleveIds(e.target.value)}
            fullWidth
            placeholder="ex : 1, 2, 5"
            helperText="Saisissez les identifiants numériques des élèves séparés par des virgules."
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving}>
          {saving ? <CircularProgress size={20} color="inherit" /> : (isEdit ? 'Enregistrer' : 'Créer')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default function ParentsPage() {
  const {
    parents, total, page, setPage, rowsPerPage, setRowsPerPage,
    loading, error, creer, modifierEnfants, supprimer,
  } = useParents()

  const [formOpen, setFormOpen]     = useState(false)
  const [editTarget, setEditTarget] = useState(null)

  const handleAdd = () => { setEditTarget(null); setFormOpen(true) }
  const handleEdit = (parent) => { setEditTarget(parent); setFormOpen(true) }

  const handleSuccess = async (payloadOrId, eleveIds) => {
    if (editTarget) {
      await modifierEnfants(payloadOrId, eleveIds)
    } else {
      await creer(payloadOrId)
    }
  }

  const handleDelete = async (id, nom) => {
    if (!window.confirm(`Supprimer le compte parent de ${nom} ?`)) return
    try { await supprimer(id) } catch (e) { alert(e.message) }
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <FamilyRestroomIcon color="primary" />
          <Typography variant="h5" fontWeight={600}>Comptes Parents</Typography>
        </Stack>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Ajouter
        </Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Parent</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Enfants inscrits</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : parents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  Aucun compte parent enregistré
                </TableCell>
              </TableRow>
            ) : (
              parents.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{p.id}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>{p.prenom} {p.nom}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{p.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      {(p.enfants ?? []).length === 0
                        ? <Typography variant="caption" color="text.disabled">Aucun</Typography>
                        : (p.enfants ?? []).map((e) => (
                            <Chip
                              key={e.id}
                              label={`${e.prenom} ${e.nom}`}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))
                      }
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Modifier les enfants">
                      <IconButton size="small" onClick={() => handleEdit(p)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton size="small" color="error" onClick={() => handleDelete(p.id, `${p.prenom} ${p.nom}`)}>
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

      <ParentFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={handleSuccess}
        editTarget={editTarget}
      />
    </Box>
  )
}
