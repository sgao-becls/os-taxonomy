import { Container, Box, Typography } from '@mui/material';
import { useAppStore } from '../lib/store';
import { getSubjects } from '../lib/data';
import { SubjectCard as MuiSubjectCard } from './MuiCards';

// Mapping subjects to emojis
const subjectEmojis: Record<string, string> = {
    Mathematics: '🔢',
    Science: '🔬',
    English: '📖',
    History: '🏛️',
    Computing: '💻',
    'Life Skills': '🎯',
    'Learning to Learn': '🧠',
    'Personal & Social Development': '🤝',
};

// Mapping subjects to gradients (in CSS format for MUI)
const subjectGradients: Record<string, string> = {
    Computing: 'linear-gradient(90deg, #60a5fa, #2563eb)',
    English: 'linear-gradient(90deg, #10b981, #059669)',
    History: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
    'Learning to Learn': 'linear-gradient(90deg, #c084fc, #a855f7)',
    'Life Skills': 'linear-gradient(90deg, #f472b6, #ec4899)',
    Mathematics: 'linear-gradient(90deg, #f87171, #dc2626)',
    'Personal & Social Development': 'linear-gradient(90deg, #22d3ee, #0891b2)',
    Science: 'linear-gradient(90deg, #fb923c, #f97316)',
};

export function SubjectsGrid() {
    const { topics, selectSubject } = useAppStore();
    const subjects = getSubjects(topics);

    console.log('[SubjectsGrid] topics count:', topics.length, 'subjects count:', subjects.length);

    // Count topics by subject
    const topicsBySubject = new Map<string, number>();
    subjects.forEach(s => {
        topicsBySubject.set(s, topics.filter(t => t.subject === s).length);
    });

    // Debug: log data loading
    if (topics.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography color="textSecondary" variant="h6" sx={{ mb: 1 }}>
                        No topics loaded yet
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                        Topics loaded: {topics.length}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                        Subjects: {subjects.length}
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', py: 8 }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: 'white' }}>
                        Explore Learning by Subject
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                        Choose a subject to discover 1,590 micro-topics across 8 subjects ({topics.length} topics, {subjects.length} subjects)
                    </Typography>
                </Box>

                {/* 4-column responsive grid */}
                <Box
                    sx={{
                        width: '100%',
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',      // 1 column on mobile
                            sm: 'repeat(2, 1fr)',  // 2 columns on tablet
                            md: 'repeat(4, 1fr)',  // 4 columns on desktop
                        },
                        columnGap: 3,  // 只在列之间设置 gap
                        rowGap: 3,     // 行间距
                    }}
                >
                    {subjects.map(subject => (
                        <Box
                            key={subject}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <MuiSubjectCard
                                subject={subject}
                                topicCount={topicsBySubject.get(subject) || 0}
                                emoji={subjectEmojis[subject] || '📚'}
                                gradient={subjectGradients[subject] || 'linear-gradient(90deg, #60a5fa, #2563eb)'}
                                onClick={() => selectSubject(subject)}
                            />
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
