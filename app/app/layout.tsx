"use client";

import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/app-theme-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full h-screen overflow-hidden">
            <div className="flex justify-between items-center p-2">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <AppBreadcrumb />
              </div>
              <ModeToggle />
            </div>
            {children}
          </main>
        </SidebarProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
