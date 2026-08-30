import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const DATA_DIR = path.join(ROOT, 'public', 'data');
const EN_DIR = path.join(DATA_DIR, 'en');
const ZH_DIR = path.join(DATA_DIR, 'zh');
const CACHE_FILE = path.join(DATA_DIR, '.zh-translation-cache.json');

const GOOGLE_URL = 'https://translate.googleapis.com/translate_a/single';
const SEP = '\n§§§12345§§§\n';
const MAX_BATCH_CHARS = 2800;
const RETRY_LIMIT = 5;

async function readJson(filePath) {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

async function writeJson(filePath, data) {
    await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

async function ensureDir(dirPath) {
    await fs.mkdir(dirPath, { recursive: true });
}

function uniqStrings(values) {
    return [...new Set(values.filter(v => typeof v === 'string' && v.trim().length > 0))];
}

function collectTranslatableStrings(topics, clusters, dependencies) {
    const values = [];

    for (const t of topics) {
        values.push(t.subject, t.domain, t.name, t.description, t.assessmentPrompt);
        for (const e of t.evidence || []) values.push(e);
        for (const s of t.standards || []) values.push(s);
    }

    for (const c of clusters) {
        values.push(c.subject, c.domain, c.summary);
    }

    for (const d of dependencies) {
        values.push(d.reason);
    }

    return uniqStrings(values);
}

function chunkByChars(items, maxChars) {
    const chunks = [];
    let current = [];
    let currentChars = 0;

    for (const item of items) {
        const projected = currentChars + item.length + (current.length > 0 ? SEP.length : 0);
        if (projected > maxChars && current.length > 0) {
            chunks.push(current);
            current = [item];
            currentChars = item.length;
        } else {
            current.push(item);
            currentChars = projected;
        }
    }

    if (current.length > 0) {
        chunks.push(current);
    }

    return chunks;
}

async function sleep(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
}

async function translateBatch(strings) {
    const joined = strings.join(SEP);
    const params = new URLSearchParams({
        client: 'gtx',
        sl: 'en',
        tl: 'zh-CN',
        dt: 't',
        q: joined,
    });

    const url = `${GOOGLE_URL}?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const translated = Array.isArray(data?.[0]) ? data[0].map(row => row[0]).join('') : '';
    const parts = translated.split(SEP);

    if (parts.length !== strings.length) {
        throw new Error(`Batch split mismatch: expected ${strings.length}, got ${parts.length}`);
    }

    return parts;
}

async function translateWithRetry(strings, startIndex) {
    for (let attempt = 1; attempt <= RETRY_LIMIT; attempt += 1) {
        try {
            return await translateBatch(strings);
        } catch (error) {
            if (attempt === RETRY_LIMIT) {
                throw new Error(`Failed at batch ${startIndex} after ${RETRY_LIMIT} attempts: ${String(error)}`);
            }
            const delay = 400 * attempt;
            console.warn(`Retrying batch ${startIndex}, attempt ${attempt}/${RETRY_LIMIT}, delay ${delay}ms`);
            await sleep(delay);
        }
    }

    return strings;
}

async function loadCache() {
    try {
        const raw = await fs.readFile(CACHE_FILE, 'utf8');
        return JSON.parse(raw);
    } catch {
        return {};
    }
}

async function saveCache(cache) {
    await fs.writeFile(CACHE_FILE, `${JSON.stringify(cache, null, 2)}\n`, 'utf8');
}

function mapTopic(topic, cache) {
    return {
        ...topic,
        subject: cache[topic.subject] ?? topic.subject,
        domain: cache[topic.domain] ?? topic.domain,
        name: cache[topic.name] ?? topic.name,
        description: cache[topic.description] ?? topic.description,
        assessmentPrompt: cache[topic.assessmentPrompt] ?? topic.assessmentPrompt,
        evidence: (topic.evidence || []).map(e => cache[e] ?? e),
        standards: (topic.standards || []).map(s => cache[s] ?? s),
    };
}

function mapCluster(cluster, cache) {
    return {
        ...cluster,
        subject: cache[cluster.subject] ?? cluster.subject,
        domain: cache[cluster.domain] ?? cluster.domain,
        summary: cache[cluster.summary] ?? cluster.summary,
    };
}

function mapDependency(dep, cache) {
    return {
        ...dep,
        reason: cache[dep.reason] ?? dep.reason,
    };
}

async function main() {
    await ensureDir(EN_DIR);
    await ensureDir(ZH_DIR);

    const topicsPath = path.join(DATA_DIR, 'topics.json');
    const clustersPath = path.join(DATA_DIR, 'clusters.json');
    const dependenciesPath = path.join(DATA_DIR, 'dependencies.json');

    const topicsDoc = await readJson(topicsPath);
    const clustersDoc = await readJson(clustersPath);
    const dependenciesDoc = await readJson(dependenciesPath);

    const topics = topicsDoc.topics || [];
    const clusters = clustersDoc.clusters || [];
    const dependencies = dependenciesDoc.dependencies || [];

    // Keep a language-specific English source snapshot.
    await writeJson(path.join(EN_DIR, 'topics.json'), topicsDoc);
    await writeJson(path.join(EN_DIR, 'clusters.json'), clustersDoc);
    await writeJson(path.join(EN_DIR, 'dependencies.json'), dependenciesDoc);

    const allStrings = collectTranslatableStrings(topics, clusters, dependencies);
    const cache = await loadCache();
    const pending = allStrings.filter(s => !cache[s]);

    console.log(`Translatable unique strings: ${allStrings.length}`);
    console.log(`Cached: ${allStrings.length - pending.length}`);
    console.log(`Pending: ${pending.length}`);

    const chunks = chunkByChars(pending, MAX_BATCH_CHARS);
    for (let i = 0; i < chunks.length; i += 1) {
        const chunk = chunks[i];
        const translated = await translateWithRetry(chunk, i + 1);
        chunk.forEach((source, idx) => {
            cache[source] = translated[idx] || source;
        });

        if ((i + 1) % 20 === 0 || i === chunks.length - 1) {
            await saveCache(cache);
            console.log(`Progress: ${i + 1}/${chunks.length} batches`);
        }
    }

    const zhTopicsDoc = {
        ...topicsDoc,
        topics: topics.map(topic => mapTopic(topic, cache)),
    };

    const zhClustersDoc = {
        ...clustersDoc,
        clusters: clusters.map(cluster => mapCluster(cluster, cache)),
    };

    const zhDependenciesDoc = {
        ...dependenciesDoc,
        dependencies: dependencies.map(dep => mapDependency(dep, cache)),
    };

    await writeJson(path.join(ZH_DIR, 'topics.json'), zhTopicsDoc);
    await writeJson(path.join(ZH_DIR, 'clusters.json'), zhClustersDoc);
    await writeJson(path.join(ZH_DIR, 'dependencies.json'), zhDependenciesDoc);

    await saveCache(cache);
    console.log('Generated /public/data/zh/*.json and refreshed /public/data/en/*.json');
}

main().catch(error => {
    console.error(error);
    process.exit(1);
});
