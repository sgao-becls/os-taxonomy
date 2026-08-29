import { useEffect } from 'react';
import { useAppStore } from '../lib/store';
import { SubjectSelector } from './SubjectSelector';
import { SearchBar } from './SearchBar';
import { ClusterGrid } from './ClusterGrid';
import { Sidebar } from './Sidebar';

export function App() {
    const { isLoading, error, loadData } = useAppStore();

    useEffect(() => {
        loadData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="mb-4">
                        <div className="inline-block animate-spin">
                            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
                        </div>
                    </div>
                    <p className="text-lg font-medium text-gray-900">Loading Marble Taxonomy...</p>
                    <p className="text-sm text-gray-600 mt-2">Preparing 1,590 topics and their relationships</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center bg-white p-8 rounded-lg shadow-lg">
                    <p className="text-lg font-medium text-red-900 mb-2">Error Loading Data</p>
                    <p className="text-gray-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="px-6 py-4">
                        <h1 className="text-2xl font-bold text-gray-900">Marble Skill Taxonomy</h1>
                        <p className="text-sm text-gray-600 mt-1">Explore 1,590 micro-topics across 8 subjects</p>
                    </div>
                </div>

                {/* Subject Selector */}
                <SubjectSelector />

                {/* Search Bar */}
                <SearchBar />

                {/* Main Grid */}
                <div className="flex-1 overflow-y-auto">
                    <ClusterGrid />
                </div>
            </div>

            {/* Sidebar */}
            <Sidebar />
        </div>
    );
}
