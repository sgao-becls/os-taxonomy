import { useEffect, useMemo, useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useAppStore } from '../lib/store';
import { getTopicsForCluster, getClustersBySubject } from '../lib/data';
import { ClusterCard as MuiClusterCard } from './MuiCards';
import type { Cluster, Topic } from '../types';

function buildFallbackClustersForSubject(topics: Topic[], subject: string): Cluster[] {
    const topicGroups = new Map<string, Topic[]>();

    topics
        .filter(t => t.subject === subject)
        .forEach(topic => {
            const key = `${topic.domain}::${topic.ageRangeStart}`;
            if (!topicGroups.has(key)) {
                topicGroups.set(key, []);
            }
            topicGroups.get(key)!.push(topic);
        });

    return Array.from(topicGroups.entries())
        .map(([key, group]) => {
            const [domain, ageRangeStartRaw] = key.split('::');
            const topTopic = [...group].sort((a, b) => b.centrality - a.centrality)[0];

            return {
                subject,
                domain,
                ageRangeStart: Number(ageRangeStartRaw),
                // Reuse the most central topic description as a readable fallback summary.
                summary: topTopic?.description || '',
            } as Cluster;
        })
        .sort((a, b) => {
            if (a.ageRangeStart !== b.ageRangeStart) {
                return a.ageRangeStart - b.ageRangeStart;
            }
            return a.domain.localeCompare(b.domain);
        });
}

export function ClusterGrid() {
    const { clusters, topics, selectedSubject, selectedCluster, selectCluster, selectSubject, sidebarOpen } = useAppStore();
    const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    const displayClusters = useMemo(() => {
        if (!selectedSubject) {
            return clusters;
        }

        const filtered = getClustersBySubject(clusters, selectedSubject);
        if (filtered.length > 0) {
            return filtered;
        }

        return buildFallbackClustersForSubject(topics, selectedSubject);
    }, [clusters, selectedSubject, topics]);

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
