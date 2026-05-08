import { Router } from 'express';
import { ResultsStorageService } from '../services/ResultsStorageService.js';

const router = Router();
const storage = new ResultsStorageService();

router.get('/', async (req, res) => {
  try {
    const results = await storage.list();
    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await storage.get(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(404).json({ error: 'Result not found' });
  }
});

router.post('/', async (req, res) => {
  try {
    const result = await storage.save(req.body);
    res.status(201).json(result);
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

router.delete('/', async (req, res) => {
  try {
    await storage.clearAll();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
