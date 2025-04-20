// -------------------------------------------------------------------------
// 1. Theme Configuration (src/theme.ts)
// -------------------------------------------------------------------------
import { createTheme } from '@mui/material/styles';

// Deloitte Inspired Theme
export const theme = createTheme({
  palette: {
    primary: {
      main: '#86BC25', // Deloitte Green
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#000000', // Deloitte Black
      contrastText: '#ffffff',
    },
    background: {
      default: '#f4f4f4', // Light grey background
      paper: '#ffffff',
    },
    text: {
        primary: '#000000', // Black text
        secondary: '#808080', // Grey text
    }
  },
  typography: {
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", // Deloitte-style font stack
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: {
        textTransform: 'none', // Buttons typically don't use ALL CAPS
        fontWeight: 600,
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#000000', // Black AppBar
        },
      },
    },
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: '4px', // Slightly rounded corners
            },
            containedPrimary: {
                '&:hover': {
                    backgroundColor: '#6a9a1e', // Darker green on hover
                },
            },
        },
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                borderRadius: '8px', // Consistent rounded corners for paper elements
                boxShadow: '0px 1px 3px rgba(0,0,0,0.1)', // Subtle shadow
            }
        }
    },
    MuiTableCell: {
        styleOverrides: {
            head: {
                fontWeight: 700, // Bold table headers
                backgroundColor: '#eeeeee' // Light grey header background
            }
        }
    }
  },
});