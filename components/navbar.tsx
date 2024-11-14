"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import logo from "@/app/logo.svg";
import logoLight from "@/app/logo-light.svg";
import Image from "next/image";

interface NavItem {
  title: string;
  url: string;
}

const navItems: NavItem[] = [
  {
    title: "O nas",
    url: "#about",
  },
  {
    title: "Funkcje",
    url: "#app",
  },
  {
    title: "Społeczność",
    url: "#",
  },
  {
    title: "FAQ",
    url: "#",
  },
];

export const Navbar = () => {
  const [theme, setTheme] = useState("");
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    if (resolvedTheme) {
      setTheme(resolvedTheme);
    }
  }, [resolvedTheme]);

  return (
    <div className="flex items-center justify-between gap-4 px-10 py-6 w-full md:w-fit md:min-w-[50%] h-fit fixed bg-background border border-border rounded-full mt-4 z-50 text-xs md:text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <Image
          src={theme == "light" ? logoLight : logo}
          alt={`logo`}
          width={40}
          height={40}
          className="border-[1px] rounded-md border-border aspect-square"
        />
        <span className="text-xl font-semibold hidden md:block">Reclimate</span>
      </div>
      <div className="flex items-center gap-4">
        {navItems.map((item) => (
          <Link href={item.url}>{item.title}</Link>
        ))}
      </div>
      <Link href={"/app"}>Zaloguj się</Link>
    </div>
  );
};
