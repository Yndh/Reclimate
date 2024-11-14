"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Chat, Sender } from "@/lib/types";
import { useRouter } from "next/navigation";
import { AppChat } from "@/components/app-chat";
import { toast } from "@/hooks/use-toast";

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
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const id = params.id;

  useEffect(() => {
    const fetchChat = async () => {
      try {
        await fetch(`/api/chats/${id}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              toast({
                variant: "destructive",
                description: data.error,
              });
              router.replace("/app");
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
              setChat(newMessages);
              setIsFetching(false);
            }
          });
      } catch (err) {
        console.error(`Error geting chat: ${err}`);
        toast({
          variant: "destructive",
          description: "Wystąpił problem w trakcie pobiernia czatu",
        });
      }
    };

    fetchChat();
  }, []);

  return (
    <div className="flex flex-col items-center w-full h-full p-8 pb-12 gap-6 box-border">
      <div className="w-full md:w-2/3 h-full">
        <AppChat
          messages={chat}
          id={id}
          isFetching={isFetching}
          setMessages={setChat}
        />
      </div>
    </div>
  );
}
