import { Router } from 'express';
import { SimulationService } from '../services/SimulationService.js';

const router = Router();
const simService = new SimulationService();

router.post('/simulate', (req, res) => {
  try {
    const modelJSON = req.body;
    if (!modelJSON || !modelJSON.simulation) {
      return res.status(400).json({ error: '模型 JSON 无效：缺少仿真配置' });
    }
    const results = simService.simulate(modelJSON);
    res.json(results);
  } catch (err) {
    console.error('Simulation error:', err.message);
    res.status(400).json({
      error: err.message || '仿真运行失败',
      errorCode: err.errorCode || null,
      errorPrimitiveName: err.primitiveName || null
    });
  }
});

router.post('/validate', (req, res) => {
  try {
    const modelJSON = req.body;
    const result = simService.validate(modelJSON);
    res.json(result);
  } catch (err) {
    res.status(400).json({
      valid: false,
      errors: [{ message: err.message || '验证失败' }]
    });
  }
});

export default router;
