import { create } from 'zustand';
import type { Topic, Dependency, Cluster, AppLanguage } from '../types';
import {
    loadTopics,
    loadDependencies,
    loadClusters,
    buildTopicsByIdMap,
    buildDependencyMap,
    buildReverseDependencyMap,
} from './data';

interface AppStore {
    // Data
    topics: Topic[];
    dependencies: Dependency[];
    clusters: Cluster[];
    topicsById: Map<string, Topic>;
    prerequisiteMap: Map<string, Dependency[]>;
    dependentMap: Map<string, Dependency[]>;
    isLoading: boolean;
    error: string | null;
    language: AppLanguage;

    // UI State
    selectedSubject: string | null;
    selectedCluster: Cluster | null;
    selectedTopic: Topic | null;
    searchQuery: string;
    searchResults: Topic[];
    sidebarOpen: boolean;

    // Actions
    loadData: (language?: AppLanguage) => Promise<void>;
    setLanguage: (language: AppLanguage) => Promise<void>;
    selectSubject: (subject: string | null) => void;
    selectCluster: (cluster: Cluster | null) => void;
    selectTopic: (topic: Topic | null) => void;
    setSearchQuery: (query: string) => void;
    setSidebarOpen: (open: boolean) => void;
}

// Fuzzy search function - supports partial matching, case-insensitive
function fuzzySearch(topics: Topic[], query: string): Topic[] {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    return topics.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.domain.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q)
    );
}

export const useAppStore = create<AppStore>((set, get) => ({
    // Initial state
    topics: [],
    dependencies: [],
    clusters: [],
    topicsById: new Map(),
    prerequisiteMap: new Map(),
    dependentMap: new Map(),
    isLoading: false,
    error: null,
    language: 'en',

    selectedSubject: null,
    selectedCluster: null,
    selectedTopic: null,
    searchQuery: '',
    searchResults: [],
    sidebarOpen: false,

    // Actions
    loadData: async (languageOverride) => {
        console.log('[Store] loadData called');
        set({ isLoading: true, error: null });
        try {
            const language = languageOverride ?? get().language;
            console.log('[Store] fetching topics...');
            const [topics, dependencies, clusters] = await Promise.all([
                loadTopics(language),
                loadDependencies(language),
                loadClusters(language),
            ]);

            console.log('[Store] data loaded:', { topicsCount: topics.length, dependenciesCount: dependencies.length, clustersCount: clusters.length });

            const topicsById = buildTopicsByIdMap(topics);
            const prerequisiteMap = buildDependencyMap(dependencies);
            const dependentMap = buildReverseDependencyMap(dependencies);

            console.log('[Store] setting state with data');
            set({
                topics,
                dependencies,
                clusters,
                topicsById,
                prerequisiteMap,
                dependentMap,
                language,
                isLoading: false,
            });
            console.log('[Store] state set complete, isLoading should be false now');
        } catch (error) {
            console.error('[Store] error loading data:', error);
            set({
                error: error instanceof Error ? error.message : 'Failed to load data',
                isLoading: false,
            });
            throw error;
        }
    },

    setLanguage: async (language) => {
        const previous = get().language;
        if (previous === language) {
            return;
        }

        set({
            selectedSubject: null,
            selectedCluster: null,
            selectedTopic: null,
            searchQuery: '',
            searchResults: [],
            sidebarOpen: false,
            error: null,
        });

        try {
            await get().loadData(language);
        } catch {
            set({ language: previous });
        }
    },

    selectSubject: (subject) => set({
        selectedSubject: subject,
        selectedCluster: null,
        selectedTopic: null,
        searchQuery: '',
        searchResults: [],
    }),
    selectCluster: (cluster) => set({ selectedCluster: cluster, selectedTopic: null, sidebarOpen: !!cluster }),
    selectTopic: (topic) => set({ selectedTopic: topic, sidebarOpen: !!topic }),
    setSearchQuery: (query) => {
        const { topics } = get();
        const results = fuzzySearch(topics, query);
        set({
            searchQuery: query,
            searchResults: results,
            selectedSubject: null,
            selectedCluster: null,
            selectedTopic: null,
        });
    },
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
