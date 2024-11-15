"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">
            Zaloguj się, aby kontynuować
          </CardTitle>
          <CardDescription>
            Wybierz jedną z metod logowania, aby rozpocząć korzystanie z
            aplikacji
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button
              className="w-full"
              onClick={() => {
                signIn("github", { redirectTo: "/app" });
              }}
            >
              <GitHubLogoIcon /> Zaloguj się przez Github
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                signIn("google", { redirectTo: "/app" });
              }}
            >
              <span className="font-semibold">G</span>
              Zaloguj się przez Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
