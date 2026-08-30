import { Grid, Box, Typography, Container } from '@mui/material';
import { useAppStore } from '../lib/store';
import { SearchResultCard as MuiSearchResultCard } from './MuiCards';

export function SearchResults() {
    const { searchResults, searchQuery, selectTopic, selectCluster } = useAppStore();

    if (searchResults.length === 0) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '24rem', textAlign: 'center' }}>
                <Box>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 500, color: 'text.primary' }}>
                        No results found
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Try searching for different keywords related to topics, subjects, or domains.
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
                    Search Results for "{searchQuery}"
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Found {searchResults.length} topic{searchResults.length !== 1 ? 's' : ''}
                </Typography>
            </Box>

            <Grid container spacing={2}>
                {searchResults.map(topic => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        key={topic.id}
                    >
                        <MuiSearchResultCard
                            topic={topic}
                            onViewDetails={() => selectTopic(topic)}
                            onNavigateToCluster={() => {
                                // Find and select the corresponding cluster
                                const cluster = {
                                    subject: topic.subject,
                                    domain: topic.domain,
                                    ageRangeStart: topic.ageRangeStart,
                                };
                                selectCluster(cluster as any);
                            }}
                        />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
