// Optional: If you deploy web separately from server, you can proxy here to your API base.
// For local dev when both run on same origin/port proxy is not required.
export const dynamic = 'force-dynamic';
export async function GET() {
  const base = process.env.API_BASE || 'http://localhost:4000';
  const r = await fetch(`${base}/api/status`, { cache: 'no-store' });
  const data = await r.json();
  return new Response(JSON.stringify(data), { headers: { 'content-type': 'application/json' } });
}
