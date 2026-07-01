import { useState } from 'react'
import {
  Box, Typography, Button, Stack, Alert, Chip, Tooltip, IconButton,
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
  TablePagination, Paper, Skeleton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel,
  CircularProgress, Divider,
} from '@mui/material'
import AddIcon           from '@mui/icons-material/Add'
import EditIcon          from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import RefreshIcon       from '@mui/icons-material/Refresh'
import PersonOffIcon     from '@mui/icons-material/PersonOff'
import PersonAddIcon     from '@mui/icons-material/PersonAdd'
import { useUtilisateurs } from '../../hooks/useUtilisateurs'
import { useAuth }          from '../../hooks/useAuth'

// ── Constantes ────────────────────────────────────────────────────────────────

const ROLES = ['ADMIN', 'GESTIONNAIRE', 'CAISSIER', 'PARENT']

const ROLE_CONFIG = {
  ADMIN:        { label: 'Administrateur', color: 'error'   },
  GESTIONNAIRE: { label: 'Gestionnaire',   color: 'primary' },
  CAISSIER:     { label: 'Caissier',       color: 'default' },
  PARENT:       { label: 'Parent',        color: 'secondary' },
}

const formatDate = (dt) =>
  dt ? new Date(dt).toLocaleDateString('fr-FR') : '—'

// ── Dialog : créer ────────────────────────────────────────────────────────────

