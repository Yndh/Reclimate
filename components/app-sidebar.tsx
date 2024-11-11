"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  User2,
  LogOutIcon,
  HomeIcon,
  ChevronUp,
  Calculator,
  Crown,
  AlarmSmoke,
  ChevronsUpDown,
  CalendarClock,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import Image from "next/image";
import { Avatar } from "./ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import logo from "@/app/logo.svg";

const navItems = [
  {
    label: "Aplikacja",
    items: [
      {
        title: "Dashboard",
        url: "/app",
        icon: HomeIcon,
      },
      {
        title: "Ślad węglowy",
        url: "/app/carbon",
        icon: AlarmSmoke,
      },
    ],
  },
  {
    label: "Społeczność",
    items: [
      {
        title: "Wyzwania",
        url: "/app/challenges",
        icon: CalendarClock,
      },
      {
        title: "Ranking",
        url: "/app/ranking",
        icon: Crown,
      },
    ],
  },
];

export function AppSidebar() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signIn");
    },
  });
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-fit">
              <Image
                src={logo}
                alt="logo"
                width={40}
                height={40}
                className="border-[1px] rounded-md border-border aspect-square"
              />
              <span className="text-xl font-bold">Reclimate</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navItems.map((item, index) => (
          <SidebarGroup key={`item${index}`}>
            <SidebarGroupLabel>{item.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.url === pathname.trim()}
                    >
                      <a href={item.url}>
                        <item.icon size={16} />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="my-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={session?.user?.image as string}
                        alt={session?.user?.name as string}
                      />
                      <AvatarFallback className="rounded-lg">
                        <User2 />
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {session?.user?.name as string}
                      </span>
                      <span className="truncate text-xs">
                        {session?.user?.email as string}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={session?.user?.image as string}
                          alt={session?.user?.name as string}
                        />
                        <AvatarFallback className="rounded-lg">
                          <User2 />
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {session?.user?.name as string}
                        </span>
                        <span className="truncate text-xs">
                          {session?.user?.email as string}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem>
                    <User />
                    <DialogTrigger asChild>
                      <span>Konto</span>
                    </DialogTrigger>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOutIcon />
                    <span
                      onClick={() => {
                        signOut();
                      }}
                      className=""
                    >
                      Wyloguj się
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Konto</DialogTitle>
                  <DialogDescription>Edytuj swoje konto</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="username" className="text-right">
                      Username
                    </label>
                    <Input
                      id="username"
                      value={`@${session?.user?.name}`}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
