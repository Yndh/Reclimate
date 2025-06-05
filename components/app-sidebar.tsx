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
  Calculator,
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
  useCallback,
  useMemo,
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
  items?: CollapsibleItem[] | ChatGroup[];
}

interface CollapsibleItem {
  id?: string;
  title: string;
  url: string;
}

interface ChatGroup {
  label: string;
  chats: CollapsibleItem[];
}

const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const isSameWeek = (d1: Date, d2: Date) => {
  const startOfWeek1 = new Date(d1);
  startOfWeek1.setDate(
    d1.getDate() - (d1.getDay() === 0 ? 6 : d1.getDay() - 1)
  );
  startOfWeek1.setHours(0, 0, 0, 0);

  const startOfWeek2 = new Date(d2);
  startOfWeek2.setDate(
    d2.getDate() - (d2.getDay() === 0 ? 6 : d2.getDay() - 1)
  );
  startOfWeek2.setHours(0, 0, 0, 0);

  return startOfWeek1.getTime() === startOfWeek2.getTime();
};

const isSameMonth = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();

const categorizeChatsByDate = (
  chats: { id: string; title: string; createdAt: string }[]
): ChatGroup[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const finalCategories: Record<string, CollapsibleItem[]> = {
    today: [],
    yesterday: [],
    lastWeek: [],
    lastMonth: [],
  };

  const finalMonthGroups: Record<string, CollapsibleItem[]> = {};

  // Sort chats by createdAt in descending order (most recent first)
  chats.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  chats.forEach((chat) => {
    const chatDate = new Date(chat.createdAt);
    const item: CollapsibleItem = {
      id: chat.id,
      title: chat.title,
      url: `/app/assistant/${chat.id}`,
    };

    if (isSameDay(chatDate, now)) {
      finalCategories.today.push(item);
    } else if (isSameDay(chatDate, yesterday)) {
      finalCategories.yesterday.push(item);
    } else if (isSameWeek(chatDate, now)) {
      // Add to lastWeek only if not already in today or yesterday
      if (!isSameDay(chatDate, today) && !isSameDay(chatDate, yesterday)) {
        finalCategories.lastWeek.push(item);
      }
    } else if (isSameMonth(chatDate, now)) {
      // Add to lastMonth only if not already in this week (including today/yesterday)
      if (!isSameWeek(chatDate, now)) {
        finalCategories.lastMonth.push(item);
      }
    } else {
      const monthYearKey = new Intl.DateTimeFormat("pl-PL", {
        year: "numeric",
        month: "long",
      }).format(chatDate);
      if (!finalMonthGroups[monthYearKey]) {
        finalMonthGroups[monthYearKey] = [];
      }
      finalMonthGroups[monthYearKey].push(item);
    }
  });

  const result: ChatGroup[] = [];

  if (finalCategories.today.length > 0) {
    result.push({ label: "Dziś", chats: finalCategories.today });
  }
  if (finalCategories.yesterday.length > 0) {
    result.push({ label: "Wczoraj", chats: finalCategories.yesterday });
  }
  if (finalCategories.lastWeek.length > 0) {
    result.push({ label: "Ostatni Tydzień", chats: finalCategories.lastWeek });
  }
  if (finalCategories.lastMonth.length > 0) {
    result.push({ label: "Ostatni Miesiąc", chats: finalCategories.lastMonth });
  }

  const sortedMonthKeys = Object.keys(finalMonthGroups).sort((a, b) => {
    const parseMonthYear = (key: string) => {
      const [monthName, yearStr] = key.split(" ");
      const monthIndex = new Date(
        Date.parse(monthName + " 1, 2000")
      ).getMonth();
      return new Date(parseInt(yearStr), monthIndex, 1);
    };
    return parseMonthYear(a).getTime() - parseMonthYear(b).getTime();
  });

  sortedMonthKeys.forEach((key) => {
    result.push({ label: key, chats: finalMonthGroups[key] });
  });

  return result;
};

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
      {
        title: "Kalkulator śladu",
        url: "/calculate",
        icon: Calculator,
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
  const [isCreating, setIsCreating] = useState(false);
  const [navItems, setNavItems] = useState<NavItems[]>(initNavItems);

  useEffect(() => {
    if (resolvedTheme) {
      setTheme(resolvedTheme);
    }
  }, [resolvedTheme]);

  const fetchChats = useCallback(async () => {
    try {
      const res = await fetch("/api/chats");
      const data = await res.json();

      if (data.error) {
        toast({
          variant: "destructive",
          description: data.error,
          duration: 2000,
        });
        return;
      }

      if (data.chats) {
        setNavItems((prevNavItems) => {
          return prevNavItems.map((section) => {
            if (section.label.toLocaleLowerCase() === "narzędzia") {
              return {
                ...section,
                items: section.items.map((item) => {
                  if (item.title.toLocaleLowerCase() === "asystent") {
                    const categorizedChats = categorizeChatsByDate(
                      data.chats as {
                        id: string;
                        title: string;
                        createdAt: string;
                      }[]
                    );
                    return {
                      ...item,
                      items: categorizedChats,
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
    } catch (err) {
      console.error(`Error getting chats: ${err}`);
      toast({
        variant: "destructive",
        description: "Wystąpił błąd w trakcie pobierania historii czatów",
      });
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const newChat = useCallback(async () => {
    setIsCreating(true);
    try {
      const res = await fetch("/api/chats", {
        method: "POST",
      });
      const data = await res.json();

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
        await fetchChats();
        setIsCreating(false);
      }
    } catch (err) {
      console.error(`Error creating chat: ${err}`);
      toast({
        variant: "destructive",
        description: "Wystąpił błąd w trakcie tworzenia czatu",
      });
      setIsCreating(false);
    }
  }, [router, fetchChats]);

  const renderedNavItems = useMemo(() => {
    return navItems.map((item, index) => (
      <SidebarGroup key={`group-${item.label}-${index}`}>
        <SidebarGroupLabel>{item.label}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {item.items.map((subItem) =>
              (subItem.items && subItem.items.length > 0) ||
              subItem.title.toLocaleLowerCase() === "asystent" ? (
                <Collapsible
                  key={`collapsible-${subItem.title}`}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={subItem.title}>
                        <subItem.icon size={16} />
                        <span>{subItem.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="gap-1">
                        {subItem.title.toLocaleLowerCase() === "asystent" ? (
                          (subItem.items as ChatGroup[]).map((group) => (
                            <div
                              key={`chat-group-${group.label}`}
                              className="mb-2"
                            >
                              <span className="py-2 text-xs font-semibold text-muted-foreground block">
                                {group.label}
                              </span>
                              <div className="overflow-y-auto max-h-40">
                                {group.chats.map((nestedItem) => (
                                  <SidebarMenuSubItem
                                    key={`subitem-${
                                      nestedItem.id || nestedItem.title
                                    }`}
                                  >
                                    <Link
                                      href={nestedItem.url}
                                      prefetch={false}
                                      className="w-full text-muted-foreground text-xs"
                                    >
                                      {nestedItem.title || nestedItem.id}
                                    </Link>
                                  </SidebarMenuSubItem>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="overflow-y-scroll max-h-80">
                            {(subItem.items as CollapsibleItem[])?.map(
                              (nestedItem) => (
                                <SidebarMenuSubItem
                                  key={`subitem-${
                                    nestedItem.id || nestedItem.title
                                  }`}
                                >
                                  <Link
                                    href={nestedItem.url}
                                    prefetch={false}
                                    className="w-full text-muted-foreground text-xs"
                                  >
                                    {nestedItem.title ?? nestedItem.id}
                                  </Link>
                                </SidebarMenuSubItem>
                              )
                            )}
                          </div>
                        )}
                        {subItem.title.toLocaleLowerCase() === "asystent" && (
                          <SidebarMenuSubItem key={`new-chat-button`}>
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
                <SidebarMenuItem key={`menuitem-${subItem.title}`}>
                  <SidebarMenuButton
                    asChild
                    tooltip={subItem.title}
                    isActive={subItem.url === pathname.trim()}
                  >
                    <Link href={subItem.url}>
                      <subItem.icon size={16} />
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    ));
  }, [navItems, pathname, newChat, isCreating]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-fit">
              <Link href={"/app"} className="flex gap-2 items-center">
                <Image
                  src={theme === "light" ? logoLight : logo}
                  alt={`logo`}
                  width={40}
                  height={40}
                  className="border-[1px] rounded-md border-border aspect-square"
                />
                <span className="text-xl font-semibold">Reclimate</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>{renderedNavItems}</SidebarContent>
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
                      src={session.user.image as string}
                      alt={session.user.name as string}
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
