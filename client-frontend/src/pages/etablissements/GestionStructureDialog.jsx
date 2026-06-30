import { useState, useEffect, useCallback } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, Button, Stack, TextField,
  List, ListItem, ListItemText, Divider,
  CircularProgress, Alert, Chip, IconButton, Collapse,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ClassIcon from '@mui/icons-material/Class'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import { etablissementService } from '../../services/etablissementService'

function NiveauItem({ niveau, onAddClasses, onDeleteNiveau, onDeleteClasse }) {
  const [open, setOpen] = useState(true)
  const [input, setInput] = useState('')
  const [annee, setAnnee] = useState('2025-2026')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState(null)
  const [successCount, setSuccessCount] = useState(0)

  const handleAdd = async () => {
    const noms = input.split(',').map((s) => s.trim()).filter(Boolean)
    if (noms.length === 0) { setErr('Saisissez au moins un libellé'); return }
    setSaving(true); setErr(null); setSuccessCount(0)
    try {
      await Promise.all(
        noms.map((libelle) => onAddClasses(niveau.id, { libelle, anneeScolaire: annee }))
      )
      setSuccessCount(noms.length)
      setInput('')
      setTimeout(() => setSuccessCount(0), 2500)
    } catch (e) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box sx={{ mb: 1.5 }}>
      {/* ── En-tête niveau ── */}
      <Stack direction="row" alignItems="center" justifyContent="space-between"
        sx={{ bgcolor: 'primary.main', color: 'white', px: 2, py: 1, borderRadius: 1 }}
      >
        <Typography fontWeight={600}>{niveau.libelle}</Typography>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Chip
            label={`${niveau.classes.length} classe(s)`} size="small"
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
          />
          <IconButton size="small" sx={{ color: 'white' }} onClick={() => setOpen(!open)}>
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          <IconButton
            size="small" sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { color: '#ff8a80' } }}
            onClick={() => onDeleteNiveau(niveau)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>

      <Collapse in={open}>
        <Box sx={{ pl: 2, pr: 1, pt: 1, pb: 1.5, bgcolor: 'grey.50', borderRadius: '0 0 6px 6px' }}>

          {/* ── Liste des classes existantes ── */}
          {niveau.classes.length > 0 && (
            <List dense disablePadding sx={{ mb: 1 }}>
              {niveau.classes.map((c) => (
                <ListItem
                  key={c.id} sx={{ py: 0.2, pl: 0 }}
                  secondaryAction={
                    <IconButton
                      size="small" edge="end" color="error"
                      onClick={() => onDeleteClasse(c)}
                      sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
                    >
                      <DeleteIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  }
                >
                  <ClassIcon sx={{ fontSize: 15, mr: 1, color: 'primary.light' }} />
                  <ListItemText
                    primary={c.libelle}
                    secondary={c.anneeScolaire}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
            </List>
          )}

          {/* ── Formulaire d'ajout rapide toujours visible ── */}
          <Stack spacing={1}>
            <TextField
              size="small"
              label="Noms des classes *"
              placeholder="Ex : CP A, CP B, CP C"
              value={input}
              onChange={(e) => { setInput(e.target.value); setErr(null) }}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              error={Boolean(err)}
              helperText={err || 'Séparez par des virgules pour créer plusieurs classes en une fois'}
              fullWidth
              autoComplete="off"
            />
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                size="small" label="Année scolaire"
                value={annee} onChange={(e) => setAnnee(e.target.value)}
                sx={{ width: 140 }}
              />
              <Button
                variant="contained" size="small"
                startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <AddIcon />}
                onClick={handleAdd} disabled={saving}
                sx={{ whiteSpace: 'nowrap' }}
              >
                {saving ? 'Création…' : 'Ajouter'}
              </Button>
              {successCount > 0 && (
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'success.main' }}>
                  <CheckCircleIcon fontSize="small" />
                  <Typography variant="caption" fontWeight={600}>
                    {successCount} classe{successCount > 1 ? 's' : ''} créée{successCount > 1 ? 's' : ''}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Box>
      </Collapse>
      <Divider />
    </Box>
  )
}

export default function GestionStructureDialog({ open, onClose, etablissement }) {
  const [niveaux, setNiveaux] = useState([])
  const [loading, setLoading] = useState(false)
  const [newNiveau, setNewNiveau] = useState('')
  const [addingNiveau, setAddingNiveau] = useState(false)
  const [niveauErr, setNiveauErr] = useState(null)

  const chargerNiveaux = useCallback(async () => {
    if (!etablissement) return
    setLoading(true)
    try {
      setNiveaux(await etablissementService.getNiveaux(etablissement.id))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [etablissement])

  useEffect(() => { if (open) chargerNiveaux() }, [open, chargerNiveaux])

  const handleAddNiveau = async () => {
    const noms = newNiveau.split(',').map((s) => s.trim()).filter(Boolean)
    if (noms.length === 0) { setNiveauErr('Le libellé est obligatoire'); return }
    setAddingNiveau(true); setNiveauErr(null)
    try {
      await Promise.all(
        noms.map((libelle, i) =>
          etablissementService.creerNiveau(etablissement.id, { libelle, ordre: niveaux.length + i })
        )
      )
      setNewNiveau('')
      await chargerNiveaux()
    } catch (e) {
      setNiveauErr(e.message)
    } finally {
      setAddingNiveau(false)
    }
  }

  const handleAddClasses = async (niveauId, dto) => {
    await etablissementService.creerClasse(niveauId, dto)
    await chargerNiveaux()
  }

  const handleDeleteNiveau = async (niveau) => {
    const msg = niveau.classes.length > 0
      ? `Supprimer le niveau "${niveau.libelle}" et ses ${niveau.classes.length} classe(s) ?`
      : `Supprimer le niveau "${niveau.libelle}" ?`
    if (!window.confirm(msg)) return
    try {
      await etablissementService.supprimerNiveau(niveau.id)
      await chargerNiveaux()
    } catch (e) {
      alert(e.message)
    }
  }

  const handleDeleteClasse = async (classe) => {
    if (!window.confirm(`Supprimer la classe "${classe.libelle}" ?`)) return
    try {
      await etablissementService.supprimerClasse(classe.id)
      await chargerNiveaux()
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Structure — {etablissement?.nom}</DialogTitle>

      <DialogContent>
        {loading ? (
          <Box textAlign="center" py={4}><CircularProgress /></Box>
        ) : (
          <Box>
            {niveaux.length === 0 && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Commencez par ajouter un niveau (ex: CP, CE1, CM2…)
              </Alert>
            )}

            {niveaux.map((n) => (
              <NiveauItem
                key={n.id} niveau={n}
                onAddClasses={handleAddClasses}
                onDeleteNiveau={handleDeleteNiveau}
                onDeleteClasse={handleDeleteClasse}
              />
            ))}

            {/* ── Ajout de niveau(x) ── */}
            <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.50', border: '1px dashed', borderColor: 'primary.light', borderRadius: 1 }}>
              <Typography variant="subtitle2" mb={1} color="primary.dark">
                Ajouter un ou plusieurs niveaux
              </Typography>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <TextField
                  size="small"
                  label="Niveau(x)"
                  placeholder="Ex : CP  ou  CP, CE1, CM1, CM2"
                  value={newNiveau}
                  onChange={(e) => { setNewNiveau(e.target.value); setNiveauErr(null) }}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNiveau()}
                  error={Boolean(niveauErr)}
                  helperText={niveauErr || 'Séparez par des virgules pour créer plusieurs niveaux'}
                  sx={{ flex: 1 }}
                  autoComplete="off"
                />
                <Button
                  variant="outlined" startIcon={<AddIcon />}
                  onClick={handleAddNiveau} disabled={addingNiveau}
                  sx={{ mt: 0.25, whiteSpace: 'nowrap' }}
                >
                  {addingNiveau ? <CircularProgress size={18} /> : 'Ajouter'}
                </Button>
              </Stack>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="contained" onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  )
}
