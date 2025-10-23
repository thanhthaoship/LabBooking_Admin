import type { Metadata } from 'next';
import '@/app/globals.css';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/sidebar';

export const metadata: Metadata = {
  title: 'Lab Booking',
  icons: {
    icon: '/LOGO_RV_red-01-01.png',
    apple: '/LOGO_RV_red-01-01.png',
  },
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider
      defaultOpen={true}
      className="flex h-screen overflow-hidden"
      style={
        {
          '--sidebar-width': '300px',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="overflow-auto scrollbar-hide">{children}</SidebarInset>
    </SidebarProvider>
  );
}
