import {
  Box, Typography, Card, CardContent, Stack,
  Skeleton, Chip, Divider, Alert, IconButton, Tooltip,
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
} from '@mui/material'
import SchoolIcon       from '@mui/icons-material/School'
import PeopleIcon       from '@mui/icons-material/People'
import RestaurantIcon   from '@mui/icons-material/Restaurant'
import HourglassIcon    from '@mui/icons-material/HourglassEmpty'
import CheckCircleIcon  from '@mui/icons-material/CheckCircle'
import CancelIcon       from '@mui/icons-material/Cancel'
import RefreshIcon      from '@mui/icons-material/Refresh'
import { useDashboard } from '../hooks/useDashboard'

const STATUT_CONFIG = {
  AUTORISE:            { label: 'Autorisés',    color: 'success' },
  GRACE:               { label: 'Grâce',        color: 'info'    },
  EN_ATTENTE_PAIEMENT: { label: 'En attente',   color: 'warning' },
  SUSPENDU:            { label: 'Suspendus',    color: 'error'   },
}

function KpiCard({ label, value, icon: Icon, color, loading }) {
  return (
    <Card sx={{ flex: '1 1 180px', minWidth: 160 }}>
      <CardContent sx={{ pb: '16px !important' }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Icon sx={{ fontSize: 38, color }} />
          <Box>
            {loading
              ? <Skeleton width={60} height={40} />
              : <Typography variant="h4" fontWeight={700} lineHeight={1}>{value}</Typography>
            }
            <Typography variant="caption" color="text.secondary">{label}</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

function StatutChip({ statut, count, loading }) {
  const { label, color } = STATUT_CONFIG[statut]
  return (
    <Card variant="outlined" sx={{ flex: '1 1 120px', minWidth: 110 }}>
      <CardContent sx={{ py: 1.5, pb: '12px !important', textAlign: 'center' }}>
        {loading
          ? <Skeleton width={50} height={30} sx={{ mx: 'auto' }} />
          : <Typography variant="h5" fontWeight={700}>{count}</Typography>
        }
        <Chip label={label} color={color} size="small" sx={{ mt: 0.5 }} />
      </CardContent>
    </Card>
  )
}

function PassagesTable({ passages, loading }) {
  return (
    <Card>
      <CardContent sx={{ pb: '16px !important' }}>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Derniers passages du jour
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Heure</TableCell>
                <TableCell>Élève</TableCell>
                <TableCell>Classe</TableCell>
                <TableCell align="center">Résultat</TableCell>
                <TableCell>Motif refus</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 5 }).map((__, j) => (
                        <TableCell key={j}><Skeleton /></TableCell>
                      ))}
                    </TableRow>
                  ))
                : passages.length === 0
                  ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ color: 'text.secondary', py: 2 }}>
                        Aucun passage enregistré aujourd&apos;hui
                      </TableCell>
                    </TableRow>
                  )
                  : passages.map((p) => (
                    <TableRow key={p.passageId} hover>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {p.heurePassage
                          ? new Date(p.heurePassage).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                          : '—'
                        }
                      </TableCell>
                      <TableCell>{p.eleveNomComplet}</TableCell>
                      <TableCell>{p.classeNom ?? '—'}</TableCell>
                      <TableCell align="center">
                        {p.resultat === 'ACCORDE'
                          ? <CheckCircleIcon color="success" fontSize="small" />
                          : <CancelIcon color="error" fontSize="small" />
                        }
                      </TableCell>
                      <TableCell>
                        {p.motifRefus
                          ? <Chip label={p.motifRefus.replace(/_/g, ' ')} size="small" color="error" variant="outlined" />
                          : '—'
                        }
                      </TableCell>
                    </TableRow>
                  ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { stats, loading, error, recharger } = useDashboard()

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight={600}>Tableau de bord</Typography>
        <Tooltip title="Actualiser">
          <IconButton onClick={recharger} disabled={loading} size="small">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={recharger}>
          {error}
        </Alert>
      )}

      {/* KPI Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <KpiCard
          label="Établissements"
          value={stats?.nbEtablissements ?? 0}
          icon={SchoolIcon}
          color="primary.main"
          loading={loading}
        />
        <KpiCard
          label="Élèves actifs"
          value={stats?.totalEleves ?? 0}
          icon={PeopleIcon}
          color="secondary.main"
          loading={loading}
        />
        <KpiCard
          label="Passages aujourd'hui"
          value={stats?.passagesAujourdhui ?? 0}
          icon={RestaurantIcon}
          color="warning.main"
          loading={loading}
        />
        <KpiCard
          label="En attente paiement"
          value={stats?.enAttente ?? 0}
          icon={HourglassIcon}
          color="error.main"
          loading={loading}
        />
      </Box>

      {/* Répartition statuts */}
      <Typography variant="subtitle2" color="text.secondary" mb={1}>
        Répartition des élèves par statut d'accès
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
        <StatutChip statut="AUTORISE"            count={stats?.autorises ?? 0} loading={loading} />
        <StatutChip statut="GRACE"               count={stats?.grace    ?? 0} loading={loading} />
        <StatutChip statut="EN_ATTENTE_PAIEMENT" count={stats?.enAttente ?? 0} loading={loading} />
        <StatutChip statut="SUSPENDU"            count={stats?.suspendus ?? 0} loading={loading} />
      </Box>

      {/* Derniers passages */}
      <PassagesTable
        passages={stats?.derniersPassages ?? []}
        loading={loading}
      />
    </Box>
  )
}
