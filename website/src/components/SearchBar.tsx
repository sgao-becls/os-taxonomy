import { useAppStore } from '../lib/store';
import { Box, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

export function SearchBar() {
    const { searchQuery, setSearchQuery } = useAppStore();

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <TextField
                placeholder="Search topics..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                size="small"
                sx={{
                    width: '100%',
                    maxWidth: '500px',
                    '& .MuiOutlinedInput-root': {
                        color: 'white',
                        backgroundColor: 'rgba(30, 41, 59, 0.8)',
                        borderRadius: '8px',
                        border: '1px solid rgba(100, 116, 139, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: 'rgba(30, 41, 59, 1)',
                            borderColor: 'rgba(100, 116, 139, 0.6)',
                        },
                        '&.Mui-focused': {
                            backgroundColor: 'rgba(30, 41, 59, 1)',
                            borderColor: '#2563eb',
                            boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
                        },
                    },
                    '& .MuiOutlinedInput-input::placeholder': {
                        color: 'rgba(203, 213, 225, 0.7)',
                        opacity: 1,
                    },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: 'rgba(203, 213, 225, 0.8)', fontSize: 20 }} />
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
    );
}
