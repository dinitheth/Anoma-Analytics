export const metadata = {
  title: 'Anoma Analytics Dashboard',
  description: 'Real-time intents, solvers, blocks & node health'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="max-w-7xl mx-auto p-4 space-y-6">
          <header className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-slate-100">Anoma Analytics Dashboard</h1>
            <nav className="space-x-3 text-slate-300">
              <a className="hover:text-slate-50" href="/">Overview</a>
              <a className="hover:text-slate-50" href="/intents">Intents</a>
              <a className="hover:text-slate-50" href="/solvers">Solvers</a>
              <a className="hover:text-slate-50" href="/status">Status</a>
              <a className="hover:text-slate-50" href="/logs">Logs</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
