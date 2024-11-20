"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
      <p className="text-muted-foreground mb-6">
        {error === "OAuthAccountNotLinked"
          ? "This email is already associated with another account. Please sign in with the correct provider."
          : "There was a problem signing you in."}
      </p>
      <Button asChild>
        <Link href="/signin">Try Again</Link>
      </Button>
    </div>
  );
} 