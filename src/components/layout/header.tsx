'use client';

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { mainNavLinks } from '@/lib/constants';

function getPageTitle(pathname: string): string {
  const link = mainNavLinks.find((item) => pathname.startsWith(item.href));
  return link?.title || 'ImageForge';
}

export default function AppHeader() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-card px-4 md:px-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
    </header>
  );
}
