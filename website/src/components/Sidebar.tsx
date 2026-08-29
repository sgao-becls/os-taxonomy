import { useState, useMemo } from 'react';
import type { Topic } from '../types';
import { useAppStore } from '../lib/store';
import { getTopicsForCluster } from '../lib/data';
import { getAgeLabel } from '../lib/colors';
import { Button, Badge } from './ui';

interface DependencyListProps {
    dependencies: { strength: 'hard' | 'soft'; topic: Topic }[];
    title: string;
}

function DependencyList({ dependencies, title }: DependencyListProps) {
    const [expanded, setExpanded] = useState(false);
    const hardDeps = dependencies.filter(d => d.strength === 'hard');
    const softDeps = dependencies.filter(d => d.strength === 'soft');

    if (dependencies.length === 0) {
        return null;
    }

    return (
        <div className="border rounded-lg p-3 bg-gray-50">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full text-left font-medium text-gray-900 hover:text-gray-700 flex items-center justify-between"
            >
                <span>{title} ({dependencies.length})</span>
                <span className="text-lg">{expanded ? '−' : '+'}</span>
            </button>

            {expanded && (
                <div className="mt-3 space-y-2 max-h-96 overflow-y-auto">
                    {hardDeps.length > 0 && (
                        <div>
                            <div className="text-xs font-semibold text-red-700 mb-2">Required (Hard Dependencies)</div>
                            {hardDeps.map(dep => (
                                <div key={dep.topic.id} className="text-sm p-2 bg-white rounded border border-red-100 mb-1 hover:bg-red-50">
                                    <div className="font-medium text-gray-900">{dep.topic.name}</div>
                                    <div className="text-xs text-gray-600 mt-1">{getAgeLabel(dep.topic.ageRangeStart, dep.topic.ageRangeEnd)}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {softDeps.length > 0 && (
                        <div>
                            <div className="text-xs font-semibold text-orange-700 mb-2">Recommended (Soft Dependencies)</div>
                            {softDeps.map(dep => (
                                <div key={dep.topic.id} className="text-sm p-2 bg-white rounded border border-orange-100 mb-1 hover:bg-orange-50">
                                    <div className="font-medium text-gray-900">{dep.topic.name}</div>
                                    <div className="text-xs text-gray-600 mt-1">{getAgeLabel(dep.topic.ageRangeStart, dep.topic.ageRangeEnd)}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export function Sidebar() {
    const {
        selectedCluster,
        selectedTopic,
        topics,
        topicsById,
        prerequisiteMap,
        dependentMap,
        selectTopic,
        sidebarOpen,
        setSidebarOpen,
    } = useAppStore();

    const [showDeps, setShowDeps] = useState(false);

    const topicsInCluster = useMemo(() => {
        if (!selectedCluster) return [];
        return getTopicsForCluster(topics, selectedCluster);
    }, [selectedCluster, topics]);

    const prerequisites = useMemo(() => {
        if (!selectedTopic) return [];
        const deps = prerequisiteMap.get(selectedTopic.id) || [];
        return deps.map(d => ({
            strength: d.strength as 'hard' | 'soft',
            topic: topicsById.get(d.prerequisiteId)!,
        })).filter(d => d.topic);
    }, [selectedTopic, prerequisiteMap, topicsById]);

    const dependents = useMemo(() => {
        if (!selectedTopic) return [];
        const deps = dependentMap.get(selectedTopic.id) || [];
        return deps.map(d => ({
            strength: d.strength as 'hard' | 'soft',
            topic: topicsById.get(d.topicId)!,
        })).filter(d => d.topic);
    }, [selectedTopic, dependentMap, topicsById]);

    if (!sidebarOpen) {
        return null;
    }

    return (
        <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-lg overflow-y-auto z-20">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="font-bold text-lg text-gray-900">Details</h2>
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                >
                    ✕
                </button>
            </div>

            <div className="p-4 space-y-4">
                {selectedTopic ? (
                    // Topic Details
                    <>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge>{selectedTopic.subject}</Badge>
                                <Badge>{getAgeLabel(selectedTopic.ageRangeStart, selectedTopic.ageRangeEnd)}</Badge>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">{selectedTopic.name}</h3>
                            <p className="text-sm text-gray-600 mt-2">{selectedTopic.domain}</p>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                            <p className="text-sm text-gray-700">{selectedTopic.description}</p>
                        </div>

                        {selectedTopic.evidence.length > 0 && (
                            <div className="border-t pt-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Evidence of Mastery</h4>
                                <ul className="space-y-2">
                                    {selectedTopic.evidence.map((e, idx) => (
                                        <li key={idx} className="text-sm text-gray-700 flex gap-2">
                                            <span className="text-blue-600 font-bold">•</span>
                                            <span>{e}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {(prerequisites.length > 0 || dependents.length > 0) && (
                            <div className="border-t pt-4">
                                <button
                                    onClick={() => setShowDeps(!showDeps)}
                                    className="w-full text-left font-semibold text-gray-900 hover:text-gray-700 flex items-center justify-between mb-3"
                                >
                                    <span>Dependencies</span>
                                    <span className="text-lg">{showDeps ? '−' : '+'}</span>
                                </button>

                                {showDeps && (
                                    <div className="space-y-3">
                                        <DependencyList dependencies={prerequisites} title="Must Learn First" />
                                        <DependencyList dependencies={dependents} title="Unlocks Next" />
                                    </div>
                                )}
                            </div>
                        )}

                        <Button
                            onClick={() => selectTopic(null)}
                            variant="outline"
                            className="w-full"
                        >
                            Back to Cluster
                        </Button>
                    </>
                ) : selectedCluster ? (
                    // Cluster Details
                    <>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge>{selectedCluster.subject}</Badge>
                                <Badge>{getAgeLabel(selectedCluster.ageRangeStart, selectedCluster.ageRangeStart + 1)}</Badge>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">{selectedCluster.domain}</h3>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Overview</h4>
                            <p className="text-sm text-gray-700">{selectedCluster.summary}</p>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="font-semibold text-gray-900 mb-3">
                                Topics ({topicsInCluster.length})
                            </h4>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {topicsInCluster.map(topic => (
                                    <button
                                        key={topic.id}
                                        onClick={() => selectTopic(topic)}
                                        className="w-full text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                                    >
                                        <div className="font-medium text-gray-900 text-sm mb-1">{topic.name}</div>
                                        <div className="text-xs text-gray-600">{topic.domain}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
}
