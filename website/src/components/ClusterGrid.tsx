import type { Cluster } from '../types';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useAppStore } from '../lib/store';
import { getTopicsForCluster, getClustersBySubject } from '../lib/data';
import { ClusterCard as MuiClusterCard } from './MuiCards';

export function ClusterGrid() {
    const { clusters, topics, selectedSubject, selectedCluster, selectCluster, selectSubject } = useAppStore();

    let displayClusters = clusters;
    if (selectedSubject) {
        displayClusters = getClustersBySubject(clusters, selectedSubject);
    }

    if (displayClusters.length === 0) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '24rem' }}>
                <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                        No subjects found
                    </Typography>
                    <Typography variant="body2">
                        Select a subject to explore topics
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box>
            {/* Navigation/Breadcrumb */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    px: 2,
                    py: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                }}
            >
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => {
                        selectSubject(null);
                        selectCluster(null);
                    }}
                    size="small"
                    sx={{
                        textTransform: 'none',
                        color: 'primary.main',
                        '&:hover': {
                            bgcolor: 'action.hover',
                        }
                    }}
                >
                    Back to Subjects
                </Button>

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    /
                </Typography>

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        color: 'white'
                    }}
                >
                    {selectedSubject}
                </Typography>
            </Box>

            {/* Clusters Grid */}
            <Box sx={{ p: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                {displayClusters.map((cluster, idx) => {
                    const topicsInCluster = getTopicsForCluster(topics, cluster);
                    const isSelected =
                        selectedCluster?.subject === cluster.subject &&
                        selectedCluster?.domain === cluster.domain &&
                        selectedCluster?.ageRangeStart === cluster.ageRangeStart;

                    return (
                        <MuiClusterCard
                            key={`${cluster.subject}-${cluster.domain}-${cluster.ageRangeStart}-${idx}`}
                            cluster={cluster}
                            topicCount={topicsInCluster.length}
                            isSelected={isSelected}
                            onClick={() => selectCluster(cluster)}
                        />
                    );
                })}
            </Box>
        </Box>
    );
}
