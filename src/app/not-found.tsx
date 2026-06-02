import { Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
      <Compass className="h-16 w-16 text-gold/70" />
      <p className="mt-6 font-display text-6xl font-black text-gold-gradient">
        404
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold text-ink">
        Lost at sea
      </h1>
      <p className="mt-2 text-muted">
        This page drifted off the map. Let&apos;s chart a course back to safe
        waters.
      </p>
      <div className="mt-6 flex gap-3">
        <Button href="/" variant="gold">
          Back to port
        </Button>
        <Button href="/releases" variant="secondary">
          Browse releases
        </Button>
      </div>
    </div>
  );
}
