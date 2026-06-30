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
import { etablissementService } from '../../services/etablissementService'

function NiveauItem({ niveau, onAddClasse }) {
  const [open, setOpen] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [libelle, setLibelle] = useState('')
  const [annee, setAnnee] = useState('2025-2026')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState(null)

  const handleAddClasse = async () => {
    if (!libelle.trim()) { setErr('Le libellé est obligatoire'); return }
    setSaving(true); setErr(null)
    try {
      await onAddClasse(niveau.id, { libelle, anneeScolaire: annee })
      setLibelle(''); setShowForm(false)
    } catch (e) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box sx={{ mb: 1 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between"
        sx={{ bgcolor: 'primary.main', color: 'white', px: 2, py: 1, borderRadius: 1 }}
      >
        <Typography fontWeight={600}>{niveau.libelle}</Typography>
        <Stack direction="row" spacing={1}>
          <Chip label={`${niveau.classes.length} classe(s)`} size="small"
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
          <IconButton size="small" sx={{ color: 'white' }} onClick={() => setOpen(!open)}>
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Stack>
      </Stack>

      <Collapse in={open}>
        <Box sx={{ pl: 2, pt: 1, pb: 0.5 }}>
          {niveau.classes.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
              Aucune classe — ajoutez-en une ci-dessous.
            </Typography>
          ) : (
            <List dense disablePadding>
              {niveau.classes.map((c) => (
                <ListItem key={c.id} sx={{ py: 0.25 }}>
                  <ClassIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <ListItemText
                    primary={c.libelle}
                    secondary={c.anneeScolaire}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
            </List>
          )}

          {showForm ? (
            <Stack direction="row" spacing={1} mt={1} alignItems="center">
              <TextField size="small" label="Libellé *" value={libelle}
                onChange={(e) => setLibelle(e.target.value)} sx={{ flex: 1 }}
                error={Boolean(err)} helperText={err} />
              <TextField size="small" label="Année scolaire" value={annee}
                onChange={(e) => setAnnee(e.target.value)} sx={{ width: 130 }} />
              <Button variant="contained" size="small" onClick={handleAddClasse} disabled={saving}>
                {saving ? <CircularProgress size={16} /> : 'Ajouter'}
              </Button>
              <Button size="small" onClick={() => setShowForm(false)}>Annuler</Button>
            </Stack>
          ) : (
            <Button size="small" startIcon={<AddIcon />} onClick={() => setShowForm(true)} sx={{ mt: 0.5 }}>
              Ajouter une classe
            </Button>
          )}
        </Box>
      </Collapse>
      <Divider sx={{ mt: 1 }} />
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
      const data = await etablissementService.getNiveaux(etablissement.id)
      setNiveaux(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [etablissement])

  useEffect(() => { if (open) chargerNiveaux() }, [open, chargerNiveaux])

  const handleAddNiveau = async () => {
    if (!newNiveau.trim()) { setNiveauErr('Le libellé est obligatoire'); return }
    setAddingNiveau(true); setNiveauErr(null)
    try {
      await etablissementService.creerNiveau(etablissement.id, {
        libelle: newNiveau,
        ordre: niveaux.length,
      })
      setNewNiveau('')
      await chargerNiveaux()
    } catch (e) {
      setNiveauErr(e.message)
    } finally {
      setAddingNiveau(false)
    }
  }

  const handleAddClasse = async (niveauId, dto) => {
    await etablissementService.creerClasse(niveauId, dto)
    await chargerNiveaux()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Structure — {etablissement?.nom}
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box textAlign="center" py={3}><CircularProgress /></Box>
        ) : (
          <Box>
            {niveaux.length === 0 && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Aucun niveau créé. Commencez par ajouter un niveau (ex: CP, CE1, CM1…)
              </Alert>
            )}

            {niveaux.map((n) => (
              <NiveauItem key={n.id} niveau={n} onAddClasse={handleAddClasse} />
            ))}

            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" mb={1}>Nouveau niveau</Typography>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <TextField
                  size="small" label="Ex : CP, CE1, CM2, 6ème…"
                  value={newNiveau}
                  onChange={(e) => setNewNiveau(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNiveau()}
                  error={Boolean(niveauErr)}
                  helperText={niveauErr}
                  sx={{ flex: 1 }}
                />
                <Button variant="outlined" startIcon={<AddIcon />}
                  onClick={handleAddNiveau} disabled={addingNiveau}>
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
