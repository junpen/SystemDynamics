import express from 'express';
import cors from 'cors';
import { PORT, CORS_ORIGIN } from './config.js';
import simulateRoutes from './routes/simulate.js';
import modelRoutes from './routes/models.js';
import exampleRoutes from './routes/examples.js';

const app = express();

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: '10mb' }));

app.use('/api/v1', simulateRoutes);
app.use('/api/v1/models', modelRoutes);
app.use('/api/v1/examples', exampleRoutes);

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Simulation server running on http://0.0.0.0:${PORT}`);
});
