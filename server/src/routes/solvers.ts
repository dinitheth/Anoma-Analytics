import { Router } from 'express';
import { runAnoma } from '../cli';

export const solvers = Router();

solvers.get('/', async (_req, res) => {
  try {
    // Adjust to the actual CLI command your node exposes for solvers
    const raw = await runAnoma(['client', 'query', 'solver', '--json']);
    let data: any = {};
    try { data = JSON.parse(raw); } catch { data = raw; }
    res.json(data);
  } catch (e: any) {
    res.status(502).json({ error: e.message || String(e) });
  }
});
