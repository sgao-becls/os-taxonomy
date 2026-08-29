import type { Topic, Dependency, Cluster } from '../types';

const DATA_URL_BASE = '../../data';

export async function loadTopics(): Promise<Topic[]> {
    try {
        const response = await fetch(`${DATA_URL_BASE}/topics.json`);
        const data = await response.json();
        return data.topics || [];
    } catch (error) {
        console.error('Failed to load topics:', error);
        return [];
    }
}

export async function loadDependencies(): Promise<Dependency[]> {
    try {
        const response = await fetch(`${DATA_URL_BASE}/dependencies.json`);
        const data = await response.json();
        return data.dependencies || [];
    } catch (error) {
        console.error('Failed to load dependencies:', error);
        return [];
    }
}

export async function loadClusters(): Promise<Cluster[]> {
    try {
        const response = await fetch(`${DATA_URL_BASE}/clusters.json`);
        const data = await response.json();
        return data.clusters || [];
    } catch (error) {
        console.error('Failed to load clusters:', error);
        return [];
    }
}

export function buildTopicsByIdMap(topics: Topic[]): Map<string, Topic> {
    return new Map(topics.map(t => [t.id, t]));
}

export function buildDependencyMap(dependencies: Dependency[]): Map<string, Dependency[]> {
    const map = new Map<string, Dependency[]>();
    dependencies.forEach(dep => {
        if (!map.has(dep.topicId)) {
            map.set(dep.topicId, []);
        }
        map.get(dep.topicId)!.push(dep);
    });
    return map;
}

export function buildReverseDependencyMap(dependencies: Dependency[]): Map<string, Dependency[]> {
    const map = new Map<string, Dependency[]>();
    dependencies.forEach(dep => {
        if (!map.has(dep.prerequisiteId)) {
            map.set(dep.prerequisiteId, []);
        }
        map.get(dep.prerequisiteId)!.push(dep);
    });
    return map;
}

export function getSubjects(topics: Topic[]): string[] {
    const subjects = new Set(topics.map(t => t.subject));
    return Array.from(subjects).sort();
}

export function getClustersBySubject(clusters: Cluster[], subject: string): Cluster[] {
    return clusters.filter(c => c.subject === subject).sort((a, b) => {
        if (a.ageRangeStart !== b.ageRangeStart) {
            return a.ageRangeStart - b.ageRangeStart;
        }
        return a.domain.localeCompare(b.domain);
    });
}

export function getTopicsForCluster(
    topics: Topic[],
    cluster: Cluster
): Topic[] {
    return topics.filter(
        t =>
            t.subject === cluster.subject &&
            t.domain === cluster.domain &&
            t.ageRangeStart === cluster.ageRangeStart
    );
}
