'use client';
import useSWR from 'swr';

async function getJSON<T>(path: string): Promise<T> {
  const r = await fetch(path, { cache: 'no-store' });
  if (!r.ok) throw new Error(r.statusText);
  return r.json();
}

export default function SolversPage() {
  const { data, error, isLoading } = useSWR('/api/solvers', getJSON, { refreshInterval: 5000 });

  return (
    <main className="space-y-4">
      <div className="bg-slate-900 rounded-2xl p-4">
        <div className="text-slate-300 font-medium mb-2">Realtime Solver Feed</div>
        {isLoading && <div>Loading…</div>}
        {error && <div className="text-red-400">{String(error)}</div>}
        <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
      </div>
    </main>
  );
}
