import type { Cluster } from '../types';
import { useAppStore } from '../lib/store';
import { getTopicsForCluster, getClustersBySubject } from '../lib/data';
import { getAgeLabel, getAgeRangeColor, getSubjectColor } from '../lib/colors';
import { Card, Badge } from './ui';

interface ClusterCardProps {
    cluster: Cluster;
    isSelected: boolean;
    onClick: () => void;
}

export function ClusterCard({ cluster, isSelected, onClick }: ClusterCardProps) {
    const { topics } = useAppStore();
    const topicsInCluster = getTopicsForCluster(topics, cluster);
    const ageColor = getAgeRangeColor(cluster.ageRangeStart);
    const subjectColor = getSubjectColor(cluster.subject);

    return (
        <Card
            onClick={onClick}
            className={`transition-all cursor-pointer ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
                } ${subjectColor.bg}`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant={isSelected ? 'primary' : 'gray'}>{cluster.subject}</Badge>
                        <Badge>{getAgeLabel(cluster.ageRangeStart, cluster.ageRangeStart + 1)}</Badge>
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${subjectColor.text}`}>{cluster.domain}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3">{cluster.summary}</p>
                </div>
                <div className={`text-center px-3 py-2 rounded-lg ${ageColor.bg} min-w-fit`}>
                    <div className={`text-2xl font-bold ${ageColor.text}`}>{topicsInCluster.length}</div>
                    <div className="text-xs text-gray-600">Topics</div>
                </div>
            </div>
        </Card>
    );
}

export function ClusterGrid() {
    const { clusters, selectedSubject, selectedCluster, selectCluster } = useAppStore();

    let displayClusters = clusters;
    if (selectedSubject) {
        displayClusters = getClustersBySubject(clusters, selectedSubject);
    }

    if (displayClusters.length === 0) {
        return (
            <div className="flex items-center justify-center h-96 text-gray-500">
                <div className="text-center">
                    <p className="text-lg font-medium mb-2">No subjects found</p>
                    <p className="text-sm">Select a subject to explore topics</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {displayClusters.map((cluster, idx) => (
                <ClusterCard
                    key={`${cluster.subject}-${cluster.domain}-${cluster.ageRangeStart}-${idx}`}
                    cluster={cluster}
                    isSelected={
                        selectedCluster?.subject === cluster.subject &&
                        selectedCluster?.domain === cluster.domain &&
                        selectedCluster?.ageRangeStart === cluster.ageRangeStart
                    }
                    onClick={() => selectCluster(cluster)}
                />
            ))}
        </div>
    );
}
