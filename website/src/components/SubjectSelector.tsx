import { Box, Button, ButtonGroup } from '@mui/material';
import { useAppStore } from '../lib/store';
import { getSubjects } from '../lib/data';

export function SubjectSelector() {
    const { topics, selectedSubject, selectSubject, selectCluster } = useAppStore();
    const subjects = getSubjects(topics);

    if (subjects.length === 0) {
        return null;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 1,
                overflowX: 'auto',
                pb: 1,
                px: 2,
                py: 1.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                sticky: 'top',
                zIndex: 10,
                '&::-webkit-scrollbar': {
                    height: '4px'
                },
                '&::-webkit-scrollbar-track': {
                    bgcolor: 'transparent'
                },
                '&::-webkit-scrollbar-thumb': {
                    bgcolor: 'divider',
                    borderRadius: '2px'
                }
            }}
        >
            <Button
                onClick={() => {
                    selectSubject(null);
                    selectCluster(null);
                }}
                variant={selectedSubject === null ? 'contained' : 'outlined'}
                size="small"
                sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
            >
                All Subjects
            </Button>

            {subjects.map(subject => (
                <Button
                    key={subject}
                    onClick={() => {
                        selectSubject(subject);
                        selectCluster(null);
                    }}
                    variant={selectedSubject === subject ? 'contained' : 'outlined'}
                    color={selectedSubject === subject ? 'primary' : 'inherit'}
                    size="small"
                    sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                    {subject}
                </Button>
            ))}
        </Box>
    );
}
