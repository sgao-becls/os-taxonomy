/**
 * Material-UI 优化卡片组件
 * 替换自定义卡片实现
 */

import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardActions,
    Box,
    Typography,
    Chip,
    Grid,
    Button,
} from '@mui/material';
import {
    ArrowForward as ArrowForwardIcon,
    Info as InfoIcon,
} from '@mui/icons-material';
import type { Cluster, Topic } from '../types';

// ============= Cluster Card =============
interface ClusterCardProps {
    cluster: Cluster;
    topicCount: number;
    isSelected?: boolean;
    onClick?: () => void;
    subjectColor?: { bg: string; text: string; gradient: string };
    ageColor?: { bg: string; text: string };
}

export function ClusterCard({
    cluster,
    topicCount,
    isSelected = false,
    onClick,
    subjectColor,
    ageColor,
}: ClusterCardProps) {
    return (
        <Card
            onClick={onClick}
            sx={{
                width: '100%',
                maxWidth: '100%',
                height: '280px',
                cursor: onClick ? 'pointer' : 'default',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                transition: 'all 0.3s ease',
                border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                boxShadow: isSelected ? '0 10px 15px -3px rgba(37, 99, 235, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                '&:hover': onClick
                    ? {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                        borderColor: '#2563eb',
                    }
                    : undefined,
            }}
        >
            <CardContent sx={{ flexGrow: 1, width: '100%', overflow: 'hidden', boxSizing: 'border-box', p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, width: '100%', minWidth: 0 }}>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', minWidth: 0, flex: 1 }}>
                        <Chip
                            label={cluster.subject}
                            color={isSelected ? 'primary' : 'default'}
                            size="small"
                            variant={isSelected ? 'filled' : 'outlined'}
                            sx={{ maxWidth: '60%' }}
                        />
                        <Chip label={cluster.ageRangeStart} size="small" variant="outlined" />
                    </Box>
                    <Box
                        sx={{
                            textAlign: 'center',
                            bgcolor: 'primary.light',
                            color: 'white',
                            borderRadius: 1,
                            px: 2,
                            py: 1,
                            minWidth: 'fit-content',
                            flexShrink: 0,
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                            {topicCount}
                        </Typography>
                        <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>Topics</Typography>
                    </Box>
                </Box>

                <Typography
                    variant="h6"
                    sx={{
                        mb: 1,
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        wordBreak: 'break-word',
                    }}
                >
                    {cluster.domain}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.secondary',
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3,
                        wordBreak: 'break-word',
                    }}
                >
                    {cluster.summary}
                </Typography>
            </CardContent>

            {onClick && (
                <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                    <Button
                        size="small"
                        endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                        sx={{
                            textTransform: 'none',
                            color: 'primary.main',
                            '&:hover': {
                                bgcolor: 'primary.light',
                                color: 'white',
                            },
                        }}
                    >
                        View Details
                    </Button>
                </CardActions>
            )}
        </Card>
    );
}

// ============= Subject Card =============
interface SubjectCardProps {
    subject: string;
    topicCount: number;
    emoji: string;
    gradient?: string;
    onClick?: () => void;
}

