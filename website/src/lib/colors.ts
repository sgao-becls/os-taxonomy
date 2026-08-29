// Color palette for subjects - using warm, educational colors
export const subjectColors: Record<string, { bg: string; text: string; border: string }> = {
    Computing: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    English: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    History: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    'Learning to Learn': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    'Life Skills': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    Mathematics: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    'Personal & Social Development': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
    Science: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
};

// Age range colors
export const ageRangeColors: Record<number, { bg: string; text: string }> = {
    3: { bg: 'bg-blue-100', text: 'text-blue-900' },
    4: { bg: 'bg-blue-100', text: 'text-blue-900' },
    5: { bg: 'bg-green-100', text: 'text-green-900' },
    6: { bg: 'bg-green-100', text: 'text-green-900' },
    7: { bg: 'bg-yellow-100', text: 'text-yellow-900' },
    8: { bg: 'bg-yellow-100', text: 'text-yellow-900' },
    9: { bg: 'bg-orange-100', text: 'text-orange-900' },
    10: { bg: 'bg-orange-100', text: 'text-orange-900' },
    11: { bg: 'bg-red-100', text: 'text-red-900' },
    12: { bg: 'bg-red-100', text: 'text-red-900' },
    13: { bg: 'bg-purple-100', text: 'text-purple-900' },
};

export function getAgeLabel(start: number, end: number): string {
    return `Ages ${start}-${end}`;
}

export function getAgeRangeColor(age: number) {
    return ageRangeColors[age] || { bg: 'bg-gray-100', text: 'text-gray-900' };
}

export function getSubjectColor(subject: string) {
    return subjectColors[subject] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
}

export function searchTopics(topics: any[], query: string): any[] {
    if (!query.trim()) return topics;

    const q = query.toLowerCase();
    return topics.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.domain.toLowerCase().includes(q)
    );
}

export function highlightText(text: string, query: string): string {
    if (!query.trim()) return text;
    const q = query.toLowerCase();
    const regex = new RegExp(`(${q})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}
