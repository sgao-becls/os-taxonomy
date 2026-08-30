import { useState, useMemo } from 'react';
import type { Topic } from '../types';
import { Button, Chip, Box, Typography, Divider } from '@mui/material';
import { useAppStore } from '../lib/store';
import { getTopicsForCluster } from '../lib/data';
import { getAgeLabel } from '../lib/colors';

interface DependencyListProps {
    dependencies: { strength: 'hard' | 'soft'; topic: Topic }[];
    title: string;
}

function DependencyList({ dependencies, title }: DependencyListProps) {
    const [expanded, setExpanded] = useState(false);
    const hardDeps = dependencies.filter(d => d.strength === 'hard');
    const softDeps = dependencies.filter(d => d.strength === 'soft');

    if (dependencies.length === 0) {
        return null;
    }

    return (
        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2, bgcolor: 'action.hover' }}>
            <Button
                onClick={() => setExpanded(!expanded)}
                fullWidth
                sx={{
                    justifyContent: 'space-between',
                    textTransform: 'none',
                    textAlign: 'left',
                    fontSize: '1rem',
                    fontWeight: 500
                }}
            >
                <Typography sx={{ fontWeight: 500 }}>
                    {title} ({dependencies.length})
                </Typography>
                <Typography>{expanded ? '−' : '+'}</Typography>
            </Button>

            {expanded && (
                <Box sx={{ mt: 2, maxHeight: '24rem', overflowY: 'auto' }}>
                    {hardDeps.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: 'error.main', mb: 1 }}>
                                Required (Hard Dependencies)
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                                {hardDeps.map(dep => (
                                    <Box
                                        key={dep.topic.id}
                                        sx={{
                                            p: 1.5,
                                            bgcolor: 'background.paper',
                                            borderRadius: 0.5,
                                            border: '1px solid',
                                            borderColor: 'error.light',
                                            mb: 1,
                                            '&:hover': { bgcolor: 'error.lighter' }
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {dep.topic.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                            {getAgeLabel(dep.topic.ageRangeStart, dep.topic.ageRangeEnd)}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                    {softDeps.length > 0 && (
                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: 'warning.main', mb: 1 }}>
                                Recommended (Soft Dependencies)
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                                {softDeps.map(dep => (
                                    <Box
                                        key={dep.topic.id}
                                        sx={{
                                            p: 1.5,
                                            bgcolor: 'background.paper',
                                            borderRadius: 0.5,
                                            border: '1px solid',
                                            borderColor: 'warning.light',
                                            mb: 1,
                                            '&:hover': { bgcolor: 'warning.lighter' }
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {dep.topic.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                            {getAgeLabel(dep.topic.ageRangeStart, dep.topic.ageRangeEnd)}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
}

export function Sidebar() {
    const {
        selectedCluster,
        selectedTopic,
        topics,
        topicsById,
        prerequisiteMap,
        dependentMap,
        selectTopic,
        sidebarOpen,
        setSidebarOpen,
    } = useAppStore();

    const [showDeps, setShowDeps] = useState(false);

    const topicsInCluster = useMemo(() => {
        if (!selectedCluster) return [];
        return getTopicsForCluster(topics, selectedCluster);
    }, [selectedCluster, topics]);

    const prerequisites = useMemo(() => {
        if (!selectedTopic) return [];
        const deps = prerequisiteMap.get(selectedTopic.id) || [];
        return deps.map(d => ({
            strength: d.strength as 'hard' | 'soft',
            topic: topicsById.get(d.prerequisiteId)!,
        })).filter(d => d.topic);
    }, [selectedTopic, prerequisiteMap, topicsById]);

    const dependents = useMemo(() => {
        if (!selectedTopic) return [];
        const deps = dependentMap.get(selectedTopic.id) || [];
        return deps.map(d => ({
            strength: d.strength as 'hard' | 'soft',
            topic: topicsById.get(d.topicId)!,
        })).filter(d => d.topic);
    }, [selectedTopic, dependentMap, topicsById]);

    if (!sidebarOpen) {
        return null;
    }

    return (
        <Box
            sx={{
                width: '640px',
                minWidth: '640px',
                height: '100%',
                bgcolor: 'background.paper',
                borderLeft: '1px solid',
                borderColor: 'divider',
                boxShadow: 'lg',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Box
                sx={{
                    position: 'sticky',
                    top: 0,
                    bgcolor: 'background.paper',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexShrink: 0
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Details
                </Typography>
                <Button
                    onClick={() => setSidebarOpen(false)}
                    sx={{ p: 0.5, minWidth: 'auto' }}
                >
                    ✕
                </Button>
            </Box>

            <Box
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    overflowY: 'auto',
                    flex: 1
                }}
            >
                {selectedTopic ? (
                    // Topic Details
                    <>
                        <Box>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <Chip label={selectedTopic.subject} size="small" color="primary" variant="filled" />
                                <Chip label={getAgeLabel(selectedTopic.ageRangeStart, selectedTopic.ageRangeEnd)} size="small" />
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                                {selectedTopic.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {selectedTopic.domain}
                            </Typography>
                        </Box>

                        <Divider />

                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                Description
                            </Typography>
                            <Typography variant="body2">
                                {selectedTopic.description}
                            </Typography>
                        </Box>

                        {selectedTopic.evidence.length > 0 && (
                            <Box>
                                <Divider />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, mt: 2 }}>
                                    Evidence of Mastery
                                </Typography>
                                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                                    {selectedTopic.evidence.map((e, idx) => (
                                        <Typography
                                            component="li"
                                            key={idx}
                                            variant="body2"
                                            sx={{ mb: 1, listStyleType: 'disc', color: 'text.secondary' }}
                                        >
                                            {e}
                                        </Typography>
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {(prerequisites.length > 0 || dependents.length > 0) && (
                            <Box sx={{ pt: 2 }}>
                                <Divider />
                                <Button
                                    fullWidth
                                    onClick={() => setShowDeps(!showDeps)}
                                    sx={{ justifyContent: 'space-between', mt: 2, textTransform: 'none', fontSize: '1rem' }}
                                >
                                    <Typography sx={{ fontWeight: 600 }}>Dependencies</Typography>
                                    <Typography>{showDeps ? '−' : '+'}</Typography>
                                </Button>

                                {showDeps && (
                                    <Box sx={{ mt: 2, space: 2 }}>
                                        <DependencyList dependencies={prerequisites} title="Must Learn First" />
                                        <DependencyList dependencies={dependents} title="Unlocks Next" />
                                    </Box>
                                )}
                            </Box>
                        )}

                        <Button
                            onClick={() => selectTopic(null)}
                            variant="outlined"
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            Back to Cluster
                        </Button>
                    </>
                ) : selectedCluster ? (
                    // Cluster Details
                    <>
                        <Box>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <Chip label={selectedCluster.subject} size="small" color="primary" variant="filled" />
                                <Chip label={getAgeLabel(selectedCluster.ageRangeStart, selectedCluster.ageRangeStart + 1)} size="small" />
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                {selectedCluster.domain}
                            </Typography>
                        </Box>

                        <Divider />

                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                Overview
                            </Typography>
                            <Typography variant="body2">
                                {selectedCluster.summary}
                            </Typography>
                        </Box>

                        <Divider />

                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                Topics ({topicsInCluster.length})
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: '24rem', overflow: 'y', overflowY: 'auto' }}>
                                {topicsInCluster.map(topic => (
                                    <Button
                                        key={topic.id}
                                        onClick={() => selectTopic(topic)}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            textAlign: 'left',
                                            py: 1.5,
                                            px: 2,
                                            textTransform: 'none',
                                            color: 'text.primary',
                                            bgcolor: 'action.hover',
                                            '&:hover': { bgcolor: 'action.selected' }
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                                                {topic.name}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                {topic.domain}
                                            </Typography>
                                        </Box>
                                    </Button>
                                ))}
                            </Box>
                        </Box>
                    </>
                ) : null}
            </Box>
        </Box>
    );
}
