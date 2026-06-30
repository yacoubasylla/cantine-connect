import { Box, Typography, Card, CardContent, Stack } from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'
import PeopleIcon from '@mui/icons-material/People'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import PaymentsIcon from '@mui/icons-material/Payments'

const STATS = [
  { label: 'Établissements',      icon: SchoolIcon,     color: 'primary.main'   },
  { label: 'Élèves inscrits',     icon: PeopleIcon,     color: 'secondary.main' },
  { label: "Passages aujourd'hui", icon: RestaurantIcon, color: 'warning.main'   },
  { label: 'Paiements du mois',   icon: PaymentsIcon,   color: 'success.main'   },
]

export default function DashboardPage() {
  return (
    <Box>
      <Typography variant="h5" mb={3}>Tableau de bord</Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {STATS.map(({ label, icon: Icon, color }) => (
          <Card key={label} sx={{ flex: '1 1 200px', minWidth: 180 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Icon sx={{ fontSize: 40, color }} />
                <Box>
                  <Typography variant="h4" fontWeight={700}>—</Typography>
                  <Typography variant="body2" color="text.secondary">{label}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box mt={4}>
        <Typography variant="body1" color="text.secondary">
          Bienvenue dans Cantine Connect — système de gestion multi-établissements.
        </Typography>
      </Box>
    </Box>
  )
}
