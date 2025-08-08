'use client';
import useSWR from 'swr';

async function getJSON<T>(path: string): Promise<T> {
  const r = await fetch(path, { cache: 'no-store' });
  if (!r.ok) throw new Error(r.statusText);
  return r.json();
}

export default function StatusPage() {
  const { data } = useSWR<any>('/api/status', getJSON, { refreshInterval: 5000 });
  return (
    <main className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 rounded-2xl p-4">
          <div className="text-slate-400 text-sm">Latest Height</div>
          <div className="text-2xl font-semibold">{data?.status?.result?.sync_info?.latest_block_height ?? '-'}</div>
        </div>
        <div className="bg-slate-900 rounded-2xl p-4">
          <div className="text-slate-400 text-sm">Catching Up</div>
          <div className="text-2xl font-semibold">{String(data?.status?.result?.sync_info?.catching_up ?? '-')}</div>
        </div>
        <div className="bg-slate-900 rounded-2xl p-4">
          <div className="text-slate-400 text-sm">Peers</div>
          <div className="text-2xl font-semibold">{data?.net?.result?.n_peers ?? data?.net?.result?.peers?.length ?? '-'}</div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-4">
        <div className="text-slate-300 font-medium mb-2">Validators</div>
        <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(data?.validators, null, 2)}</pre>
      </div>
    </main>
  );
}
