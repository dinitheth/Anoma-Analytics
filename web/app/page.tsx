'use client';
import useSWR from 'swr';

async function getJSON<T>(path: string): Promise<T> {
  const r = await fetch(path, { cache: 'no-store' });
  if (!r.ok) throw new Error(r.statusText);
  return r.json();
}

export default function HomePage() {
  const { data } = useSWR('/api/status', getJSON, { refreshInterval: 5000 });
  const latestHeight = data?.status?.result?.sync_info?.latest_block_height;
  const peers = data?.net?.result?.n_peers ?? data?.net?.result?.peers?.length;

  return (
    <main className="space-y-4">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 rounded-2xl p-4">
          <div className="text-slate-400 text-sm">Block Height</div>
          <div className="text-2xl font-semibold">{latestHeight ?? '-'}</div>
        </div>
        <div className="bg-slate-900 rounded-2xl p-4">
          <div className="text-slate-400 text-sm">Peers</div>
          <div className="text-2xl font-semibold">{peers ?? '-'}</div>
        </div>
      </section>
      <section className="bg-slate-900 rounded-2xl p-4">
        <div className="text-slate-300">Welcome. Use the nav to explore Intents, Solvers, Status and live Logs.</div>
      </section>
    </main>
  );
}
