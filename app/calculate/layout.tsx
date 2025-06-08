import { ModeToggle } from "@/components/app-theme-toggle";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Reclimate | Ankieta",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <main className="w-full h-screen overflow-hidden">
        <div className="flex items-center justify-end w-full p-2 fixed ">
          <ModeToggle />
        </div>
        {children}
      </main>
    </SessionProvider>
  );
}
