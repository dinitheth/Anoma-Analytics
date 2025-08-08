import { env } from './env';

export async function comet(path: string) {
  const url = `${env.COMET_RPC}${path}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return r.json();
}
