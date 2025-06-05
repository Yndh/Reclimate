"use client";

import { DownloadIcon, EllipsisVertical, ShareIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent } from "./ui/dialog";
import Image from "next/image";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

interface PWAProps {
  url: string;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

const LOCAL_STORAGE_PROMPT_SHOWN_KEY = "pwaPromptLastShown";
const DELAY_BEFORE_SHOWING_PROMPT_MS = 3 * 1000;
const REPROMPT_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;

export const PwaPrompt = ({ url }: PWAProps) => {
  const [platform, setPlatform] = useState<
    "android" | "ios" | "desktop" | null
  >(null);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const ua =
        navigator.userAgent || navigator.vendor || (window as any).opera || "";

      if (/android/i.test(ua)) {
        setPlatform("android");
      } else if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) {
        setPlatform("ios");
      } else {
        setPlatform("desktop");
      }
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  useEffect(() => {
    if (platform && platform !== "desktop" && !isPwa()) {
      const lastShown = localStorage.getItem(LOCAL_STORAGE_PROMPT_SHOWN_KEY);
      const now = new Date().getTime();

      if (!lastShown || now - parseInt(lastShown, 10) > REPROMPT_INTERVAL_MS) {
        const timer = setTimeout(() => {
          setShowPrompt(true);
          localStorage.setItem(LOCAL_STORAGE_PROMPT_SHOWN_KEY, now.toString());
        }, DELAY_BEFORE_SHOWING_PROMPT_MS);

        return () => clearTimeout(timer);
      }
    }
  }, [platform]);

  const isPwa = (): boolean => {
    if (typeof window === "undefined") return false;

    const isIos = (window.navigator as any).standalone === true;

    const isAndroid =
      window.matchMedia &&
      window.matchMedia("(display-mode: standalone)").matches;

    return isIos || isAndroid;
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Reclimate",
          url: `${url}/app`,
        });
        setShowPrompt(false);
      } catch (err) {
        toast({
          variant: "destructive",
          description: `Niestety wystąpił błąd i musisz to zrobić manualnie.`,
        });
      }
    }
  };

  const handleInstall = async () => {
    if (!deferredPrompt) {
      toast({
        variant: "destructive",
        description: "Nie można zainstalować aplikacji automatycznie.",
      });
      return;
    }

    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      toast({ description: "Aplikacja została zainstalowana!" });
    } else {
      toast({ description: "Instalacja została anulowana." });
    }
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <Dialog open={showPrompt} onOpenChange={handleDialogClose}>
      <DialogContent className="flex flex-col gap-4 justify-center items-center text-center text-base">
        <div className="relative mb-2">
          <Image
            src={"/favicon-192x192.png"}
            alt="Reclimate Icon"
            width={96}
            height={96}
          />
          <Image
            src={`/${platform === "ios" ? "safari.png" : "chrome.png"}`}
            alt="Reclimate Icon"
            width={48}
            height={48}
            className="absolute -right-6 -bottom-2 bg-white rounded-md p-1"
          />
        </div>

        <h1 className="text-xl">
          Dodaj <b>Reclimate</b> do ekranu głównego
        </h1>

        <p className="text-sm text-muted-foreground">
          Aby mieć szybki dostęp i korzystać z <b>Reclimate</b> jak z natywnej,
          dodaj ją do ekranu głównego!
        </p>

        <ol className="list-inside list-decimal gap-4 px-2 text-left w-full">
          {platform === "ios" ? (
            <>
              <li>
                Otwórz aplikację w przeglądarce <b>Safari</b>.
              </li>
              <li className="list-item ">
                <span className="inline-flex items-center gap-1">
                  Stuknij ikonę <b>udostępniania</b>
                  <ShareIcon size={16} /> .
                </span>
              </li>
              <li>
                Stuknij <b>,,Dodaj do ekranu początkowego&quot;</b>.
              </li>
              <li>
                Stuknij <b>,,Dodaj&quot;</b> w prawym górnym rogu.
              </li>
            </>
          ) : (
            <>
              <li className="list-item">
                <span className="inline-flex items-center gap-1">
                  Otwórz menu przeglądarki <EllipsisVertical size={16} />.
                </span>
              </li>
              <li>
                Stuknij <b>,,Zainstaluj aplikację&quot;</b> lub{" "}
                <b>,,Dodaj do ekranu głównego&quot;</b>.
              </li>
              <li>
                Potwierdź przyciskiem <b>,,Dodaj&quot;</b>.
              </li>
            </>
          )}
        </ol>

        <p>✅ Gotowe! Ikona aplikacji pojawi się na ekranie początkowym.</p>
        <p>
          🔒 Brak instalacji, brak aktualizacji — zawsze najnowsza wersja pod
          ręką!
        </p>

        {platform === "ios" ? (
          typeof navigator !== "undefined" ? (
            <>
              <Button className="w-full" onClick={handleShare}>
                Dodaj teraz!
              </Button>
              <DialogClose asChild>
                <Button variant={"outline"} className="w-full">
                  Może później
                </Button>
              </DialogClose>
            </>
          ) : (
            <DialogClose asChild>
              <Button variant={"outline"} className="w-full">
                Już dodaje!
              </Button>
            </DialogClose>
          )
        ) : (
          <Button className="w-full" onClick={handleInstall}>
            <DownloadIcon size={16} className="mr-2" />
            Zainstaluj teraz
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};
