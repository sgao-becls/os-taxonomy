/**
 * MUI 卡片组件使用示例
 * 展示如何替换现有的卡片实现
 */

import React from 'react';
import { Grid, Container, Box, Typography } from '@mui/material';
import {
    ClusterCard,
    SubjectCard,
    SearchResultCard,
    SimpleCard,
} from './MuiCards';
import type { Cluster, Topic } from '../types';

// 示例：使用 ClusterCard
export function ClusterCardExample() {
    const exampleCluster: Cluster = {
        subject: 'Computing',
        domain: 'Artificial Intelligence',
        ageRangeStart: 5,
        summary: 'Your child is learning about artificial intelligence at age 5.',
    };

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
                Cluster Card 示例
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                    <ClusterCard
                        cluster={exampleCluster}
                        topicCount={6}
                        isSelected={false}
                        onClick={() => console.log('Cluster clicked')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <ClusterCard
                        cluster={exampleCluster}
                        topicCount={6}
                        isSelected={true}
                        onClick={() => console.log('Cluster clicked')}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

// 示例：使用 SubjectCard
export function SubjectCardExample() {
    const subjects = [
        { name: 'Computing', count: 21, emoji: '💻' },
        { name: 'Mathematics', count: 503, emoji: '🔢' },
        { name: 'Science', count: 547, emoji: '🔬' },
    ];

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
                Subject Card 示例
            </Typography>
            <Grid container spacing={2}>
                {subjects.map((subject) => (
                    <Grid item xs={12} sm={6} md={4} key={subject.name}>
                        <SubjectCard
                            subject={subject.name}
                            topicCount={subject.count}
                            emoji={subject.emoji}
                            onClick={() => console.log(`Selected: ${subject.name}`)}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

// 示例：使用 SearchResultCard
export function SearchResultCardExample() {
    const exampleTopic: Topic = {
        id: '1',
        name: 'AI in Daily Life',
        subject: 'Computing',
        domain: 'Artificial Intelligence',
        ageRangeStart: 5,
        ageRangeEnd: 7,
        description:
            'Spotting AI in daily life: face unlock on a phone, video recommendations, spelling auto-correct...',
        evidence: [
            'Identify at least five examples of AI in their daily life',
            'Explain that these technologies use patterns and data, not magic',
        ],
        prerequisites: [],
        dependents: [],
    };

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
                Search Result Card 示例
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <SearchResultCard
                        topic={exampleTopic}
                        onViewDetails={() => console.log('View details')}
                        onNavigateToCluster={() => console.log('Navigate to cluster')}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

// 示例：使用 SimpleCard
export function SimpleCardExample() {
    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
                Simple Card 示例
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <SimpleCard
                        title="Card with Title"
                        action={<button>Action</button>}
                    >
                        这是一个简单的卡片组件，可以用于任何通用场景。
                    </SimpleCard>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <SimpleCard
                        title="Clickable Card"
                        onClick={() => console.log('Card clicked')}
                        sx={{ cursor: 'pointer' }}
                    >
                        点击这个卡片试试。它会显示悬停效果。
                    </SimpleCard>
                </Grid>
            </Grid>
        </Box>
    );
}

// 完整示例：所有卡片类型
export function AllCardsDemo() {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h2" gutterBottom sx={{ mb: 4 }}>
                MUI 卡片组件完整示例
            </Typography>

            <ClusterCardExample />
            <SubjectCardExample />
            <SearchResultCardExample />
            <SimpleCardExample />
        </Container>
    );
}
