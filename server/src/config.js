import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const PORT = process.env.PORT || 3000;
export const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
export const DATA_DIR = path.resolve(__dirname, '..', 'data');
export const MODELS_DIR = path.join(DATA_DIR, 'models');
export const EXAMPLES_DIR = path.join(__dirname, 'examples');
export const LIB_PATH = path.resolve(__dirname, '..', '..');
