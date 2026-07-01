import { useState } from 'react'
import {
  Box, Typography, Paper, Stack, Switch, Alert, CircularProgress,
  Avatar, Chip,
} from '@mui/material'
import QrCodeScannerIcon  from '@mui/icons-material/QrCodeScanner'
import TuneIcon           from '@mui/icons-material/Tune'
import { useConfigurations } from '../../hooks/useConfig'

// Métadonnées affichables par clé de configuration
const CONFIG_META = {
  SCAN_CAMERA_ENABLED: {
    label:       'Scanner Caméra Réfectoire',
    description: 'Permet aux agents d\'activer la caméra du téléphone ou de la tablette pour scanner les QR Codes directement depuis la page de contrôle accès, sans douchette USB.',
    icon:        <QrCodeScannerIcon />,
    category:    'Scan & Accès',
  },
}

export default function ConfigurationPage() {
  const { configs, loading, error, modifier } = useConfigurations()
  const [saving, setSaving] = useState(null)
  const [saveError, setSaveError] = useState(null)

  const handleToggle = async (cle, currentValeur) => {
    const newValeur = currentValeur === 'true' ? 'false' : 'true'
    setSaving(cle)
    setSaveError(null)
    try {
      await modifier(cle, newValeur)
    } catch (e) {
      setSaveError(e.message)
    } finally {
      setSaving(null)
    }
  }

  const visibles = configs.filter(c => CONFIG_META[c.cle])

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <TuneIcon color="primary" />
        <Typography variant="h5" fontWeight={600}>Configuration Système</Typography>
      </Stack>

      {(error || saveError) && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSaveError(null)}>
          {error || saveError}
        </Alert>
      )}

      <Typography variant="overline" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
        Fonctionnalités
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : visibles.length === 0 ? (
        <Typography variant="body2" color="text.secondary">Aucune configuration disponible.</Typography>
      ) : (
        visibles.map(config => {
          const meta    = CONFIG_META[config.cle]
          const enabled = config.valeur === 'true'
          const isSaving = saving === config.cle

          return (
            <Paper key={config.cle} variant="outlined" sx={{ p: 2.5, mb: 2 }}>
              <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>

                {/* Icône + texte */}
                <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ flex: 1 }}>
                  <Avatar sx={{ bgcolor: enabled ? 'primary.light' : 'action.hover', color: enabled ? 'primary.dark' : 'text.secondary', mt: 0.25 }}>
                    {meta.icon}
                  </Avatar>
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} mb={0.25}>
                      <Typography variant="subtitle1" fontWeight={600}>{meta.label}</Typography>
                      <Chip
                        label={meta.category}
                        size="small"
                        variant="outlined"
                        sx={{ height: 18, fontSize: '0.65rem' }}
                      />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 520 }}>
                      {meta.description}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ mt: 0.75, display: 'block' }}>
                      Clé : <code>{config.cle}</code>
                      {config.dateModification && (
                        <> · Modifié le {new Date(config.dateModification).toLocaleString('fr-FR')}</>
                      )}
                    </Typography>
                  </Box>
                </Stack>

                {/* Toggle */}
                <Stack alignItems="center" spacing={0.25} sx={{ flexShrink: 0 }}>
                  {isSaving
                    ? <CircularProgress size={22} sx={{ my: 0.5 }} />
                    : (
                      <Switch
                        checked={enabled}
                        onChange={() => handleToggle(config.cle, config.valeur)}
                        color="primary"
                      />
                    )
                  }
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color={enabled ? 'success.main' : 'text.disabled'}
                  >
                    {enabled ? 'Activé' : 'Désactivé'}
                  </Typography>
                </Stack>

              </Stack>
            </Paper>
          )
        })
      )}
    </Box>
  )
}
