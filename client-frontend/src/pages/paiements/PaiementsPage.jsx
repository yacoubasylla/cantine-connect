import { useState, useEffect } from 'react'
import {
  Box, Typography, Button, Stack, Chip, Alert,
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
  TablePagination, Paper, Skeleton, Tooltip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel,
  Autocomplete, CircularProgress, Link,
} from '@mui/material'
import AddIcon       from '@mui/icons-material/Add'
import RefreshIcon   from '@mui/icons-material/Refresh'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { usePaiements } from '../../hooks/usePaiements'
import { eleveService }  from '../../services/eleveService'

// ── Constantes ────────────────────────────────────────────────────────────────

const STATUTS = [
  { value: '',            label: 'Tous'         },
  { value: 'EN_ATTENTE',  label: 'En attente'   },
  { value: 'ACCEPTE',     label: 'Accepté'      },
  { value: 'REFUSE',      label: 'Refusé'       },
  { value: 'ANNULE',      label: 'Annulé'       },
]

const STATUT_COLOR = {
  EN_ATTENTE: 'warning',
  ACCEPTE:    'success',
  REFUSE:     'error',
  ANNULE:     'default',
}

const OPERATEURS = [
  { value: 'ORANGE_MONEY', label: 'Orange Money', color: '#FF6600' },
  { value: 'MTN_MONEY',    label: 'MTN Money',    color: '#FFCC00' },
  { value: 'MOOV_MONEY',   label: 'Moov Money',   color: '#0066CC' },
  { value: 'WAVE',         label: 'Wave',         color: '#0099CC' },
]

const operateurLabel = (val) => OPERATEURS.find((o) => o.value === val)?.label ?? val
const operateurColor = (val) => OPERATEURS.find((o) => o.value === val)?.color ?? '#888'

const formatMontant = (val) =>
  new Intl.NumberFormat('fr-FR', { style: 'decimal' }).format(val) + ' XOF'

