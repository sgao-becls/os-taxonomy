import type { Topic, Dependency, Cluster, AppLanguage } from '../types';

const DATA_URL_BASE = '/data';

async function loadByLanguage<T>(language: AppLanguage, fileName: string): Promise<T> {
    const localizedUrl = `${DATA_URL_BASE}/${language}/${fileName}`;
    const fallbackUrl = `${DATA_URL_BASE}/${fileName}`;

    const localized = await fetch(localizedUrl);
    if (localized.ok) {
        return localized.json() as Promise<T>;
    }

    const fallback = await fetch(fallbackUrl);
    if (!fallback.ok) {
        throw new Error(`HTTP ${fallback.status}`);
    }

    return fallback.json() as Promise<T>;
}

export async function loadTopics(language: AppLanguage = 'en'): Promise<Topic[]> {
    try {
        const data = await loadByLanguage<{ topics: Topic[] }>(language, 'topics.json');
        return data.topics || [];
    } catch (error) {
        console.error('Failed to load topics:', error);
        throw error;
    }
}

export async function loadDependencies(language: AppLanguage = 'en'): Promise<Dependency[]> {
    try {
        const data = await loadByLanguage<{ dependencies: Dependency[] }>(language, 'dependencies.json');
        return data.dependencies || [];
    } catch (error) {
        console.error('Failed to load dependencies:', error);
        throw error;
    }
}

export async function loadClusters(language: AppLanguage = 'en'): Promise<Cluster[]> {
    try {
        const data = await loadByLanguage<{ clusters: Cluster[] }>(language, 'clusters.json');
        return data.clusters || [];
    } catch (error) {
        console.error('Failed to load clusters:', error);
        throw error;
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
