import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { OfflineBanner } from './OfflineBanner';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-surface-dark">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <OfflineBanner />
        <main className="flex-1 pb-24 md:pb-8">
          <div className="mx-auto w-full max-w-5xl px-4 py-6">{children}</div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
