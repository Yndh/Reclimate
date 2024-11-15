"use client";

import { SparklesIcon, X } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { AppChat, MessageState } from "./app-chat";
import { PopoverClose } from "@radix-ui/react-popover";
import { useEffect, useState } from "react";
import { Chat } from "@/lib/types";
import { usePathname } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export const ChatPopup = () => {
  const [chat, setChat] = useState<MessageState[]>([]);
  const [id, setId] = useState<string>("");
  const [isFetching, setIsFetching] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);

    if (!segments.includes("assistant")) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [pathname]);

  const fetchChat = async () => {
    if (!isFetching) {
      return;
    }

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
            return;
          }

          if (data.chat) {
            const resChat: Chat = data.chat;
            const newMessages: MessageState[] = resChat.messages.map(
              (message) => ({
                text: message.text,
                sender: message.sender,
              })
            );
            setId(resChat.id);
            setChat(newMessages);
            setIsFetching(false);
          }
        });
    } catch (err) {
      console.error(`Error fetching chat: ${err}`);
      toast({
        variant: "destructive",
        description: "Wystąpił błąd w trakcie pobierania czatu",
      });
    }
  };

  if (isVisible) {
    return (
      <Popover>
        <PopoverTrigger asChild className="fixed bottom-0 right-0 z-10 m-4">
          <Button
            className="hover-gradient-border p-0 w-[60px] h-[60px] aspect-square rounded-full"
            variant={"outline"}
            onClick={fetchChat}
          >
            <span className="w-full h-full bg-bgStart rounded-full">
              <span className="flex items-center justify-center gap-2 w-full h-full bg-card backdrop-blur-[8px] text-foreground hover:text-white rounded-full px-3 py-2">
                <SparklesIcon />
              </span>
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="bottom-0 right-0 z-20 w-fit translate-y-[70px] mr-3"
          side="top"
        >
          <div className="w-full h-fit flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Asystent</span>

            <PopoverClose>
              <Button
                variant={"ghost"}
                className="aspect-square h-[28px] w-[28px] flex items-center justify-center rounded-full"
              >
                <X />
              </Button>
            </PopoverClose>
          </div>
          <div className="h-[700px] w-[300px] md:w-[400px] mt-2">
            <AppChat
              messages={chat}
              setMessages={setChat}
              id={id}
              isFetching={isFetching}
            />
          </div>
        </PopoverContent>
      </Popover>
    );
  }
};
