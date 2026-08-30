import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#2563eb', // Blue
            light: '#60a5fa',
            dark: '#1d4ed8',
        },
        secondary: {
            main: '#06b6d4', // Cyan
            light: '#22d3ee',
            dark: '#0891b2',
        },
        background: {
            default: '#0f172a', // Dark blue
            paper: '#1e293b', // Slightly lighter
        },
        text: {
            primary: '#ffffff',
            secondary: '#cbd5e1',
        },
        error: {
            main: '#ef4444',
        },
        warning: {
            main: '#f59e0b',
        },
        success: {
            main: '#10b981',
        },
        info: {
            main: '#3b82f6',
        },
    },
    typography: {
        fontFamily: [
            'Inter',
            'system-ui',
            'sans-serif',
        ].join(','),
        h1: {
            fontSize: '2.25rem',
            fontWeight: 700,
        },
        h2: {
            fontSize: '1.875rem',
            fontWeight: 700,
        },
        h3: {
            fontSize: '1.5rem',
            fontWeight: 600,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                },
                html: {
                    backgroundColor: '#0f172a',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: '0.5rem',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1e293b',
                    borderRadius: '0.75rem',
                },
            },
        },
    },
});
