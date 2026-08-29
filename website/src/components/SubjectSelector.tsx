import { useAppStore } from '../lib/store';
import { getSubjects } from '../lib/data';
import { getSubjectColor } from '../lib/colors';

export function SubjectSelector() {
    const { topics, selectedSubject, selectSubject, selectCluster } = useAppStore();
    const subjects = getSubjects(topics);

    if (subjects.length === 0) {
        return null;
    }

    return (
        <div className="flex gap-2 overflow-x-auto pb-2 px-4 py-3 border-b border-gray-200 bg-white sticky top-0 z-10">
            <button
                onClick={() => {
                    selectSubject(null);
                    selectCluster(null);
                }}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${selectedSubject === null
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
            >
                All Subjects
            </button>

            {subjects.map(subject => (
                <button
                    key={subject}
                    onClick={() => {
                        selectSubject(subject);
                        selectCluster(null);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${selectedSubject === subject
                            ? getSubjectColor(subject).text + ' ' + getSubjectColor(subject).bg + ' border-2'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    {subject}
                </button>
            ))}
        </div>
    );
}
