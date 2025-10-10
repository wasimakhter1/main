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
          <div className="p-4 md:px-6 lg:px-8 border-b">
            <div className="bg-card h-24 rounded-lg flex items-center justify-center text-muted-foreground">
              {/* Top Ad space */}
            </div>
          </div>
          <main className="flex-1 grid grid-cols-12 gap-8 p-4 md:p-6 lg:p-8 pt-6 pb-12 overflow-y-auto bg-background">
            <div className="col-span-12 lg:col-span-2 lg:block hidden bg-card rounded-lg h-full">
                {/* Ad space */}
            </div>
            <div className="col-span-12 lg:col-span-8 mx-auto w-full">
              {children}
            </div>
            <div className="col-span-12 lg:col-span-2 lg:block hidden bg-card rounded-lg h-full">
              {/* Ad space */}
            </div>
          </main>
          <AppFooter />
        </div>
      </SidebarInset>
    </>
  );
}
