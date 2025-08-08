import { Router } from 'express';
import { comet } from '../comet';

export const status = Router();

status.get('/', async (_req, res) => {
  try {
    const [st, net, vals] = await Promise.all([
      comet('/status'),
      comet('/net_info'),
      comet('/validators')
    ]);
    res.json({ status: st, net, validators: vals });
  } catch (e: any) {
    res.status(502).json({ error: e.message || String(e) });
  }
});
