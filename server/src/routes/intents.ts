import { Router } from 'express';
import { runAnoma } from '../cli';

export const intents = Router();

intents.get('/', async (req, res) => {
  try {
    // Real data from Anoma CLI. Requires --json support in your build.
    const raw = await runAnoma(['client', 'query', 'intent', '--all', '--json']);
    let payload: any = {};
    try { payload = JSON.parse(raw); } catch { payload = raw; }

    const { type, asset, owner, limit = '50', offset = '0' } = req.query as Record<string,string>;
    let items: any[] = Array.isArray(payload) ? payload : (payload?.items ?? []);
    if (type)  items = items.filter(x => (x.type ?? '').toString() === type);
    if (asset) items = items.filter(x => JSON.stringify(x).includes(asset));
    if (owner) items = items.filter(x => (x.owner ?? '').toString() === owner);

    const o = Number(offset) || 0, l = Number(limit) || 50;
    const page = items.slice(o, o + l);
    res.json({ total: items.length, offset: o, limit: l, items: page });
  } catch (e: any) {
    res.status(502).json({ error: e.message || String(e) });
  }
});
