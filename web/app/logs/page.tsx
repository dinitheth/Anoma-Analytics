'use client';
import { useEffect, useRef, useState } from 'react';

export default function LogsPage() {
  const [lines, setLines] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const es = new EventSource('/api/logs');
    es.onmessage = (e) => {
      try {
        const { line } = JSON.parse(e.data);
        setLines(prev => {
          const next = [...prev, line];
          return next.length > 1000 ? next.slice(-1000) : next;
        });
        ref.current?.scrollTo({ top: ref.current.scrollHeight });
      } catch {}
    };
    es.onerror = () => {};
    return () => es.close();
  }, []);

  return (
    <main className="space-y-4">
      <div className="bg-slate-900 rounded-2xl p-3 h-[70vh] overflow-y-auto font-mono text-xs" ref={ref}>
        {lines.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </main>
  );
}
