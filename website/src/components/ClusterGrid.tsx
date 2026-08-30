import type { Cluster } from '../types';
import { Grid, Box, Typography } from '@mui/material';
import { useAppStore } from '../lib/store';
import { getTopicsForCluster, getClustersBySubject } from '../lib/data';
import { ClusterCard as MuiClusterCard } from './MuiCards';

export function ClusterGrid() {
    const { clusters, topics, selectedSubject, selectedCluster, selectCluster } = useAppStore();

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
        <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
                {displayClusters.map((cluster, idx) => {
                    const topicsInCluster = getTopicsForCluster(topics, cluster);
                    const isSelected =
                        selectedCluster?.subject === cluster.subject &&
                        selectedCluster?.domain === cluster.domain &&
                        selectedCluster?.ageRangeStart === cluster.ageRangeStart;

                    return (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={`${cluster.subject}-${cluster.domain}-${cluster.ageRangeStart}-${idx}`}
                        >
                            <MuiClusterCard
                                cluster={cluster}
                                topicCount={topicsInCluster.length}
                                isSelected={isSelected}
                                onClick={() => selectCluster(cluster)}
                            />
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
}
