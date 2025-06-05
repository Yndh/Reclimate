"use client";

import { toast } from "@/hooks/use-toast";
import { Chat } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function AssistantPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const fetchChat = useCallback(async () => {
    setIsLoading(true);
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
        router.push(`/app`);
        return;
      }

      if (data.chat) {
        const resChat: Chat = data.chat;
        const { id } = resChat;
        router.replace(`/app/assistant/${id}`);
      }
    } catch (err) {
      console.error(`Error creating new chat: ${err}`);
      toast({
        variant: "destructive",
        description: "Wystąpił błąd w trakcie tworzenia nowego czatu.",
      });
      router.push(`/app`);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 w-full h-full p-8">
        <p className="text-lg text-muted-foreground">Tworzenie nowego czatu</p>
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  return null;
}
