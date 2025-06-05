"use client";

import { DownloadIcon, EllipsisVertical, ShareIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent } from "./ui/dialog";
import Image from "next/image";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

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

export const PwaPrompt = () => {
  const [platform, setPlatform] = useState<
    "android" | "ios" | "desktop" | null
  >(null);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

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
        }, DELAY_BEFORE_SHOWING_PROMPT_MS);

        return () => clearTimeout(timer);
      } else {
        setShowBanner(true);
      }
    }
  }, [platform]);

  useEffect(() => {
    if (platform && platform !== "desktop" && !isPwa()) {
      if (!showPrompt) {
        setShowBanner(true);
      } else {
        setShowBanner(false);
      }
    } else {
      setShowBanner(false);
    }
  }, [showPrompt, platform]);

  const isPwa = (): boolean => {
    if (typeof window === "undefined") return false;

    const isIos = (window.navigator as any).standalone === true;

    const isAndroid =
      window.matchMedia &&
      window.matchMedia("(display-mode: standalone)").matches;

    return isIos || isAndroid;
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
    setShowBanner(false);
    setDeferredPrompt(null);
    localStorage.setItem(
      LOCAL_STORAGE_PROMPT_SHOWN_KEY,
      new Date().getTime().toString()
    );
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setShowPrompt(false);
      if (!isPwa()) {
        setShowBanner(true);
      }
      localStorage.setItem(
        LOCAL_STORAGE_PROMPT_SHOWN_KEY,
        new Date().getTime().toString()
      );
    }
  };

  const handleBannerClose = () => {
    setShowBanner(false);
    localStorage.setItem(
      LOCAL_STORAGE_PROMPT_SHOWN_KEY,
      new Date().getTime().toString()
    );
  };

  if (isPwa()) {
    return null;
  }

  return (
    <>
      {showBanner && !showPrompt && platform !== "desktop" && (
        <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground p-4 flex items-center justify-between shadow-lg z-50">
          <div className="flex items-center gap-3">
            <Image
              src={"/favicon-192x192.png"}
              alt="Reclimate Icon"
              width={40}
              height={40}
            />
            <div>
              <p className="font-semibold text-sm">
                Dodaj Reclimate do ekranu głównego
              </p>
              <p className="text-xs">Szybki dostęp jak do aplikacji!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {platform === "ios" ? (
              <Button
                onClick={() => setShowPrompt(true)}
                variant="secondary"
                size="sm"
              >
                Instrukcje
              </Button>
            ) : (
              <Button onClick={handleInstall} variant="secondary" size="sm">
                Instaluj
              </Button>
            )}
            <Button
              onClick={handleBannerClose}
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary/80"
            >
              X
            </Button>
          </div>
        </div>
      )}

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
            Aby mieć szybki dostęp i korzystać z <b>Reclimate</b> jak z
            natywnej, dodaj ją do ekranu głównego!
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
            <DialogClose asChild>
              <Button variant={"outline"} className="w-full">
                Już dodaje!
              </Button>
            </DialogClose>
          ) : (
            <Button className="w-full" onClick={handleInstall}>
              <DownloadIcon size={16} className="mr-2" />
              Zainstaluj teraz
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
