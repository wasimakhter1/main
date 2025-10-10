import type { ReactNode } from 'react';
import AppSidebar from '@/components/layout/sidebar';
import AppHeader from '@/components/layout/header';
import { SidebarInset } from '@/components/ui/sidebar';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col h-svh">
          <AppHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto bg-background">
            <div className="mx-auto w-full max-w-4xl">
              {children}
            </div>
          </main>
        </div>
      </SidebarInset>
    </>
  );
}
