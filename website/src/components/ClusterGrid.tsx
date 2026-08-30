import { useEffect, useMemo, useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useAppStore } from '../lib/store';
import { getTopicsForCluster, getClustersBySubject } from '../lib/data';
import { ClusterCard as MuiClusterCard } from './MuiCards';

export function ClusterGrid() {
    const { clusters, topics, selectedSubject, selectedCluster, selectCluster, selectSubject, sidebarOpen } = useAppStore();
    const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    const displayClusters = useMemo(() => {
        if (!selectedSubject) {
            return clusters;
        }
        return getClustersBySubject(clusters, selectedSubject);
    }, [clusters, selectedSubject]);

    useEffect(() => {
        if (!selectedCluster) {
            return;
        }

        const selectedKey = `${selectedCluster.subject}-${selectedCluster.domain}-${selectedCluster.ageRangeStart}`;
        const selectedCard = cardRefs.current.get(selectedKey);

        if (selectedCard) {
            selectedCard.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        }
    }, [selectedCluster, displayClusters]);

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
            <Box sx={{
                p: 2,
                display: 'grid',
                gridTemplateColumns: sidebarOpen
                    ? 'repeat(2, 1fr)'
                    : 'repeat(4, 1fr)',
                gap: 3
            }}>
                {displayClusters.map((cluster, idx) => {
                    const topicsInCluster = getTopicsForCluster(topics, cluster);
                    const isSelected =
                        selectedCluster?.subject === cluster.subject &&
                        selectedCluster?.domain === cluster.domain &&
                        selectedCluster?.ageRangeStart === cluster.ageRangeStart;
                    const clusterKey = `${cluster.subject}-${cluster.domain}-${cluster.ageRangeStart}`;

                    return (
                        <Box
                            key={`${clusterKey}-${idx}`}
                            ref={(node: HTMLDivElement | null) => {
                                if (node) {
                                    cardRefs.current.set(clusterKey, node);
                                } else {
                                    cardRefs.current.delete(clusterKey);
                                }
                            }}
                        >
                            <MuiClusterCard
                                cluster={cluster}
                                topicCount={topicsInCluster.length}
                                isSelected={isSelected}
                                onClick={() => selectCluster(cluster)}
                            />
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}
