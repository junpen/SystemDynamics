import fs from 'fs/promises';
import path from 'path';
import { DATA_DIR } from '../config.js';

const RESULTS_DIR = path.join(DATA_DIR, 'results');

async function ensureDir(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function readIndex() {
  const indexPath = path.join(RESULTS_DIR, 'index.json');
  try {
    const data = await fs.readFile(indexPath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeIndex(index) {
  await ensureDir(RESULTS_DIR);
  await fs.writeFile(
    path.join(RESULTS_DIR, 'index.json'),
    JSON.stringify(index, null, 2)
  );
}

export class ResultsStorageService {
  async list() {
    const index = await readIndex();
    return index;
  }

  async get(id) {
    const filePath = path.join(RESULTS_DIR, `${id}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  }

  async save(record) {
    await ensureDir(RESULTS_DIR);

    const index = await readIndex();
    index.unshift(record);
    await writeIndex(index);

    await fs.writeFile(
      path.join(RESULTS_DIR, `${record.id}.json`),
      JSON.stringify(record, null, 2)
    );

    return record;
  }

  async delete(id) {
    const filePath = path.join(RESULTS_DIR, `${id}.json`);
    await fs.unlink(filePath).catch(() => {});

    const index = await readIndex();
    const filtered = index.filter(r => r.id !== id);
    await writeIndex(filtered);

    return { success: true };
  }

  async clearAll() {
    await ensureDir(RESULTS_DIR);
    const index = await readIndex();
    for (const r of index) {
      await fs.unlink(path.join(RESULTS_DIR, `${r.id}.json`)).catch(() => {});
    }
    await writeIndex([]);
    return { success: true };
  }
}
