"use client";

import { Message, Sender } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { SendHorizonal } from "lucide-react";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Timer } from "./timer";

export interface MessageState {
  text: string;
  sender: Sender;
}

interface AppChatProps {
  messages: MessageState[];
  setMessages: React.Dispatch<React.SetStateAction<MessageState[]>>;
  id: string;
  isFetching: boolean;
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

export const AppChat = ({
  messages,
  id,
  isFetching,
  setMessages,
}: AppChatProps) => {
  const [chat, setChat] = useState<MessageState[]>(messages);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recQuestions, setRecQuestions] = useState<string[]>([]);
  const [isNew, setIsNew] = useState(false);
  const [refreshTime, setRefreshTime] = useState<Date | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChat(messages);
  }, [messages]);

  useEffect(() => {
    setRecQuestions(questions.sort(() => 0.5 - Math.random()).slice(0, 3));
  }, []);

  useEffect(() => {
    if (chat.length != 0 && chat != messages) {
      setMessages(chat);
    }

    if (chatRef.current) {
      chatRef.current.scrollTo({ top: chatRef.current.scrollHeight });
    }
  }, [chat]);

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
            if (data.refreshTime) {
              setRefreshTime(new Date(data.refreshTime));
            }
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
            setIsNew(true);
          }
          setIsLoading(false);
        });
    } catch (err) {
      alert(err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col items-center gap-10 w-full h-full">
      <div
        className="w-full flex-1 flex flex-col gap-8 overflow-y-scroll"
        ref={chatRef}
      >
        {isFetching && !isLoading ? (
          <>
            <div className="flex items-start justify-end gap-4 w-full">
              <div className="h-fit space-y-2 max-w-[200px] mt-1">
                <Skeleton className="w-[200px] h-[14px] " />
                <Skeleton className="w-[200px] h-[14px] " />
                <Skeleton className="w-[100px] h-[14px] " />
              </div>
            </div>
            <div className="flex items-start justify-start gap-4 w-full">
              <span className="w-[40px] h-[40px] aspect-square rounded-full flex items-center justify-center bg-muted">
                🤖
              </span>
              <div className="h-fit space-y-2 max-w-[200px] mt-1">
                <Skeleton className="w-[200px] h-[14px]" />
                <Skeleton className="w-[200px] h-[14px]" />
                <Skeleton className="w-[100px] h-[14px]" />
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
                    className={`h-fit space-y-2 min-w-[100px] max-w-[400px] mt-1 rounded-xl p-2 ${
                      message.sender == Sender.USER &&
                      "bg-popover border backdrop-blur-[8px] shadow"
                    }`}
                  >
                    <div
                      className={`text-wrap ${
                        message.sender == Sender.ASSISTANT &&
                        index == chat.length - 1 &&
                        isNew
                          ? "gradient-text"
                          : ""
                      }`}
                    >
                      {message.text.split("\\n").map((line, index) => (
                        <React.Fragment key={index}>
                          <ReactMarkdown>{line}</ReactMarkdown>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <h1 className="text-4xl text-center font-bold">
                  W czym mogę pomóc?
                </h1>
                <p className="text-sm text-center text-muted-foreground">
                  Zadaj pytanie twojemu ekologicznemu asystentowi!
                </p>
                <div className="flex flex-row gap-2 justify-center mt-4">
                  {recQuestions.map((question, index) => (
                    <div
                      className="flex items-center  rounded-xl border bg-card backdrop-blur-[8px] shadow text-xs text-muted-foreground p-2 hover:bg-accent duration-300 cursor-pointer"
                      onClick={() => {
                        setMessage(question);
                      }}
                      key={`recQuestion${index}`}
                    >
                      <span>{question}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {isLoading && (
              <div className="flex items-start justify-start gap-4 w-full">
                <span className="w-[40px] h-[40px] aspect-square rounded-full flex items-center justify-center bg-muted">
                  🤖
                </span>
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

      <div className="w-full flex flex-row items-center mb-4 gap-2 relative">
        {refreshTime && (
          <div className="w-full h-full absolute top-0 left 0 flex items-center justify-center backdrop-blur-[2px] z-40 text-muted-foreground">
            <Timer targetDate={refreshTime} setData={setRefreshTime} />
          </div>
        )}
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value as string)}
          className={`p-6 rounded-full pr-20 ${
            message.trim().length > 400 && "border-red-700"
          }`}
          onKeyDown={handleKeyDown}
          placeholder="Wpisz wiadomość..."
          disabled={isFetching || refreshTime != null}
        />
        <span className="text-sm text-muted-foreground outline-none absolute right-20">
          {message.trim().length}/400
        </span>
        <button
          className="aspect-square rounded-full w-[50px] h-[50px] p-2 flex items-center justify-center hover:bg-accent duration-300"
          onClick={sendMessage}
          disabled={refreshTime != null}
        >
          <SendHorizonal size={24} />
        </button>
      </div>
    </div>
  );
};
