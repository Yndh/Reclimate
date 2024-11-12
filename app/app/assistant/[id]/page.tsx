"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, SendHorizonal } from "lucide-react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Chat, Message, Sender } from "@/lib/types";
import assistant from "@/app/assistant.png";
import { useRouter } from "next/navigation";

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
  const [message, setMessage] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const id = params.id;

  useEffect(() => {
    const fetchChat = async () => {
      try {
        await fetch(`/api/chats/${id}`)
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            if (data.error) {
              alert(data.error);
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
        alert(err);
      }
    };

    fetchChat();
  }, []);

  const sendMessage = async () => {
    if (message.trim().length == 0) {
      return;
    }

    if (message.trim().length > 400) {
      return;
    }

    setMessage("");
    setChat((prevMessages) => [
      ...prevMessages,
      {
        text: message.trim(),
        sender: Sender.USER,
      },
    ]);
    setIsLoading(true);

    try {
      await fetch(`/api/chats/${id}`, {
        method: "POST",
        body: JSON.stringify({
          message: message,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
            return;
          }

          if (data.message) {
            const resMessage: Message = data.message;
            setChat((prevMessages) => [
              ...prevMessages,
              {
                text: resMessage.text,
                sender: resMessage.sender,
              },
            ]);
            setIsLoading(false);
          }
        });
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full p-8 pb-12 gap-6 box-border">
      <div className="w-full md:w-2/3 h-full flex flex-col gap-8 overflow-y-scroll">
        {isFetching ? (
          <>
            <div className="flex items-start justify-start gap-4 w-full">
              <Avatar>
                <AvatarImage src={"" as string} />
                <AvatarFallback>🤖</AvatarFallback>
              </Avatar>
              <div className="h-fit space-y-2 max-w-[200px] mt-1">
                <Skeleton className="w-[200px] h-[14px]" />
                <Skeleton className="w-[200px] h-[14px]" />
                <Skeleton className="w-[100px] h-[14px]" />
              </div>
            </div>
            <div className="flex items-start justify-end gap-4 w-full">
              <div className="h-fit space-y-2 max-w-[200px] mt-1">
                <Skeleton className="w-[200px] h-[14px] " />
                <Skeleton className="w-[200px] h-[14px] " />
                <Skeleton className="w-[100px] h-[14px] " />
              </div>
            </div>
          </>
        ) : (
          <>
            {chat.length > 0 ? (
              chat.map((message, index) => (
                <div
                  className={`flex items-start justify-${
                    message.sender == Sender.USER ? "end" : "start"
                  } gap-4 w-full`}
                  key={`message${index}`}
                >
                  {message.sender == Sender.ASSISTANT && (
                    <span className="w-[40px] h-[40px] aspect-square rounded-full flex items-center justify-center bg-muted">
                      🤖
                    </span>
                  )}
                  <div
                    className={`h-fit space-y-2 min-w-[100px] max-w-[400px] mt-1 rounded-md p-2 ${
                      message.sender == Sender.USER &&
                      "bg-popover border backdrop-blur-[8px] shadow"
                    }`}
                  >
                    <p className="text-wrap">{message.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <h1 className="text-4xl font-bold">W czym mogę pomóc?</h1>
                <p className="text-sm text-muted-foreground">
                  Zadaj pytanie twojemu ekologicznemu asystentowi!
                </p>
              </div>
            )}
            {isLoading && (
              <div className="flex items-start justify-start gap-4 w-full">
                <Avatar>
                  <AvatarImage src={"" as string} />
                  <AvatarFallback>🤖</AvatarFallback>
                </Avatar>
                <div className="h-fit space-y-2 max-w-[200px] mt-1">
                  <Skeleton className="w-[200px] h-[14px] gradient-animation" />
                  <Skeleton className="w-[200px] h-[14px] gradient-animation" />
                  <Skeleton className="w-[100px] h-[14px] gradient-animation" />
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className="w-full md:w-4/5 h-fit flex flex-row items-center mb-4 gap-2 relative">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value as string)}
          className={`p-6 rounded-full pr-20 ${
            message.trim().length > 400 && "border-red-700"
          }`}
          placeholder="Wpisz wiadomość..."
        />
        <span className="text-sm text-muted-foreground outline-none absolute right-20">
          {message.trim().length}/400
        </span>
        <button
          className="aspect-square rounded-full w-[50px] h-[50px] p-2 flex items-center justify-center hover:bg-accent duration-300"
          onClick={sendMessage}
        >
          <SendHorizonal size={24} />
        </button>
      </div>
    </div>
  );
}
