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
      <main className="w-full h-screen overflow-hidden">
        <div className="flex items-center justify-end p-2">
          <ModeToggle />
        </div>
        {children}
      </main>
    </SessionProvider>
  );
}
