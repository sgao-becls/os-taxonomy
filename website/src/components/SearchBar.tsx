import { useAppStore } from '../lib/store';
import { Input } from './ui';

export function SearchBar() {
    const { searchQuery, setSearchQuery } = useAppStore();

    return (
        <div className="px-4 py-3 border-b border-gray-200 bg-white">
            <Input
                type="text"
                placeholder="Search topics, domains, descriptions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                }
            />
        </div>
    );
}
