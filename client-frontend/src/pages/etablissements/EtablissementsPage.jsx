import { useState } from 'react'
import {
  Box, Typography, Button, Card, CardContent, Stack, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, CircularProgress, Alert,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SchoolIcon from '@mui/icons-material/School'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneIcon from '@mui/icons-material/Phone'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import { useEtablissements } from '../../hooks/useEtablissements'
import { useAuth } from '../../hooks/useAuth'
import GestionStructureDialog from './GestionStructureDialog'

const FORM_INITIAL = { nom: '', adresse: '', ville: 'Abidjan', telephone: '' }

export default function EtablissementsPage() {
  const { etablissements, loading, error, creer } = useEtablissements()
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(FORM_INITIAL)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)
  const [structureEtab, setStructureEtab] = useState(null)

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleClose = () => {
    setOpen(false)
    setForm(FORM_INITIAL)
    setFormError(null)
  }

  const handleSubmit = async () => {
    if (!form.nom.trim()) { setFormError('Le nom est obligatoire'); return }
    setSaving(true)
    setFormError(null)
    try {
      await creer(form)
      handleClose()
    } catch (e) {
      setFormError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Établissements</Typography>
        {isAdmin && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            Ajouter
          </Button>
        )}
      </Stack>

      {loading && <CircularProgress />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {etablissements.map((etab) => (
          <Card
            key={etab.id}
            sx={{ flex: '1 1 280px', maxWidth: 360, transition: 'box-shadow .2s', '&:hover': { boxShadow: 6 } }}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <SchoolIcon sx={{ color: 'primary.main', fontSize: 32, mt: 0.5 }} />
                <Box flexGrow={1}>
                  <Typography variant="subtitle1" fontWeight={700}>{etab.nom}</Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                    <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">{etab.ville}</Typography>
                  </Stack>
                  {etab.telephone && (
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">{etab.telephone}</Typography>
                    </Stack>
                  )}
                  <Stack direction="row" spacing={1} mt={1}>
                    <Chip label="Actif" color="success" size="small" />
                  </Stack>
                  <Button
                    size="small" startIcon={<AccountTreeIcon />}
                    onClick={() => setStructureEtab(etab)}
                    sx={{ mt: 1 }}
                  >
                    Gérer les classes
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}

        {!loading && etablissements.length === 0 && (
          <Alert severity="info" sx={{ width: '100%' }}>
            Aucun établissement enregistré. Commencez par en ajouter un.
          </Alert>
        )}
      </Box>

      <GestionStructureDialog
        open={Boolean(structureEtab)}
        onClose={() => setStructureEtab(null)}
        etablissement={structureEtab}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Nouvel établissement</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {formError && <Alert severity="error">{formError}</Alert>}
            <TextField label="Nom *" name="nom" value={form.nom} onChange={handleChange} fullWidth autoFocus />
            <TextField label="Adresse" name="adresse" value={form.adresse} onChange={handleChange} fullWidth />
            <TextField label="Ville" name="ville" value={form.ville} onChange={handleChange} fullWidth />
            <TextField label="Téléphone" name="telephone" value={form.telephone} onChange={handleChange} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose}>Annuler</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saving}>
            {saving ? <CircularProgress size={20} /> : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
