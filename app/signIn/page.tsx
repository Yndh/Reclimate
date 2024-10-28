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
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Choose your OAuth method to login to your account
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
              <GitHubLogoIcon /> Login with Github
            </Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
