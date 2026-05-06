import { Router } from 'express';
import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const EXAMPLES_DIR = join(__dirname, '../../data/examples');

const router = Router();

async function findExampleByName(modelName) {
  const files = await readdir(EXAMPLES_DIR);
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const content = await readFile(join(EXAMPLES_DIR, file), 'utf-8');
    const data = JSON.parse(content);
    if (data.name === modelName) {
      return file.replace('.json', '');
    }
  }
  return null;
}

function nameToFileName(modelName) {
  return modelName
    .replace(/[^一-龥a-zA-Z0-9_\-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase();
}

router.get('/', async (req, res) => {
  try {
    const files = await readdir(EXAMPLES_DIR);
    const examples = [];
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      const content = await readFile(join(EXAMPLES_DIR, file), 'utf-8');
      const data = JSON.parse(content);
      examples.push({
        id: file.replace('.json', ''),
        name: data.name,
        description: data.description
      });
    }
    res.json({ examples });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load examples' });
  }
});

router.post('/save', async (req, res) => {
  try {
    const modelJSON = req.body;
    const modelName = modelJSON.name;
    if (!modelName) {
      return res.status(400).json({ error: 'Model name is required' });
    }

    await mkdir(EXAMPLES_DIR, { recursive: true });

    const existingId = await findExampleByName(modelName);
    if (existingId) {
      const filePath = join(EXAMPLES_DIR, `${existingId}.json`);
      await writeFile(filePath, JSON.stringify(modelJSON, null, 2));
      res.json({ id: existingId, name: modelName, action: 'updated' });
    } else {
      const id = nameToFileName(modelName);
      const filePath = join(EXAMPLES_DIR, `${id}.json`);
      await writeFile(filePath, JSON.stringify(modelJSON, null, 2));
      res.json({ id, name: modelName, action: 'created' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:name', async (req, res) => {
  try {
    const filePath = join(EXAMPLES_DIR, `${req.params.name}.json`);
    const content = await readFile(filePath, 'utf-8');
    res.json(JSON.parse(content));
  } catch (err) {
    res.status(404).json({ error: 'Example not found' });
  }
});

export default router;
