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
  SidebarMenuSub,
  SidebarMenuSubItem,
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
  User2,
  LogOutIcon,
  HomeIcon,
  Crown,
  AlarmSmoke,
  ChevronsUpDown,
  CalendarClock,
  Sparkles,
  LucideProps,
  ChevronRight,
  SparklesIcon,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { redirect, usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Avatar } from "./ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import logo from "@/app/logo.svg";
import logoLight from "@/app/logo-light.svg";
import { useTheme } from "next-themes";
import {
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
  useState,
} from "react";
import { Collapsible, CollapsibleContent } from "./ui/collapsible";
import { CollapsibleTrigger } from "@radix-ui/react-collapsible";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

interface NavItems {
  label: string;
  items: NavItem[];
}

interface NavItem {
  title: string;
  url: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  items?: CollapsibleItem[];
}

interface CollapsibleItem {
  id?: string;
  title: string;
  url: string;
}

const initNavItems: NavItems[] = [
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
    label: "Narzędzia",
    items: [
      {
        title: "Asystent",
        url: "/app/assistant",
        items: [],
        icon: Sparkles,
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
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [theme, setTheme] = useState("");

  useEffect(() => {
    if (resolvedTheme) {
      setTheme(resolvedTheme);
    }
  }, [resolvedTheme]);

  const [navItems, setNavItems] = useState(initNavItems);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        await fetch("/api/chats")
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              toast({
                variant: "destructive",
                description: data.error,
                duration: 2000,
              });
            }

            if (data.chats) {
              setNavItems((prevNavItems) => {
                return prevNavItems.map((section) => {
                  if (section.label.toLocaleLowerCase() === "narzędzia") {
                    return {
                      ...section,
                      items: section.items.map((item) => {
                        if (item.title.toLocaleLowerCase() === "asystent") {
                          return {
                            ...item,
                            items: data.chats.map(
                              (chat: { id: string; title: string }) => ({
                                id: chat.id,
                                title: chat.title,
                                url: `/app/assistant/${chat.id}`,
                              })
                            ),
                          };
                        }
                        return item;
                      }),
                    };
                  }
                  return section;
                });
              });
            }
          });
      } catch (err) {
        console.error(`Error getting chats: ${err}`);
        toast({
          variant: "destructive",
          description: "Wystąpił błąd w trakcie pobierania historii czatów",
        });
      }
    };

    fetchChats();
  }, []);

  const newChat = async () => {
    setIsCreating(true);
    try {
      await fetch("/api/chats", {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            toast({
              variant: "destructive",
              description: data.error,
            });
            setIsCreating(false);
            return;
          }

          if (data.chat) {
            router.push(`/app/assistant/${data.chat.id}`);
            setIsCreating(false);
          }
        });
    } catch (err) {
      console.error(`Error creating chat: ${err}`);
      toast({
        variant: "destructive",
        description: "Wystąpił błąd w trakcie tworzenia czatu",
      });
      setIsCreating(false);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-fit">
              <Image
                src={theme == "light" ? logoLight : logo}
                alt={`logo`}
                width={40}
                height={40}
                className="border-[1px] rounded-md border-border aspect-square"
              />
              <span className="text-xl font-semibold">Reclimate</span>
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
                {item.items.map((item) =>
                  (item.items && item.items.length > 0) ||
                  item.title.toLocaleLowerCase() == "asystent" ? (
                    <Collapsible key={item.title} className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title}>
                            <item.icon size={16} />
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subitem, index) => (
                              <SidebarMenuSubItem key={`subitem${index}`}>
                                <Link
                                  href={subitem.url}
                                  prefetch={false}
                                  className="w-full"
                                >
                                  {subitem.title ?? subitem.id}
                                </Link>
                              </SidebarMenuSubItem>
                            ))}
                            {item.title.toLocaleLowerCase() == "asystent" && (
                              <SidebarMenuSubItem key={`subitemBtn`}>
                                <Button
                                  size={"sm"}
                                  variant={"outline"}
                                  className="mt-2 hover-gradient-border p-0 w-full"
                                  onClick={newChat}
                                  disabled={isCreating}
                                >
                                  <span className="w-full h-full bg-bgStart rounded-md">
                                    <span className="flex items-center justify-center gap-2 w-full h-full bg-card backdrop-blur-[8px] text-foreground hover:text-white rounded-md px-3 py-2">
                                      Utwórz czat
                                      <SparklesIcon />
                                    </span>
                                  </span>
                                </Button>
                              </SidebarMenuSubItem>
                            )}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={item.url === pathname.trim()}
                      >
                        <Link href={item.url}>
                          <item.icon size={16} />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="my-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  {session?.user?.image ? (
                    <Image
                      src={session?.user?.image as string}
                      alt={session?.user?.name as string}
                      className="h-8 w-8 rounded-lg"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={session?.user?.image as string}
                        alt={session?.user?.name as string}
                      />
                      <AvatarFallback className="rounded-lg">
                        <User2 />
                      </AvatarFallback>
                    </Avatar>
                  )}

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