const formatDate = (dt) =>
  dt ? new Date(dt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '—'

// ── Dialogue : Initier un paiement ────────────────────────────────────────────

function InitierDialog({ open, onClose, onSubmit }) {
  const FORM_INIT = { eleve: null, operateur: '', montant: '', telephonePayeur: '' }
  const [form,    setForm]    = useState(FORM_INIT)
  const [submitting, setSub]  = useState(false)
  const [formError, setFErr]  = useState(null)
  const [paymentUrl, setUrl]  = useState(null)

  // Autocomplete élève
  const [inputEleve, setInputEleve]   = useState('')
  const [optEleves, setOptEleves]     = useState([])
  const [loadingEleves, setLdEleves]  = useState(false)

  useEffect(() => {
    if (!open) { setForm(FORM_INIT); setFErr(null); setUrl(null); setInputEleve(''); setOptEleves([]) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (inputEleve.length < 2) { setOptEleves([]); return }
    const timer = setTimeout(async () => {
      setLdEleves(true)
      try {
        const res = await eleveService.lister({ search: inputEleve, size: 10 })
        setOptEleves(
          res.content.map((e) => ({
            id: e.id,
            label: `${e.prenom} ${e.nom} — ${e.classeLibelle ?? e.etablissementNom ?? '?'}`,
          }))
        )
      } catch { setOptEleves([]) }
      finally  { setLdEleves(false) }
    }, 300)
    return () => clearTimeout(timer)
  }, [inputEleve])

  const field = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.eleve)              { setFErr('Sélectionne un élève'); return }
    if (!form.operateur)          { setFErr('Choisis un opérateur'); return }
    if (!form.montant || Number(form.montant) < 100) { setFErr('Montant minimum : 100 XOF'); return }
    if (!form.telephonePayeur)    { setFErr('Numéro de téléphone requis'); return }

    setSub(true); setFErr(null)
    try {
      const result = await onSubmit({
        eleveId:          form.eleve.id,
        operateur:        form.operateur,
        montant:          Number(form.montant),
        telephonePayeur:  form.telephonePayeur,
      })
      setUrl(result.paymentUrl)
    } catch (e) {
      setFErr(e.message)
    } finally {
      setSub(false)
    }
  }

  return (
    <Dialog open={open} onClose={paymentUrl ? onClose : undefined} maxWidth="sm" fullWidth>
      <DialogTitle>Initier un paiement Mobile Money</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} mt={1}>

          {paymentUrl ? (
            <Alert severity="success"
              action={
                <IconButton size="small" component="a" href={paymentUrl} target="_blank" rel="noopener">
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
              }>
              Paiement initié avec succès !
              <br />
              <Link href={paymentUrl} target="_blank" rel="noopener" variant="body2">
                Ouvrir la page de paiement CinetPay
              </Link>
            </Alert>
          ) : (
            <>
              <Autocomplete
                options={optEleves}
                loading={loadingEleves}
                loadingText="Chargement..."
                value={form.eleve}
                onChange={(_, v) => field('eleve')(v)}
                inputValue={inputEleve}
                onInputChange={(_, v) => setInputEleve(v)}
                isOptionEqualToValue={(o, v) => o.id === v?.id}
                noOptionsText={inputEleve.length < 2 ? 'Saisir au moins 2 caractères' : 'Aucun résultat'}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Élève *"
                    size="small"
                    slotProps={{
                      ...params.slotProps,
                      input: {
                        ...params.slotProps?.input,
                        endAdornment: (
                          <>
                            {loadingEleves && <CircularProgress size={16} />}
                            {params.slotProps?.input?.endAdornment}
                          </>
                        ),
                      },
                    }}
                  />
                )}
              />

              <FormControl size="small" fullWidth>
                <InputLabel>Opérateur *</InputLabel>
                <Select
                  value={form.operateur}
                  label="Opérateur *"
                  onChange={(e) => field('operateur')(e.target.value)}
                >
                  {OPERATEURS.map((op) => (
                    <MenuItem key={op.value} value={op.value}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: op.color }} />
                        <span>{op.label}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Montant (XOF) *"
                type="number"
                size="small"
                value={form.montant}
                onChange={(e) => field('montant')(e.target.value)}
                slotProps={{ htmlInput: { min: 100, step: 50 } }}
              />

              <TextField
                label="Téléphone du payeur *"
                size="small"
                placeholder="07XXXXXXXX"
                value={form.telephonePayeur}
                onChange={(e) => field('telephonePayeur')(e.target.value)}
              />
            </>
          )}

          {formError && <Alert severity="error">{formError}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          {paymentUrl ? 'Fermer' : 'Annuler'}
        </Button>
        {!paymentUrl && (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={16} /> : null}
          >
            Initier le paiement
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

// ── Page principale ───────────────────────────────────────────────────────────

export default function PaiementsPage() {
  const [statutFiltre, setStatutFiltre] = useState('')
  const [dialogOpen,   setDialogOpen]   = useState(false)

  const {
    paiements, total, page, setPage, rowsPerPage, setRowsPerPage,
    loading, error, initier, recharger,
  } = usePaiements(statutFiltre ? { statut: statutFiltre } : {})

  return (
    <Box>
      {/* ── En-tête ─────────────────────────────────────── */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} flexWrap="wrap" gap={1}>
        <Typography variant="h5" fontWeight={600}>Paiements Mobile Money</Typography>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Actualiser">
            <IconButton onClick={recharger} disabled={loading} size="small">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
            Initier un paiement
          </Button>
        </Stack>
      </Stack>

      {/* ── Filtres statut ──────────────────────────────── */}
      <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
        {STATUTS.map((s) => (
          <Chip
            key={s.value}
            label={s.label}
            onClick={() => { setStatutFiltre(s.value); setPage(0) }}
            color={statutFiltre === s.value ? (STATUT_COLOR[s.value] || 'primary') : 'default'}
            variant={statutFiltre === s.value ? 'filled' : 'outlined'}
            size="small"
          />
        ))}
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* ── Table ───────────────────────────────────────── */}
      <Paper variant="outlined">
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell>Date</TableCell>
                <TableCell>Élève</TableCell>
                <TableCell>Opérateur</TableCell>
                <TableCell align="right">Montant</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Référence</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((__, j) => (
                        <TableCell key={j}><Skeleton /></TableCell>
                      ))}
                    </TableRow>
                  ))
                : paiements.length === 0
                  ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        Aucune transaction
                        {statutFiltre && ` avec le statut "${STATUTS.find(s => s.value === statutFiltre)?.label}"`}
                      </TableCell>
                    </TableRow>
                  )
                  : paiements.map((p) => (
                    <TableRow key={p.id} hover>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(p.dateCreation)}</TableCell>
                      <TableCell>{p.eleveNomComplet}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.75}>
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: operateurColor(p.operateur), flexShrink: 0 }} />
                          <Typography variant="caption">{operateurLabel(p.operateur)}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        {formatMontant(p.montant)}
                      </TableCell>
                      <TableCell>{p.telephonePayeur ?? '—'}</TableCell>
                      <TableCell>
                        <Chip
                          label={STATUTS.find((s) => s.value === p.statut)?.label ?? p.statut}
                          color={STATUT_COLOR[p.statut] ?? 'default'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="caption"
                          fontFamily="monospace"
                          title={p.referenceInterne}
                        >
                          {p.referenceInterne?.slice(0, 8)}…
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
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

      {/* ── Dialogue initier ────────────────────────────── */}
      <InitierDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={initier}
      />
    </Box>
  )
}
