'use client';
import { useState } from 'react';
import useSWR from 'swr';

async function getJSON<T>(path: string): Promise<T> {
  const r = await fetch(path, { cache: 'no-store' });
  if (!r.ok) throw new Error(r.statusText);
  return r.json();
}

export default function IntentsPage() {
  const [type, setType] = useState('');
  const [asset, setAsset] = useState('');
  const [owner, setOwner] = useState('');
  const [page, setPage] = useState(0);
  const limit = 50;

  const qs = new URLSearchParams({ limit: String(limit), offset: String(page * limit) });
  if (type) qs.set('type', type);
  if (asset) qs.set('asset', asset);
  if (owner) qs.set('owner', owner);

  const { data, isLoading, error } = useSWR(`/api/intents?${qs.toString()}`, getJSON, { refreshInterval: 5000 });

  return (
    <main className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input className="bg-slate-800 rounded-lg p-2 text-slate-100" placeholder="Type" value={type} onChange={e=>setType(e.target.value)} />
        <input className="bg-slate-800 rounded-lg p-2 text-slate-100" placeholder="Asset" value={asset} onChange={e=>setAsset(e.target.value)} />
        <input className="bg-slate-800 rounded-lg p-2 text-slate-100" placeholder="Owner" value={owner} onChange={e=>setOwner(e.target.value)} />
      </div>

      <div className="bg-slate-900 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-slate-200">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="px-3 py-2">Time</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Owner</th>
              <th className="px-3 py-2">Asset</th>
              <th className="px-3 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td className="p-3" colSpan={5}>Loading…</td></tr>}
            {error && <tr><td className="p-3 text-red-400" colSpan={5}>{String(error)}</td></tr>}
            {data?.items?.map((it: any, idx: number) => (
              <tr key={idx} className="odd:bg-slate-900 even:bg-slate-950 align-top">
                <td className="px-3 py-2">{it.timestamp ?? '-'}</td>
                <td className="px-3 py-2">{it.type ?? '-'}</td>
                <td className="px-3 py-2">{it.owner ?? '-'}</td>
                <td className="px-3 py-2">{Array.isArray(it.assets) ? it.assets.join(', ') : (it.asset ?? '-')}</td>
                <td className="px-3 py-2"><pre className="whitespace-pre-wrap text-xs opacity-80">{JSON.stringify(it.details ?? it, null, 0)}</pre></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <button className="px-3 py-2 bg-slate-800 rounded-lg disabled:opacity-40" onClick={()=>setPage(p=>Math.max(0, p-1))} disabled={page===0}>Prev</button>
        <div className="text-slate-400">Page {page+1}</div>
        <button className="px-3 py-2 bg-slate-800 rounded-lg disabled:opacity-40" onClick={()=>setPage(p=>p+1)} disabled={!data || data.items?.length < limit}>Next</button>
      </div>
    </main>
  );
}
