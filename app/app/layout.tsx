"use client";

import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/app-theme-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full h-screen pb-5 box-border relative overflow-y-hidden">
          <div className="flex justify-between items-center p-2">
            <div className="flex items-center gap-2 relative">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-[15px] mr-2" />
              <AppBreadcrumb />
            </div>
            <ModeToggle />
          </div>
          {children}
        </main>
      </SidebarProvider>
    </SessionProvider>
  );
}
