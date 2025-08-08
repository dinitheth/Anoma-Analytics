import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { env } from './env';

const execFileAsync = promisify(execFile);

export async function runAnoma(args: string[]) {
  const bin = env.ANOMA_BIN || 'anoma';
  const { stdout } = await execFileAsync(bin, args, {
    env: { ...process.env, ANOMA_HOME: env.ANOMA_HOME || process.env.ANOMA_HOME },
    maxBuffer: 10 * 1024 * 1024
  });
  return stdout;
}
