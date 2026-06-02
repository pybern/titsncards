"use client";

import { create } from "zustand";
import { useEffect } from "react";
import { CheckCircle2, X, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastKind = "success" | "info" | "error";

interface Toast {
  id: string;
  title: string;
  description?: string;
  kind: ToastKind;
}

interface ToastState {
  toasts: Toast[];
  push: (t: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (t) =>
    set((s) => ({
      toasts: [...s.toasts, { ...t, id: Math.random().toString(36).slice(2) }],
    })),
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));

/** Imperative helper usable anywhere in client components. */
export function toast(t: Omit<Toast, "id">) {
  useToastStore.getState().push(t);
}

const icons = {
  success: CheckCircle2,
  info: Info,
  error: AlertTriangle,
};

const accent: Record<ToastKind, string> = {
  success: "border-up/50 text-up",
  info: "border-sea-bright/50 text-sea-bright",
  error: "border-down/50 text-down",
};

function ToastCard({ t }: { t: Toast }) {
  const dismiss = useToastStore((s) => s.dismiss);
  const Icon = icons[t.kind];

  useEffect(() => {
    const timer = setTimeout(() => dismiss(t.id), 4200);
    return () => clearTimeout(timer);
  }, [t.id, dismiss]);

  return (
    <div
      className={cn(
        "panel frame-gold pointer-events-auto flex w-80 items-start gap-3 p-4 shadow-2xl",
        "animate-[float_0.01s] duration-300",
      )}
    >
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", accent[t.kind])} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{t.title}</p>
        {t.description && (
          <p className="mt-0.5 text-xs text-muted">{t.description}</p>
        )}
      </div>
      <button
        onClick={() => dismiss(t.id)}
        className="text-muted transition hover:text-ink"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-3">
      {toasts.map((t) => (
        <ToastCard key={t.id} t={t} />
      ))}
    </div>
  );
}
