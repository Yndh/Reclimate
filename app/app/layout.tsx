"use client";

import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { ChatPopup } from "@/components/app-chat-popup";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/app-theme-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
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
            <Suspense>{children}</Suspense>
            <ChatPopup />
          </main>
        </SidebarProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
