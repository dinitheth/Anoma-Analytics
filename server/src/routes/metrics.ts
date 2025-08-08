import { Router } from 'express';
import { comet } from '../comet';
import { runAnoma } from '../cli';

export const metrics = Router();

// Transaction volume for the last N blocks
metrics.get('/txs', async (req, res) => {
  try {
    const count = Math.max(1, Math.min(Number((req.query.last as string) || 20), 100));
    const st = await comet('/status');
    const latest = Number(st.result.sync_info.latest_block_height);
    const heights = Array.from({ length: count }, (_, i) => latest - count + 1 + i).filter(h => h > 0);
    const blocks = await Promise.all(heights.map(h => comet(`/block?height=${h}`)));
    const items = blocks.map((b, idx) => ({
      height: heights[idx],
      txs: b.result.block.data.txs?.length || 0
    }));
    res.json({ items });
  } catch (e: any) {
    res.status(502).json({ error: e.message || String(e) });
  }
});

// Intent volume grouped by day
metrics.get('/intents', async (_req, res) => {
  try {
    const raw = await runAnoma(['client', 'query', 'intent', '--all', '--json']);
    let data: any[] = [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) data = parsed;
      else if (Array.isArray(parsed?.items)) data = parsed.items;
    } catch {
      // if JSON parse fails, return empty data
    }

    const counts: Record<string, number> = {};
    for (const it of data) {
      const ts = it.timestamp ? new Date(it.timestamp).toISOString().slice(0, 10) : 'unknown';
      counts[ts] = (counts[ts] || 0) + 1;
    }
    const items = Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
    res.json({ items });
  } catch (e: any) {
    res.status(502).json({ error: e.message || String(e) });
  }
});
