import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MODELS_DIR, DATA_DIR } from '../config.js';

async function ensureDir(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function readIndex() {
  const indexPath = path.join(MODELS_DIR, 'index.json');
  try {
    const data = await fs.readFile(indexPath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeIndex(index) {
  await ensureDir(MODELS_DIR);
  await fs.writeFile(
    path.join(MODELS_DIR, 'index.json'),
    JSON.stringify(index, null, 2)
  );
}

export class ModelStorageService {
  async list() {
    const index = await readIndex();
    return index;
  }

  async get(id) {
    const filePath = path.join(MODELS_DIR, `${id}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  }

  async create(modelJSON) {
    await ensureDir(MODELS_DIR);
    const id = uuidv4().slice(0, 8);
    const now = new Date().toISOString();
    const entry = {
      id,
      name: modelJSON.name || 'Untitled',
      description: modelJSON.description || '',
      updatedAt: now,
      createdAt: now
    };

    const index = await readIndex();
    index.push(entry);
    await writeIndex(index);

    await fs.writeFile(
      path.join(MODELS_DIR, `${id}.json`),
      JSON.stringify({ ...modelJSON, _meta: entry }, null, 2)
    );

    return { id, ...entry };
  }

  async update(id, modelJSON) {
    const filePath = path.join(MODELS_DIR, `${id}.json`);
    const existing = await this.get(id);
    const now = new Date().toISOString();

    const updated = { ...modelJSON, _meta: { ...existing._meta, updatedAt: now } };
    await fs.writeFile(filePath, JSON.stringify(updated, null, 2));

    const index = await readIndex();
    const item = index.find(m => m.id === id);
    if (item) {
      item.name = modelJSON.name || item.name;
      item.updatedAt = now;
      await writeIndex(index);
    }

    return { id, ...item, updatedAt: now };
  }

  async delete(id) {
    const filePath = path.join(MODELS_DIR, `${id}.json`);
    await fs.unlink(filePath).catch(() => {});

    const index = await readIndex();
    const filtered = index.filter(m => m.id !== id);
    await writeIndex(filtered);

    return { success: true };
  }
}
