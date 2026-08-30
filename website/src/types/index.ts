export interface Topic {
    id: string;
    type: 'CONCEPTUAL' | 'PROCEDURAL' | 'REPRESENTATIONAL' | 'LANGUAGE' | 'META';
    subject: string;
    domain: string;
    name: string;
    description: string;
    ageRangeStart: number;
    ageRangeEnd: number;
    centrality: number;
    evidence: string[];
    assessmentPrompt: string;
    standards: string[];
}

export interface Dependency {
    topicId: string;
    prerequisiteId: string;
    strength: 'hard' | 'soft';
    reason: string;
}

export interface Cluster {
    subject: string;
    domain: string;
    ageRangeStart: number;
    summary: string;
}

export type AppLanguage = 'en' | 'zh';

export interface AppState {
    topics: Topic[];
    dependencies: Dependency[];
    clusters: Cluster[];
    selectedSubject: string | null;
    selectedCluster: Cluster | null;
    selectedTopic: Topic | null;
    searchQuery: string;
    isLoading: boolean;
    error: string | null;
}

export interface UIState {
    sidebarOpen: boolean;
    topicPrerequisites: Topic[];
    topicDependents: Topic[];
}
