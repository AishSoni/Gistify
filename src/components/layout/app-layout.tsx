import type { PropsWithChildren } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
  SidebarMenu,
} from '@/components/ui/sidebar';
import { SidebarNavItems } from './sidebar-nav-items';
import { CodeXmlIcon } from 'lucide-react';

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader className="p-4 items-center">
          <div className="flex items-center gap-2">
            <CodeXmlIcon className="w-8 h-8 text-accent" />
            <h1 className="text-2xl font-headline font-semibold text-primary-foreground group-data-[collapsible=icon]:hidden">
              Gistify
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarNavItems />
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6">
          <SidebarTrigger className="md:hidden" />
          <h2 className="text-xl font-semibold">Gistify Dashboard</h2>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
