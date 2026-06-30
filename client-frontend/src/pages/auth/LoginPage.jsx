import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Card, CardContent, Typography, TextField,
  Button, Stack, Alert, CircularProgress, InputAdornment, IconButton,
} from '@mui/material'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useAuth } from '../../hooks/useAuth'
import { authService } from '../../services/authService'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()

  const [form, setForm]           = useState({ email: '', motDePasse: '' })
  const [showPwd, setShowPwd]     = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.motDePasse) { setError('Remplissez tous les champs'); return }
    setLoading(true); setError(null)
    try {
      const authResponse = await authService.login(form.email, form.motDePasse)
      login(authResponse)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      bgcolor: 'background.default',
    }}>
      <Card sx={{ width: '100%', maxWidth: 420, mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Logo */}
          <Stack alignItems="center" spacing={1} mb={3}>
            <Box sx={{
              width: 56, height: 56, borderRadius: '50%',
              bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <RestaurantIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Typography variant="h5">Cantine Connect</Typography>
            <Typography variant="body2" color="text.secondary">
              Connectez-vous à votre espace
            </Typography>
          </Stack>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Adresse email" name="email" type="email"
                value={form.email} onChange={handleChange}
                fullWidth autoFocus autoComplete="email"
              />
              <TextField
                label="Mot de passe" name="motDePasse"
                type={showPwd ? 'text' : 'password'}
                value={form.motDePasse} onChange={handleChange}
                fullWidth autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPwd(!showPwd)} edge="end">
                        {showPwd ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit" variant="contained" size="large" fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Se connecter'}
              </Button>
            </Stack>
          </form>

          <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={3}>
            Compte par défaut : admin@cantine.connect / Admin123!
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
