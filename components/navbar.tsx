"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import logo from "@/app/logo.svg";
import logoLight from "@/app/logo-light.svg";
import Image from "next/image";
import { Button } from "./ui/button";

interface NavItem {
  title: string;
  url: string;
}

const navItems: NavItem[] = [
  {
    title: "Nasza misja",
    url: "/#about",
  },
  {
    title: "Funkcje",
    url: "/#app",
  },
  {
    title: "FAQ",
    url: "/#faq",
  },
  {
    title: "Dołącz teraz",
    url: "/#join",
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
    <div className="flex items-center justify-between gap-4 px-4 md:px-10 py-6 w-11/12 md:w-fit md:min-w-[50%] h-fit fixed bg-background border border-border rounded-3xl md:rounded-full m-4 box-border z-50 text-xs md:text-sm text-muted-foreground">
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
      <div className="flex items-center gap-4 text-center">
        {navItems.map((item, index) => (
          <Link href={item.url} key={`key${index}`}>
            {item.title}
          </Link>
        ))}
      </div>
      <Button
        variant={"ghost"}
        className="border border-border rounded-3xl bg-card  shadow backdrop-blur-[8px] duration-300 font-semibold text-xs md:text-sm"
      >
        <Link href={"/app"}>Zaloguj się</Link>
      </Button>
    </div>
  );
};
