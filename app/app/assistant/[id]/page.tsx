"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Chat, Sender } from "@/lib/types";
import { useRouter } from "next/navigation";
import { AppChat } from "@/components/app-chat";

interface ChatPageInterface {
  params: { id: string };
}

interface MessageState {
  text: string;
  sender: Sender;
}

const questions: string[] = [
  "Jak mogę zmniejszyć mój ślad węglowy na co dzień?",
  "Jakie są najnowsze inicjatywy na rzecz ochrony klimatu?",
  "Jakie skutki ma globalne ocieplenie dla mojego regionu?",
  "Jakie rośliny najlepiej oczyszczają powietrze w domu?",
  "Czy samochody elektryczne rzeczywiście są bardziej ekologiczne?",
  "Jak działa recykling elektroniki i jak mogę w nim uczestniczyć?",
  "Jakie kraje osiągają największe postępy w ograniczaniu emisji CO2?",
  "Jakie są alternatywy dla plastiku jednorazowego użytku?",
  "Jakie działania mogę podjąć, aby oszczędzać wodę w domu?",
  "Co to jest bioróżnorodność i dlaczego jest ważna?",
  "W jaki sposób rolnictwo wpływa na zmiany klimatyczne?",
  "Jakie są najlepsze sposoby na ochronę pszczół i innych owadów zapylających?",
  "Jakie organizacje mogę wspierać, aby przyczynić się do ochrony środowiska?",
  "Jakie są najważniejsze zasady segregacji odpadów?",
  "Jakie zmiany klimatyczne są prognozowane na nadchodzące lata?",
  "Co oznacza neutralność klimatyczna i jak mogę ją wspierać?",
  "Jakie są ekologiczne alternatywy dla produktów codziennego użytku?",
  "Jak ograniczyć zużycie energii elektrycznej w moim domu?",
  "Czym są gatunki inwazyjne i jak wpływają na środowisko?",
  "Jakie są najbardziej zagrożone gatunki zwierząt i jak mogę im pomóc?",
];

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
