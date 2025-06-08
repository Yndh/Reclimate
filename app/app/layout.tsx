"use client";

import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { ChatPopup } from "@/components/app-chat-popup";
import { PwaPrompt } from "@/components/app-pwa-prompt";
import { AppSidebar } from "@/components/app-sidebar";
import { SurveyPrefetch } from "@/components/app-surver-prefetch";
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
          <main className="!relative flex flex-col w-full h-screen box-border !overflow-y-hidden z-10 pt-14">
            <div className="flex justify-between items-center p-2 fixed top-0 px-4 w-full z-40">
              <div className="flex items-center gap-2 relative">
                <SidebarTrigger />
                <Separator orientation="vertical" className="h-[15px] mr-2" />
                <AppBreadcrumb />
              </div>
            </div>
            <div className="fixed right-0 top-0 p-2 px-4 z-50">
              <ModeToggle />
            </div>
            <Suspense>{children}</Suspense>
            <ChatPopup />
          </main>
          <PwaPrompt />
          <SurveyPrefetch />
        </SidebarProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
