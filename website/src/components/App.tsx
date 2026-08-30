import { useEffect, useRef } from 'react';
import { FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import { useAppStore } from '../lib/store';
import { SearchBar } from './SearchBar';
import { ClusterGrid } from './ClusterGrid';
import { SubjectsGrid } from './SubjectsGrid';
import { SearchResults } from './SearchResults';
import { Sidebar } from './Sidebar';
import type { AppLanguage } from '../types';

export function App() {
    const { isLoading, error, loadData, selectedSubject, searchQuery, searchResults, language, setLanguage } = useAppStore();
    const initRef = useRef(false);

    const handleLanguageChange = (event: SelectChangeEvent) => {
        void setLanguage(event.target.value as AppLanguage);
    };

    console.log('[App] rendering, isLoading:', isLoading, 'error:', error, 'selectedSubject:', selectedSubject);

    useEffect(() => {
        if (!initRef.current) {
            initRef.current = true;
            console.log('[App] useEffect called, calling loadData');
            loadData();
        }
    }, [loadData]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="mb-4">
                        <div className="inline-block animate-spin">
                            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full" />
                        </div>
                    </div>
                    <p className="text-xl font-bold text-gray-900">Loading Marble Taxonomy...</p>
                    <p className="text-sm text-gray-600 mt-2">Preparing 1,590 topics and their relationships</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center bg-white p-8 rounded-lg shadow-lg border border-red-200">
                    <p className="text-lg font-bold text-red-900 mb-2">Error Loading Data</p>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden">
            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-xl border-b border-slate-700">
                    <div className="px-8 py-6 flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">Marble Skill Taxonomy</h1>
                            <p className="text-cyan-100 mt-1">Explore 1,590 micro-topics across 8 subjects</p>
                        </div>
                        <FormControl
                            size="small"
                            sx={{
                                minWidth: 160,
                                '& .MuiInputLabel-root': { color: 'rgba(224, 242, 254, 0.95)' },
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    bgcolor: 'rgba(15, 23, 42, 0.28)',
                                    '& fieldset': { borderColor: 'rgba(165, 243, 252, 0.6)' },
                                    '&:hover fieldset': { borderColor: 'rgba(165, 243, 252, 0.9)' },
                                    '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                                },
                                '& .MuiSvgIcon-root': { color: 'white' },
                            }}
                        >
                            <InputLabel id="language-select-label">Language</InputLabel>
                            <Select
                                labelId="language-select-label"
                                value={language}
                                label="Language"
                                onChange={handleLanguageChange}
                            >
                                <MenuItem value="en">English</MenuItem>
                                <MenuItem value="zh">中文</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-slate-900 border-b border-slate-700 shadow-md">
                    <div className="px-8 py-4">
                        <SearchBar />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    {searchQuery && searchResults.length > 0 ? (
                        // Show search results
                        <SearchResults />
                    ) : searchQuery && searchResults.length === 0 ? (
                        // Show no results message
                        <SearchResults />
                    ) : selectedSubject ? (
                        // Show clusters for selected subject
                        <ClusterGrid />
                    ) : (
                        // Show subjects grid (home view)
                        <SubjectsGrid />
                    )}
                </div>
            </div>

            {/* Sidebar */}
            <Sidebar />
        </div>
    );
}
