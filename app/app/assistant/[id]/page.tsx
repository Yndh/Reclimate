"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AppChat } from "@/components/app-chat";
import { toast } from "@/hooks/use-toast";
import { Message, Sender } from "@/lib/types";

interface ChatPageInterface {
  params: { id: string };
}

interface MessageState {
  text: string;
  sender: Sender;
}

export default function AsisstantChatPage({ params }: ChatPageInterface) {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {},
  });
  const router = useRouter();
  const [chat, setChat] = useState<MessageState[]>([]);
  const [chatTitle, setChatTitle] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const id = params.id;

  const fetchChat = useCallback(async () => {
    setIsFetching(true);
    try {
      const res = await fetch(`/api/chats/${id}`);
      const data = await res.json();

      if (data.error) {
        toast({
          variant: "destructive",
          description: data.error,
        });
        router.replace("/app");
        return;
      }

      if (data.chat) {
        const resChat = data.chat;
        const newMessages: MessageState[] = resChat.messages.map(
          (message: Message) => ({
            text: message.text,
            sender: message.sender,
          })
        );
        setChat(newMessages);
        setChatTitle(resChat.title || "");
      }
    } catch (err) {
      console.error(`Error getting chat: ${err}`);
      toast({
        variant: "destructive",
        description: "Wystąpił problem w trakcie pobierania czatu",
      });
    } finally {
      setIsFetching(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  return (
    <div className="flex flex-col items-center w-full h-full p-8 pb-12 gap-6 box-border">
      <div className="w-full md:w-2/3 h-full">
        <AppChat
          title={chatTitle}
          messages={chat}
          id={id}
          isFetching={isFetching}
          setMessages={setChat}
        />
      </div>
    </div>
  );
}
