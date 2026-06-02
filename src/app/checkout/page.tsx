"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ShieldCheck, Loader2, CreditCard } from "lucide-react";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/components/providers/StoreProvider";
import {
  resolveCart,
  computeTotals,
  luhnValid,
  expiryValid,
  detectCardBrand,
  formatCardNumber,
  formatExpiry,
  maskCard,
  genOrderId,
} from "@/lib/commerce";
import { OrderSummary } from "@/components/commerce/OrderSummary";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Order, ShippingInfo } from "@/lib/types";
import { cn } from "@/lib/utils";

const empty = {
  fullName: "",
  email: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

type Form = typeof empty;
type Errors = Partial<Record<keyof Form, string>>;

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useStore((s) => s.cart);
  const clearCart = useStore((s) => s.clearCart);
  const addOrder = useStore((s) => s.addOrder);
  const hydrated = useHydrated();

  const [form, setForm] = useState<Form>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [processing, setProcessing] = useState(false);

  const lines = resolveCart(cart);
  const totals = computeTotals(lines);

  function set<K extends keyof Form>(key: K, value: string) {
    let v = value;
    if (key === "cardNumber") v = formatCardNumber(value);
    if (key === "expiry") v = formatExpiry(value);
    if (key === "cvc") v = value.replace(/\D/g, "").slice(0, 4);
    setForm((f) => ({ ...f, [key]: v }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const e: Errors = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state.trim()) e.state = "Required";
    if (!/^\d{4,10}$/.test(form.zip.replace(/\s/g, ""))) e.zip = "Enter a valid ZIP";
    if (!form.cardName.trim()) e.cardName = "Required";
    if (!luhnValid(form.cardNumber)) e.cardNumber = "Invalid card number";
    if (!expiryValid(form.expiry)) e.expiry = "Invalid / expired";
    if (!/^\d{3,4}$/.test(form.cvc)) e.cvc = "3–4 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) {
      document
        .querySelector("[data-error='true']")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 900)); // simulate payment processing

    const ship: ShippingInfo = {
      fullName: form.fullName,
      email: form.email,
      address: form.address,
      city: form.city,
      state: form.state,
      zip: form.zip,
      country: form.country,
    };
    const order: Order = {
      id: genOrderId(),
      createdAt: new Date().toISOString(),
      items: lines.map((l) => ({
        productId: l.product.id,
        name: l.product.name,
        qty: l.qty,
        price: l.product.price,
      })),
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      tax: totals.tax,
      total: totals.total,
      ship,
      paymentBrandMasked: maskCard(form.cardNumber, detectCardBrand(form.cardNumber)),
      status: "confirmed",
    };
    addOrder(order);
    clearCart();
    router.push(`/checkout/success/${order.id}`);
  }

  if (!hydrated) {
    return <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6" />;
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <EmptyState
          icon={<CreditCard className="h-7 w-7" />}
          title="Nothing to check out"
          description="Your hold is empty. Add some treasure first."
          action={
            <Button href="/releases" variant="gold">
              Browse releases
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-black text-gold-gradient sm:text-4xl">
          Checkout
        </h1>
        <Link href="/cart" className="text-sm text-muted hover:text-ink">
          ← Back to hold
        </Link>
      </div>

      {/* simulated banner */}
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-sea/40 bg-sea/10 px-4 py-2.5 text-sm text-sea-bright">
        <ShieldCheck className="h-4 w-4 shrink-0" />
        Demo checkout — no real payment is processed. Use any card number that
        passes a Luhn check (e.g. <span className="font-mono">4242 4242 4242 4242</span>).
      </div>

      <form onSubmit={onSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          {/* shipping */}
          <section className="panel p-6">
            <h2 className="mb-4 font-display text-lg font-bold text-gold-bright">
              Shipping Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Field className="col-span-2" label="Full name" value={form.fullName} onChange={(v) => set("fullName", v)} error={errors.fullName} placeholder="Monkey D. Luffy" />
              <Field className="col-span-2" label="Email" type="email" value={form.email} onChange={(v) => set("email", v)} error={errors.email} placeholder="captain@grandline.sea" />
              <Field className="col-span-2" label="Address" value={form.address} onChange={(v) => set("address", v)} error={errors.address} placeholder="1 Thousand Sunny Way" />
              <Field label="City" value={form.city} onChange={(v) => set("city", v)} error={errors.city} placeholder="Foosha" />
              <Field label="State / Region" value={form.state} onChange={(v) => set("state", v)} error={errors.state} placeholder="East Blue" />
              <Field label="ZIP / Postal" value={form.zip} onChange={(v) => set("zip", v)} error={errors.zip} placeholder="00001" />
              <Field label="Country" value={form.country} onChange={(v) => set("country", v)} />
            </div>
          </section>

          {/* payment */}
          <section className="panel p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-gold-bright">
                Payment
              </h2>
              <span className="flex items-center gap-1 text-xs text-muted">
                <Lock className="h-3.5 w-3.5" /> Simulated &amp; secure
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field className="col-span-2" label="Name on card" value={form.cardName} onChange={(v) => set("cardName", v)} error={errors.cardName} placeholder="M. D. LUFFY" />
              <div className="col-span-2" data-error={!!errors.cardNumber}>
                <FieldLabel>Card number</FieldLabel>
                <div className="relative">
                  <input
                    inputMode="numeric"
                    value={form.cardNumber}
                    onChange={(e) => set("cardNumber", e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className={inputCls(!!errors.cardNumber)}
                  />
                  {form.cardNumber && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gold/90">
                      {detectCardBrand(form.cardNumber)}
                    </span>
                  )}
                </div>
                {errors.cardNumber && <ErrorText>{errors.cardNumber}</ErrorText>}
              </div>
              <Field label="Expiry (MM/YY)" value={form.expiry} onChange={(v) => set("expiry", v)} error={errors.expiry} placeholder="12/28" />
              <Field label="CVC" value={form.cvc} onChange={(v) => set("cvc", v)} error={errors.cvc} placeholder="123" />
            </div>
          </section>
        </div>

        {/* summary */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <OrderSummary totals={totals} />
          <Button
            type="submit"
            variant="gold"
            className="mt-4 w-full"
            disabled={processing}
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Processing…
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" /> Pay {fmtTotal(totals.total)}
              </>
            )}
          </Button>
          <p className="mt-3 text-center text-xs text-muted">
            By placing this (simulated) order you agree to nothing — it&apos;s a demo.
          </p>
        </div>
      </form>
    </div>
  );
}

function fmtTotal(v: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);
}

const inputCls = (err: boolean) =>
  cn(
    "h-11 w-full rounded-lg border bg-panel-light px-3 text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:ring-1",
    err
      ? "border-down/70 focus:border-down focus:ring-down/40"
      : "border-hairline focus:border-gold/60 focus:ring-gold/40",
  );

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
      {children}
    </label>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs font-medium text-down">{children}</p>;
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className} data-error={!!error}>
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputCls(!!error)}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}