function CreerDialog({ open, onClose, onSubmit }) {
  const INIT = { nom: '', prenom: '', email: '', motDePasse: '', role: 'GESTIONNAIRE' }
  const [form,       setForm]  = useState(INIT)
  const [submitting, setSub]   = useState(false)
  const [err,        setErr]   = useState(null)

  const handleClose = () => { setForm(INIT); setErr(null); onClose() }
  const field = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.nom || !form.prenom || !form.email || !form.motDePasse) {
      setErr('Tous les champs sont obligatoires'); return
    }
    if (form.motDePasse.length < 8) {
      setErr('Mot de passe : 8 caractères minimum'); return
    }
    setSub(true); setErr(null)
    try { await onSubmit(form); handleClose() }
    catch (e) { setErr(e.response?.data?.message ?? e.message) }
    finally   { setSub(false) }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Créer un compte utilisateur</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} mt={1}>
          <Stack direction="row" spacing={2}>
            <TextField label="Nom *"    size="small" fullWidth value={form.nom}    onChange={field('nom')} />
            <TextField label="Prénom *" size="small" fullWidth value={form.prenom} onChange={field('prenom')} />
          </Stack>
          <TextField label="Email *" type="email" size="small" fullWidth value={form.email} onChange={field('email')} />
          <TextField
            label="Mot de passe *" type="password" size="small" fullWidth
            value={form.motDePasse} onChange={field('motDePasse')}
            helperText="Minimum 8 caractères"
          />
          <FormControl size="small" fullWidth>
            <InputLabel>Rôle *</InputLabel>
            <Select value={form.role} label="Rôle *" onChange={field('role')}>
              {ROLES.map((r) => (
                <MenuItem key={r} value={r}>
                  <Chip label={ROLE_CONFIG[r].label} color={ROLE_CONFIG[r].color} size="small" sx={{ cursor: 'pointer' }} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {err && <Alert severity="error">{err}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>Annuler</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting}
          startIcon={submitting ? <CircularProgress size={16} /> : null}>
          Créer le compte
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// ── Dialog : modifier ─────────────────────────────────────────────────────────

function ModifierDialog({ utilisateur, onClose, onSubmit }) {
  const [form,       setForm]  = useState({
    nom:              utilisateur?.nom    ?? '',
    prenom:           utilisateur?.prenom ?? '',
    email:            utilisateur?.email  ?? '',
    nouveauMotDePasse: '',
  })
  const [submitting, setSub]  = useState(false)
  const [err,        setErr]  = useState(null)

  const field = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.nom || !form.prenom || !form.email) {
      setErr('Nom, prénom et email sont obligatoires'); return
    }
    if (form.nouveauMotDePasse && form.nouveauMotDePasse.length < 8) {
      setErr('Nouveau mot de passe : 8 caractères minimum'); return
    }
    setSub(true); setErr(null)
    try {
      await onSubmit(utilisateur.id, {
        nom:               form.nom,
        prenom:            form.prenom,
        email:             form.email,
        nouveauMotDePasse: form.nouveauMotDePasse || null,
      })
      onClose()
    } catch (e) {
      setErr(e.response?.data?.message ?? e.message)
    } finally {
      setSub(false)
    }
  }

  return (
    <Dialog open={!!utilisateur} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Modifier le compte — {utilisateur?.prenom} {utilisateur?.nom}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} mt={1}>
          <Stack direction="row" spacing={2}>
            <TextField label="Nom *"    size="small" fullWidth value={form.nom}    onChange={field('nom')} />
            <TextField label="Prénom *" size="small" fullWidth value={form.prenom} onChange={field('prenom')} />
          </Stack>
          <TextField label="Email *" type="email" size="small" fullWidth value={form.email} onChange={field('email')} />
          <Divider />
          <TextField
            label="Nouveau mot de passe"
            type="password"
            size="small"
            fullWidth
            value={form.nouveauMotDePasse}
            onChange={field('nouveauMotDePasse')}
            helperText="Laisser vide pour conserver le mot de passe actuel"
          />
          {err && <Alert severity="error">{err}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>Annuler</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting}
          startIcon={submitting ? <CircularProgress size={16} /> : <EditIcon />}>
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// ── Dialog : confirmer suppression définitive ─────────────────────────────────

function ConfirmSupprimerDialog({ utilisateur, onClose, onConfirm }) {
  const [submitting, setSub] = useState(false)
  const [err,        setErr] = useState(null)

  const handleConfirm = async () => {
    setSub(true); setErr(null)
    try { await onConfirm(utilisateur.id); onClose() }
    catch (e) { setErr(e.response?.data?.message ?? e.message) }
    finally   { setSub(false) }
  }

  return (
    <Dialog open={!!utilisateur} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ color: 'error.main' }}>Supprimer définitivement</DialogTitle>
      <DialogContent>
        <Typography variant="body2" mb={1}>
          Vous allez supprimer <strong>{utilisateur?.prenom} {utilisateur?.nom}</strong> ({utilisateur?.email}).
        </Typography>
        <Alert severity="warning" sx={{ mt: 1 }}>
          Cette action est irréversible — toutes les données de ce compte seront perdues.
        </Alert>
        {err && <Alert severity="error" sx={{ mt: 1 }}>{err}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>Annuler</Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirm}
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <DeleteForeverIcon />}
        >
          Supprimer définitivement
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// ── Page principale ───────────────────────────────────────────────────────────

export default function UtilisateursPage() {
  const [creerOpen,     setCreerOpen]     = useState(false)
  const [userToEdit,    setUserToEdit]    = useState(null)
  const [userToDelete,  setUserToDelete]  = useState(null)
  const [actionError,   setActionError]   = useState(null)
  const { user: currentUser } = useAuth()

  const {
    utilisateurs, total, page, setPage, rowsPerPage, setRowsPerPage,
    loading, error, creer, modifier, changerRole, desactiver, reactiver, supprimer, recharger,
  } = useUtilisateurs()

  const handleDesactiver = async (u) => {
    if (!window.confirm(`Désactiver le compte de ${u.prenom} ${u.nom} ?`)) return
    try { setActionError(null); await desactiver(u.id) }
    catch (e) { setActionError(e.response?.data?.message ?? e.message) }
  }

  const handleReactiver = async (u) => {
    try { setActionError(null); await reactiver(u.id) }
    catch (e) { setActionError(e.response?.data?.message ?? e.message) }
  }

  const handleChangerRole = async (id, role) => {
    try { setActionError(null); await changerRole(id, role) }
    catch (e) { setActionError(e.response?.data?.message ?? e.message) }
  }

  return (
    <Box>
      {/* ── En-tête ─────────────────────────────────────── */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} flexWrap="wrap" gap={1}>
        <Box>
          <Typography variant="h5" fontWeight={600}>Gestion des Utilisateurs</Typography>
          <Typography variant="caption" color="text.secondary">Accès réservé aux Administrateurs</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Actualiser">
            <IconButton onClick={recharger} disabled={loading} size="small"><RefreshIcon /></IconButton>
          </Tooltip>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreerOpen(true)}>
            Nouveau compte
          </Button>
        </Stack>
      </Stack>

      {(error || actionError) && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setActionError(null)}>
          {error || actionError}
        </Alert>
      )}

      {/* ── Table ───────────────────────────────────────── */}
      <Paper variant="outlined">
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell>Nom / Prénom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rôle</TableCell>
                <TableCell align="center">Statut</TableCell>
                <TableCell>Créé le</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((__, j) => (
                        <TableCell key={j}><Skeleton /></TableCell>
                      ))}
                    </TableRow>
                  ))
                : utilisateurs.length === 0
                  ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        Aucun utilisateur
                      </TableCell>
                    </TableRow>
                  )
                  : utilisateurs.map((u) => {
                    const isSelf = u.id === currentUser?.id
                    const cfg = ROLE_CONFIG[u.role] ?? { label: u.role, color: 'default' }
                    return (
                      <TableRow key={u.id} hover sx={{ opacity: u.actif ? 1 : 0.55 }}>

                        {/* Nom / Prénom */}
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{u.nom} {u.prenom}</Typography>
                          {isSelf && <Typography variant="caption" color="primary.main">(vous)</Typography>}
                        </TableCell>

                        {/* Email */}
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: 12 }}>
                            {u.email}
                          </Typography>
                        </TableCell>

                        {/* Rôle inline */}
                        <TableCell sx={{ minWidth: 160 }}>
                          <Select
                            value={u.role}
                            size="small"
                            variant="standard"
                            disabled={isSelf || !u.actif}
                            onChange={(e) => handleChangerRole(u.id, e.target.value)}
                            renderValue={(val) => (
                              <Chip label={ROLE_CONFIG[val]?.label ?? val} color={ROLE_CONFIG[val]?.color ?? 'default'} size="small" />
                            )}
                            sx={{ '& .MuiSelect-select': { py: 0 } }}
                          >
                            {ROLES.map((r) => (
                              <MenuItem key={r} value={r}>
                                <Chip label={ROLE_CONFIG[r].label} color={ROLE_CONFIG[r].color} size="small" sx={{ cursor: 'pointer' }} />
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>

                        {/* Statut */}
                        <TableCell align="center">
                          <Chip
                            label={u.actif ? 'Actif' : 'Inactif'}
                            color={u.actif ? 'success' : 'default'}
                            variant={u.actif ? 'filled' : 'outlined'}
                            size="small"
                          />
                        </TableCell>

                        {/* Date création */}
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">{formatDate(u.createdAt)}</Typography>
                        </TableCell>

                        {/* Actions */}
                        <TableCell align="center">
                          <Stack direction="row" justifyContent="center" spacing={0.5}>

                            {/* Modifier */}
                            <Tooltip title="Modifier les informations">
                              <IconButton size="small" color="primary" onClick={() => setUserToEdit(u)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            {/* Désactiver / Réactiver */}
                            {u.actif ? (
                              <Tooltip title={isSelf ? 'Impossible de se désactiver soi-même' : 'Désactiver'}>
                                <span>
                                  <IconButton size="small" color="warning" disabled={isSelf} onClick={() => handleDesactiver(u)}>
                                    <PersonOffIcon fontSize="small" />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Réactiver">
                                <IconButton size="small" color="success" onClick={() => handleReactiver(u)}>
                                  <PersonAddIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}

                            {/* Supprimer définitivement */}
                            <Tooltip title={isSelf ? 'Impossible de se supprimer soi-même' : 'Supprimer définitivement'}>
                              <span>
                                <IconButton size="small" color="error" disabled={isSelf} onClick={() => setUserToDelete(u)}>
                                  <DeleteForeverIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>

                          </Stack>
                        </TableCell>
                      </TableRow>
                    )
                  })
              }
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, v) => setPage(v)}
          onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0) }}
          rowsPerPageOptions={[10, 20, 50]}
          labelRowsPerPage="Lignes :"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} sur ${count}`}
        />
      </Paper>

      {/* ── Dialogs ─────────────────────────────────────── */}
      <CreerDialog
        open={creerOpen}
        onClose={() => setCreerOpen(false)}
        onSubmit={creer}
      />

      {userToEdit && (
        <ModifierDialog
          utilisateur={userToEdit}
          onClose={() => setUserToEdit(null)}
          onSubmit={modifier}
        />
      )}

      {userToDelete && (
        <ConfirmSupprimerDialog
          utilisateur={userToDelete}
          onClose={() => setUserToDelete(null)}
          onConfirm={supprimer}
        />
      )}
    </Box>
  )
}
