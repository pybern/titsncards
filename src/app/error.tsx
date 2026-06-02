"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
      <AlertTriangle className="h-16 w-16 text-crimson-bright" />
      <h1 className="mt-6 font-display text-3xl font-bold text-ink">
        Storm on the horizon
      </h1>
      <p className="mt-2 text-muted">
        Something went wrong while loading this page. Batten down the hatches and
        try again.
      </p>
      <div className="mt-6 flex gap-3">
        <Button variant="gold" onClick={() => reset()}>
          Try again
        </Button>
        <Button href="/" variant="secondary">
          Back to port
        </Button>
      </div>
    </div>
  );
}
