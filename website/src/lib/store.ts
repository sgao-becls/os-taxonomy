import { create } from 'zustand';
import type { Topic, Dependency, Cluster } from '../types';
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

    // UI State
    selectedSubject: string | null;
    selectedCluster: Cluster | null;
    selectedTopic: Topic | null;
    searchQuery: string;
    sidebarOpen: boolean;

    // Actions
    loadData: () => Promise<void>;
    selectSubject: (subject: string | null) => void;
    selectCluster: (cluster: Cluster | null) => void;
    selectTopic: (topic: Topic | null) => void;
    setSearchQuery: (query: string) => void;
    setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
    // Initial state
    topics: [],
    dependencies: [],
    clusters: [],
    topicsById: new Map(),
    prerequisiteMap: new Map(),
    dependentMap: new Map(),
    isLoading: false,
    error: null,

    selectedSubject: null,
    selectedCluster: null,
    selectedTopic: null,
    searchQuery: '',
    sidebarOpen: false,

    // Actions
    loadData: async () => {
        set({ isLoading: true, error: null });
        try {
            const [topics, dependencies, clusters] = await Promise.all([
                loadTopics(),
                loadDependencies(),
                loadClusters(),
            ]);

            const topicsById = buildTopicsByIdMap(topics);
            const prerequisiteMap = buildDependencyMap(dependencies);
            const dependentMap = buildReverseDependencyMap(dependencies);

            set({
                topics,
                dependencies,
                clusters,
                topicsById,
                prerequisiteMap,
                dependentMap,
                isLoading: false,
            });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to load data',
                isLoading: false,
            });
        }
    },

    selectSubject: (subject) => set({ selectedSubject: subject, selectedCluster: null, selectedTopic: null }),
    selectCluster: (cluster) => set({ selectedCluster: cluster, selectedTopic: null, sidebarOpen: !!cluster }),
    selectTopic: (topic) => set({ selectedTopic: topic, sidebarOpen: !!topic }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
