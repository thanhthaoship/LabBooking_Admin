'use client';

import * as React from 'react';
import {
  House,
  LayoutDashboardIcon,
  Shield,
} from 'lucide-react';
import { NavMain } from '@/components/sidebar/nav-main';
import { NavUser } from '@/components/sidebar/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import Link from 'next/link';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigationData = {
    navMain: [
      {
        title: 'Bảng điều khiển',
        url: '/dashboard',
        icon: LayoutDashboardIcon,
      },
      {
        title: 'Quản lý phòng lab',
        url: '/(dashboard)/lab-rooms',
        icon: House,
      },
      {
        title: 'Quản lý thiết bị',
        url: '/(dashboard)/equipments',
        icon: House,
      },
      {
        title: 'Quản lý bảo vệ',
        url: '/security',
        icon: Shield,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props} className="font-medium [--sidebar-icon-width:4.25rem]">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5! group-data-[collapsible=icon]:px-2! "
            >
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <House className="h-4 w-4" />
                </div>
                <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden text-[#403B2A]">
                  Lab Booking
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationData.navMain} />
        {/* <SidebarSeparator /> */}
        {/* <NavDocuments items={navigationData.documents} /> */}
        {/* <NavSecondary items={navigationData.navSecondary} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}