export function SubjectCard({
    subject,
    topicCount,
    emoji,
    gradient,
    onClick,
}: SubjectCardProps) {
    return (
        <Card
            onClick={onClick}
            sx={{
                width: '100%',
                maxWidth: '100%',
                height: '360px',
                cursor: onClick ? 'pointer' : 'default',
                minHeight: '360px',
                maxHeight: '360px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(226, 232, 240, 0.2)',
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                '&:hover': onClick
                    ? {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: '0 25px 50px -12px rgba(37, 99, 235, 0.3)',
                        borderColor: '#2563eb',
                        '& .MuiTypography-root': {
                            color: '#60a5fa',
                        },
                    }
                    : undefined,
            }}
        >
            {/* Gradient top accent */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: gradient || 'linear-gradient(90deg, #2563eb, #06b6d4)',
                }}
            />

            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', overflow: 'hidden', boxSizing: 'border-box', p: 2, pl: '16px', pr: '16px' }}>
                {/* Icon and Title */}
                <Box sx={{ width: '100%', minWidth: 0 }}>
                    <Box sx={{ fontSize: '3.5rem', mb: 2, transition: 'transform 0.3s' }}>
                        {emoji}
                    </Box>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                            color: 'white',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            width: '100%',
                            wordBreak: 'break-word',
                        }}
                    >
                        {subject}
                    </Typography>
                </Box>

                {/* Topic Count */}
                <Box sx={{ width: '100%', minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                background: gradient || 'linear-gradient(90deg, #2563eb, #06b6d4)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {topicCount}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#cbd5e1', whiteSpace: 'nowrap' }}>
                            {topicCount === 1 ? 'Topic' : 'Topics'}
                        </Typography>
                    </Box>

                    {/* Explore hint */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            fontSize: '0.875rem',
                            color: '#94a3b8',
                            transition: 'all 0.3s',
                        }}
                    >
                        <span>Explore</span>
                        <ArrowForwardIcon sx={{ fontSize: 14, transform: 'translateX(0)', transition: 'transform 0.3s' }} />
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

// ============= Search Result Card =============
interface SearchResultCardProps {
    topic: Topic;
    onViewDetails?: () => void;
    onNavigateToCluster?: () => void;
}

export function SearchResultCard({
    topic,
    onViewDetails,
    onNavigateToCluster,
}: SearchResultCardProps) {
    return (
        <Card
            sx={{
                width: '100%',
                maxWidth: '100%',
                height: '320px',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                    transform: 'translateY(-2px)',
                },
            }}
        >
            <CardContent sx={{ flexGrow: 1, width: '100%', overflow: 'hidden', boxSizing: 'border-box', p: 2, pl: '16px', pr: '16px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, width: '100%', minWidth: 0 }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                mb: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                wordBreak: 'break-word',
                            }}
                        >
                            {topic.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap', minWidth: 0 }}>
                            <Chip
                                label={topic.subject}
                                size="small"
                                variant="outlined"
                                color="primary"
                                sx={{ maxWidth: '45%' }}
                            />
                            <Chip
                                label={topic.domain}
                                size="small"
                                variant="outlined"
                                sx={{ maxWidth: '45%' }}
                            />
                        </Box>
                    </Box>
                </Box>

                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.secondary',
                        mb: 2,
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                        wordBreak: 'break-word',
                    }}
                >
                    {topic.description}
                </Typography>

                {topic.evidence && topic.evidence.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                            <InfoIcon sx={{ fontSize: 16, color: 'info.main' }} />
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                Evidence of Mastery
                            </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {topic.evidence[0]}
                        </Typography>
                    </Box>
                )}
            </CardContent>

            <CardActions sx={{ justifyContent: 'flex-end', gap: 1, mt: 'auto' }}>
                {onViewDetails && (
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={onViewDetails}
                    >
                        View
                    </Button>
                )}
                {onNavigateToCluster && (
                    <Button
                        size="small"
                        variant="contained"
                        onClick={onNavigateToCluster}
                    >
                        Go to Cluster
                    </Button>
                )}
            </CardActions>
        </Card>
    );
}

// ============= Simple Card =============
interface SimpleCardProps {
    title?: string;
    children: React.ReactNode;
    onClick?: () => void;
    action?: React.ReactNode;
    elevation?: number;
    sx?: any;
}

export function SimpleCard({
    title,
    children,
    onClick,
    action,
    elevation = 1,
    sx = {},
}: SimpleCardProps) {
    return (
        <Card
            elevation={elevation}
            onClick={onClick}
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                '&:hover': onClick
                    ? {
                        elevation: 8,
                        transform: 'translateY(-4px)',
                    }
                    : undefined,
                ...sx,
            }}
        >
            {title && <CardHeader title={title} />}
            <CardContent sx={{ flexGrow: 1, width: '100%', overflow: 'hidden', boxSizing: 'border-box', p: 2, pl: '16px', pr: '16px' }}>{children}</CardContent>
            {action && <CardActions sx={{ mt: 'auto', width: '100%', boxSizing: 'border-box' }}>{action}</CardActions>}
        </Card>
    );
}
