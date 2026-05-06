import { Router } from 'express';
import { ModelStorageService } from '../services/ModelStorageService.js';

const router = Router();
const storage = new ModelStorageService();

router.get('/', async (req, res) => {
  try {
    const models = await storage.list();
    res.json({ models });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const model = await storage.get(req.params.id);
    res.json(model);
  } catch (err) {
    res.status(404).json({ error: 'Model not found' });
  }
});

router.post('/', async (req, res) => {
  try {
    const result = await storage.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const result = await storage.update(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await storage.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
