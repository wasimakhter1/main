import type { ReactNode } from 'react';
import AppSidebar from '@/components/layout/sidebar';
import AppHeader from '@/components/layout/header';
import AppFooter from '@/components/layout/footer';
import { SidebarInset } from '@/components/ui/sidebar';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col h-svh">
          <AppHeader />
          <main className="flex-1 grid grid-cols-12 gap-8 p-4 md:p-6 lg:p-8 pt-12 overflow-y-auto bg-background">
            <div className="col-span-12 lg:col-span-3 lg:block hidden bg-card rounded-lg h-full">
                {/* Ad space */}
            </div>
            <div className="col-span-12 lg:col-span-6 mx-auto w-full">
              {children}
            </div>
            <div className="col-span-12 lg:col-span-3 lg:block hidden bg-card rounded-lg h-full">
              {/* Ad space */}
            </div>
          </main>
          <AppFooter />
        </div>
      </SidebarInset>
    </>
  );
}
