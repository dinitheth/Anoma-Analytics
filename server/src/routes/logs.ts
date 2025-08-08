import { Router } from 'express';
import { spawn } from 'node:child_process';
import { env } from '../env';

export const logs = Router();

logs.get('/', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });

  let child;
  if (env.LOG_MODE === 'journal') {
    child = spawn('journalctl', ['-u', env.JOURNAL_UNIT || 'anomad', '-f', '-o', 'cat']);
  } else if (env.LOG_MODE === 'file') {
    if (!env.LOG_FILE) {
      res.write(`event: error\ndata: ${JSON.stringify('LOG_FILE not set')}\n\n`);
      return;
    }
    child = spawn('tail', ['-F', env.LOG_FILE]);
  } else if (env.LOG_MODE === 'ssh-journal') {
    if (!env.SSH_HOST) {
      res.write(`event: error\ndata: ${JSON.stringify('SSH_HOST not set')}\n\n`);
      return;
    }
    child = spawn('ssh', [env.SSH_HOST, 'journalctl', '-u', env.JOURNAL_UNIT || 'anomad', '-f', '-o', 'cat']);
  } else {
    res.write(`event: error\ndata: ${JSON.stringify('Unsupported LOG_MODE')}\n\n`);
    return;
  }

  child.stdout.on('data', (chunk) => {
    const line = chunk.toString().trimEnd();
    res.write(`data: ${JSON.stringify({ line, ts: Date.now() })}\n\n`);
  });
  child.stderr.on('data', (err) => {
    res.write(`event: error\ndata: ${JSON.stringify(err.toString())}\n\n`);
  });
  req.on('close', () => {
    child.kill('SIGTERM');
  });
});
