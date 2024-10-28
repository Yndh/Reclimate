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
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";

const items = [
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
  {
    title: "Ranking",
    url: "/app/ranking",
    icon: Crown,
  },
];

export function AppSidebar() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signIn");
    },
  });

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center m-2 w-full">
              <p>Hakhiros 2</p>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>App</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="my-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="py-7">
                  {session?.user?.image ? (
                    <Image
                      src={session?.user?.image}
                      alt="pfp"
                      className="w-7 h-7 rounded-full mr-1"
                      width={24}
                      height={24}
                    ></Image>
                  ) : (
                    <User2 />
                  )}
                  <div className="flex flex-col">
                    <span className="truncate font-semibold">
                      {session?.user?.name}
                    </span>
                    <span className="truncate text-xs">
                      {session?.user?.email}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuLabel className="flex gap-3 items-center">
                  {session?.user?.image ? (
                    <Image
                      src={session?.user?.image}
                      alt="pfp"
                      className="w-8 h-8 rounded-lg"
                      width={24}
                      height={24}
                    ></Image>
                  ) : (
                    <User2 />
                  )}
                  <div className="flex flex-col">
                    <span className="truncate font-semibold">
                      {session?.user?.name}
                    </span>
                    <span className="truncate text-xs font-normal">
                      {session?.user?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <User />
                  <span>Konto</span>
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
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
