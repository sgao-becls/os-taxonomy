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
        const previousState = get();
        const previousLanguage = previousState.language;
        if (previousLanguage === language) {
            return;
        }

        const previousTopics = previousState.topics;
        const previousSelectedSubject = previousState.selectedSubject;
        const previousSelectedCluster = previousState.selectedCluster;
        const previousSelectedTopic = previousState.selectedTopic;
        const previousSearchQuery = previousState.searchQuery;
        const previousSidebarOpen = previousState.sidebarOpen;

        const findSampleTopicBySubject = (subject: string | null) => {
            if (!subject) return null;
            return previousTopics.find(t => t.subject === subject) || null;
        };

        const findSampleTopicByCluster = (cluster: Cluster | null) => {
            if (!cluster) return null;
            return previousTopics.find(
                t =>
                    t.subject === cluster.subject &&
                    t.domain === cluster.domain &&
                    t.ageRangeStart === cluster.ageRangeStart
            ) || null;
        };

        try {
            await get().loadData(language);

            const currentState = get();
            const mappedSelectedTopic = previousSelectedTopic
                ? currentState.topicsById.get(previousSelectedTopic.id) || null
                : null;

            const mappedSubjectFromTopic = mappedSelectedTopic?.subject || null;
            const mappedSubjectFromSubjectSample = (() => {
                const sample = findSampleTopicBySubject(previousSelectedSubject);
                if (!sample) return null;
                return currentState.topicsById.get(sample.id)?.subject || null;
            })();

            const mappedSubject = mappedSubjectFromTopic || mappedSubjectFromSubjectSample;

            const mappedCluster = (() => {
                if (!previousSelectedCluster) {
                    return null;
                }

                const sample = findSampleTopicByCluster(previousSelectedCluster);
                const mappedSample = sample ? currentState.topicsById.get(sample.id) : null;

                const targetSubject = mappedSample?.subject || mappedSubject || previousSelectedCluster.subject;
                const targetDomain = mappedSample?.domain || previousSelectedCluster.domain;
                const targetAge = mappedSample?.ageRangeStart || previousSelectedCluster.ageRangeStart;

                const matched = currentState.clusters.find(
                    c => c.subject === targetSubject && c.domain === targetDomain && c.ageRangeStart === targetAge
                );

                if (matched) {
                    return matched;
                }

                return {
                    subject: targetSubject,
                    domain: targetDomain,
                    ageRangeStart: targetAge,
                    summary: mappedSample?.description || previousSelectedCluster.summary,
                } as Cluster;
            })();

            const shouldKeepSearchView = previousSearchQuery.trim().length > 0;
            const restoredSearchResults = shouldKeepSearchView
                ? fuzzySearch(currentState.topics, previousSearchQuery)
                : [];

            set({
                selectedSubject: mappedSubject,
                selectedCluster: mappedSelectedTopic ? mappedCluster : mappedCluster,
                selectedTopic: mappedSelectedTopic,
                searchQuery: previousSearchQuery,
                searchResults: restoredSearchResults,
                sidebarOpen: previousSidebarOpen && (!!mappedSelectedTopic || !!mappedCluster),
            });
        } catch {
            set({ language: previousLanguage });
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
