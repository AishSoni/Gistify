'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Binary,
  Network, // Changed from GitNetwork
  MessageCircleQuestion,
  GitPullRequestArrow,
  Lightbulb,
  FileText,
  type LucideIcon,
} from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  matchExact?: boolean;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Repository Summary', icon: Binary, matchExact: true },
  { href: '/codebase-graph', label: 'Codebase Graph', icon: Network }, // Changed from GitNetwork
  { href: '/inquire-code', label: 'Inquire About Code', icon: MessageCircleQuestion },
  { href: '/pr-review', label: 'PR Review', icon: GitPullRequestArrow },
  { href: '/solution-planning', label: 'Solution Planning', icon: Lightbulb },
  { href: '/readme-generation', label: 'Readme Generation', icon: FileText },
];

export function SidebarNavItems() {
  const pathname = usePathname();

  return (
    <>
      {navItems.map((item) => {
        const isActive = item.matchExact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} legacyBehavior passHref>
              <SidebarMenuButton
                asChild={false}
                isActive={isActive}
                className={cn(
                  isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  'w-full justify-start'
                )}
                tooltip={{ children: item.label, className: 'font-body' }}
              >
                <item.icon className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden font-body">{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        );
      })}
    </>
  );
}
