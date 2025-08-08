import express from 'express';
import cors from 'cors';
import { env } from './env';
import { intents } from './routes/intents';
import { solvers } from './routes/solvers';
import { status } from './routes/status';
import { logs } from './routes/logs';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/intents', intents);
app.use('/api/solvers', solvers);
app.use('/api/status', status);
app.use('/api/logs', logs);

app.listen(env.PORT, () => {
  console.log(`API listening on :${env.PORT}`);
});
