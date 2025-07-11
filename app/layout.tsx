import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppBlob } from "@/components/app-blob";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reclimate",
  description:
    "Reclimate to darmowa aplikacja, która pomoże Ci zrozumieć i zmienić codzienne nawyki, aby żyć bardziej ekologicznie. ",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "My App",
  },
  icons: {
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#daf1ed" },
    { media: "(prefers-color-scheme: dark)", color: "#071311" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <body className={`${inter.className} antialiased  h-screen`}>
        <AppBlob x={200} y={-100} />
        <AppBlob x={-300} y={0} bottom />
        <AppBlob side="right" x={10} y={10} bottom />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
