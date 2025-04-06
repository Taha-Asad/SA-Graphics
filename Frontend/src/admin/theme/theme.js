import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2A4365', // Deep blue
      light: '#4A69BB',
      dark: '#1A365D',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#38A169', // Soft green
      light: '#48BB78',
      dark: '#2F855A',
      contrastText: '#ffffff',
    },
    error: {
      main: '#E53E3E',
      light: '#FC8181',
      dark: '#C53030',
    },
    warning: {
      main: '#DD6B20',
      light: '#ED8936',
      dark: '#C05621',
    },
    success: {
      main: '#38A169',
      light: '#48BB78',
      dark: '#2F855A',
    },
    background: {
      default: '#F7FAFC', // Very light blue-gray
      paper: '#ffffff',
    },
    text: {
      primary: '#2D3748', // Dark gray-blue
      secondary: '#4A5568', // Medium gray-blue
    },
    divider: '#E2E8F0',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      color: '#2D3748',
    },
    h2: {
      fontWeight: 600,
      color: '#2D3748',
    },
    h3: {
      fontWeight: 600,
      color: '#2D3748',
    },
    h4: {
      fontWeight: 600,
      color: '#2D3748',
    },
    h5: {
      fontWeight: 600,
      color: '#2D3748',
    },
    h6: {
      fontWeight: 600,
      color: '#2D3748',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #E2E8F0',
          padding: '16px',
        },
        head: {
          backgroundColor: '#F7FAFC',
          fontWeight: 600,
          color: '#2D3748',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#F7FAFC',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
  },
}); 