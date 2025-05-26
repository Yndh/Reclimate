"use client";

import { Message, Sender } from "@/lib/types";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { SendHorizonal } from "lucide-react";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Timer } from "./timer";
import { toast } from "@/hooks/use-toast";

export interface MessageState {
  text: string;
  sender: Sender;
}

interface AppChatProps {
  messages: MessageState[];
  title: string;
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
  title,
}: AppChatProps) => {
  const [currentChatMessages, setCurrentChatMessages] =
    useState<MessageState[]>(messages);
  const [chatTitle, setChatTitle] = useState(title);
  const [messageInput, setMessageInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recQuestions, setRecQuestions] = useState<string[]>([]);
  const [isNewAssistantMessage, setIsNewAssistantMessage] = useState(false);
  const [refreshTime, setRefreshTime] = useState<Date | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!title) return;

    if (title.trim().length > 0) {
      setChatTitle(title);
    }
  }, [title]);

  useEffect(() => {
    setCurrentChatMessages(messages);
  }, [messages]);

  useEffect(() => {
    setRecQuestions(questions.sort(() => 0.5 - Math.random()).slice(0, 3));
  }, []);
  useEffect(() => {
    if (currentChatMessages.length > 0 && currentChatMessages !== messages) {
      setMessages(currentChatMessages);
    }

    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [currentChatMessages, messages, setMessages]);

  const sendMessage = useCallback(async () => {
    if (!messageInput) return;

    if (messageInput.trim().length === 0) {
      return;
    }

    if (messageInput.trim().length > 400) {
      toast({
        variant: "destructive",
        description: "Wiadomość jest za długa (maksymalnie 400 znaków).",
      });
      return;
    }

    const userMessage = messageInput.trim();
    setMessageInput("");

    setCurrentChatMessages((prevMessages) => [
      ...prevMessages,
      {
        text: userMessage,
        sender: Sender.USER,
      },
    ]);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/chats/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });
      const data = await res.json();

      if (data.error) {
        toast({
          variant: "destructive",
          description: data.error,
        });
        if (data.refreshTime) {
          setRefreshTime(new Date(data.refreshTime));
        }
      }

      if (data.message) {
        const resMessage: Message = data.message;
        setCurrentChatMessages((prevMessages) => [
          ...prevMessages,
          {
            text: resMessage.text,
            sender: resMessage.sender,
          },
        ]);
        setIsNewAssistantMessage(true);
      }
      if (data.title && data.title.trim().length > 0) {
        setChatTitle(data.title);
      }
    } catch (err) {
      console.error(`Error sending message: ${err}`);
      toast({
        variant: "destructive",
        description: "Wystąpił błąd w trakcie wysyłania wiadomości",
      });
    } finally {
      setIsLoading(false);
    }
  }, [id, messageInput]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !isLoading && refreshTime === null) {
        sendMessage();
      }
    },
    [sendMessage, isLoading, refreshTime]
  );

  const renderedChatMessages = useMemo(() => {
    return currentChatMessages.map((message, index) => (
      <div
        className={`flex items-start justify-${
          message.sender === Sender.USER ? "end" : "start"
        } gap-4 w-full`}
        key={`message-${index}`}
      >
        {message.sender === Sender.ASSISTANT && (
          <span className="w-[40px] h-[40px] aspect-square rounded-full flex items-center justify-center bg-muted">
            🤖
          </span>
        )}
        <div
          className={`h-fit space-y-2 min-w-[100px] max-w-[400px] mt-1 rounded-xl p-2 ${
            message.sender === Sender.USER
              ? "bg-popover border backdrop-blur-[8px] shadow"
              : ""
          }`}
        >
          <div
            className={`text-wrap ${
              message.sender === Sender.ASSISTANT &&
              index === currentChatMessages.length - 1 &&
              isNewAssistantMessage
                ? "gradient-text"
                : ""
            }`}
            onAnimationEnd={() => setIsNewAssistantMessage(false)}
          >
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>
        </div>
      </div>
    ));
  }, [currentChatMessages, isNewAssistantMessage]);

  const renderedRecQuestions = useMemo(() => {
    return recQuestions.map((question, index) => (
      <div
        className="flex items-center rounded-xl border bg-card backdrop-blur-[8px] shadow text-xs text-muted-foreground p-2 hover:bg-accent duration-300 cursor-pointer"
        onClick={() => {
          setMessageInput(question);
        }}
        key={`recQuestion-${index}`}
      >
        <span>{question}</span>
      </div>
    ));
  }, [recQuestions]);

  return (
    <div className="relative flex flex-col items-center gap-10 w-full h-full">
      <div className="w-full flex justify-center items-center text-lg font-medium">
        {isFetching && !isLoading ? (
          <Skeleton className="w-[120px] h-[14px] " />
        ) : (
          <h1 className="text-center">{chatTitle}</h1>
        )}
      </div>
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
            {currentChatMessages.length > 0 ? (
              renderedChatMessages
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <h1 className="text-4xl text-center font-bold">
                  W czym mogę pomóc?
                </h1>
                <p className="text-sm text-center text-muted-foreground">
                  Zadaj pytanie twojemu ekologicznemu asystentowi!
                </p>
                <div className="flex flex-row gap-2 justify-center mt-4 flex-wrap">
                  {renderedRecQuestions}
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
          <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center backdrop-blur-[2px] z-40 text-muted-foreground">
            <Timer targetDate={refreshTime} setData={setRefreshTime} />
          </div>
        )}
        <Input
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          className={`p-6 rounded-full pr-20 ${
            messageInput.trim().length > 400 ? "border-red-700" : ""
          }`}
          onKeyDown={handleKeyDown}
          placeholder="Wpisz wiadomość..."
          disabled={isFetching || isLoading || refreshTime !== null}
        />
        <span className="text-sm text-muted-foreground outline-none absolute right-20">
          {messageInput.trim().length}/400
        </span>
        <button
          className="aspect-square rounded-full w-[50px] h-[50px] p-2 flex items-center justify-center hover:bg-accent duration-300"
          onClick={sendMessage}
          disabled={
            isLoading ||
            refreshTime !== null ||
            messageInput.trim().length === 0
          }
        >
          <SendHorizonal size={24} />
        </button>
      </div>
    </div>
  );
};
