import { createTheme } from '@mui/material/styles'

const baseTypography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h5: { fontWeight: 700 },
  h6: { fontWeight: 700 },
  subtitle1: { fontWeight: 600 },
  button: { fontWeight: 600 },
}

// ─────────────────────────────────────────────────────────────────────────────
// 🏢  CORPORATIF — sobre, dense, focus données
// ─────────────────────────────────────────────────────────────────────────────
const corporate = createTheme({
  palette: {
    primary:    { main: '#1565C0', light: '#1E88E5', dark: '#0D47A1' },
    secondary:  { main: '#E65100', light: '#FF8A50', dark: '#BF360C' },
    background: { default: '#F4F6FA', paper: '#FFFFFF' },
  },
  typography: baseTypography,
  shape: { borderRadius: 6 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          border: '1px solid #DDE3EE',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          backgroundColor: '#EEF2F8',
          color: '#0D47A1',
          borderBottom: '2px solid #1565C0',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0D47A1',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#E8EEF9',
            borderLeft: '3px solid #1565C0',
            '& .MuiListItemIcon-root': { color: '#1565C0' },
            '& .MuiListItemText-primary': { fontWeight: 700, color: '#1565C0' },
          },
          '&.Mui-selected:hover': { backgroundColor: '#DCE5F5' },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: { paper: { borderRight: '1px solid #DDE3EE' } },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600 } },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: '#1565C0', height: 3 },
      },
    },
  },
})

// ─────────────────────────────────────────────────────────────────────────────
// ✨  MODERNE — aéré, Material Design prononcé, bleu+orange KLEM
// ─────────────────────────────────────────────────────────────────────────────
const modern = createTheme({
  palette: {
    primary:    { main: '#1565C0', light: '#42A5F5', dark: '#0D47A1' },
    secondary:  { main: '#FF6D00', light: '#FF9E40', dark: '#E65100' },
    background: { default: '#EEF2F7', paper: '#FFFFFF' },
  },
  typography: {
    ...baseTypography,
    h5: { fontWeight: 700, letterSpacing: '-0.02em' },
    h6: { fontWeight: 700, letterSpacing: '-0.01em' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
        containedPrimary: {
          background: 'linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)',
          boxShadow: '0 4px 12px rgba(21,101,192,0.35)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
            boxShadow: '0 6px 18px rgba(21,101,192,0.45)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #FF9E40 0%, #FF6D00 100%)',
          boxShadow: '0 4px 12px rgba(255,109,0,0.35)',
          '&:hover': {
            background: 'linear-gradient(135deg, #FF6D00 0%, #E65100 100%)',
          },
        },
        outlinedPrimary: {
          borderColor: '#1565C0',
          '&:hover': { backgroundColor: 'rgba(21,101,192,0.06)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: 'none',
          borderRadius: 16,
          transition: 'box-shadow 0.25s ease',
          '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.13)' },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          backgroundColor: '#1565C0',
          color: '#FFFFFF',
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          color: 'rgba(255,255,255,0.85)',
          '&:hover': { color: '#FFFFFF' },
          '&.Mui-active': { color: '#FFFFFF' },
        },
        icon: { color: 'rgba(255,255,255,0.7) !important' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
          boxShadow: '0 4px 20px rgba(13,71,161,0.30)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          width: 'calc(100% - 16px)',
          '&.Mui-selected': {
            background: 'rgba(21,101,192,0.10)',
            '& .MuiListItemIcon-root': { color: '#1565C0' },
            '& .MuiListItemText-primary': { fontWeight: 700, color: '#1565C0' },
          },
          '&.Mui-selected:hover': { background: 'rgba(21,101,192,0.15)' },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: '2px 0 20px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600, borderRadius: 8 } },
    },
    MuiPaper: {
      styleOverrides: { rounded: { borderRadius: 12 } },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          background: 'linear-gradient(90deg, #1E88E5, #FF6D00)',
          height: 3,
          borderRadius: 2,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          '&.Mui-selected': { color: '#1565C0' },
        },
      },
    },
  },
})

// ─────────────────────────────────────────────────────────────────────────────
// 🇨🇮  ÉCOLE IVOIRIENNE — orange, vert, blanc, chaleureux et lumineux
// ─────────────────────────────────────────────────────────────────────────────
const ivoirien = createTheme({
  palette: {
    primary:    { main: '#E65100', light: '#FF8A50', dark: '#BF360C' },
    secondary:  { main: '#2E7D32', light: '#60AD5E', dark: '#1B5E20' },
    background: { default: '#FFFDF7', paper: '#FFFFFF' },
    success:    { main: '#2E7D32' },
    warning:    { main: '#F57C00' },
  },
  typography: baseTypography,
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
        containedPrimary: {
          background: 'linear-gradient(135deg, #FF7043 0%, #E65100 100%)',
          boxShadow: '0 4px 12px rgba(230,81,0,0.30)',
          '&:hover': {
            background: 'linear-gradient(135deg, #E65100 0%, #BF360C 100%)',
            boxShadow: '0 6px 18px rgba(230,81,0,0.40)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #66BB6A 0%, #2E7D32 100%)',
          boxShadow: '0 4px 12px rgba(46,125,50,0.30)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(230,81,0,0.10)',
          border: '1px solid #FFE8D6',
          borderRadius: 12,
          transition: 'box-shadow 0.2s ease',
          '&:hover': { boxShadow: '0 6px 20px rgba(230,81,0,0.15)' },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          backgroundColor: '#FFF3E0',
          color: '#BF360C',
          borderBottom: '2px solid #E65100',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #FF7043 0%, #E65100 100%)',
          boxShadow: '0 4px 16px rgba(230,81,0,0.25)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#FFF3E0',
            borderLeft: '3px solid #E65100',
            '& .MuiListItemIcon-root': { color: '#E65100' },
            '& .MuiListItemText-primary': { fontWeight: 700, color: '#E65100' },
          },
          '&.Mui-selected:hover': { backgroundColor: '#FFE8D6' },
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600 } },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: '#E65100', height: 3 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          '&.Mui-selected': { color: '#E65100' },
        },
      },
    },
  },
})

export const THEMES = { corporate, modern, ivoirien }

export const THEME_META = {
  corporate: {
    label: 'Corporatif',
    description: 'Sobre, dense, focus sur les données',
    colors: ['#0D47A1', '#E65100', '#F4F6FA'],
    emoji: '🏢',
  },
  modern: {
    label: 'Moderne',
    description: 'Aéré, Material Design prononcé',
    colors: ['#1565C0', '#FF6D00', '#EEF2F7'],
    emoji: '✨',
  },
  ivoirien: {
    label: 'École Ivoirienne',
    description: 'Orange • Blanc • Vert',
    colors: ['#E65100', '#2E7D32', '#FFFDF7'],
    emoji: '🇨🇮',
  },
}
