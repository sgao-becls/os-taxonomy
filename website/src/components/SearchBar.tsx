import { useAppStore } from '../lib/store';

export function SearchBar() {
    const { searchQuery, setSearchQuery } = useAppStore();

    return (
        <div className="flex items-center gap-2">
            <svg className="text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
                type="text"
                placeholder="Search topics, domains, descriptions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 bg-slate-800 text-white placeholder-gray-500 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
            />
        </div>
    );
}
