"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, Truck, Mail } from "lucide-react";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/components/providers/StoreProvider";
import { getProductById } from "@/lib/catalog";
import { CardArt } from "@/components/catalog/CardArt";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatUSD, formatDate } from "@/lib/utils";

export default function SuccessPage() {
  const params = useParams<{ id: string }>();
  const orders = useStore((s) => s.orders);
  const hydrated = useHydrated();
  const order = orders.find((o) => o.id === params.id);

  if (!hydrated) {
    return <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6" />;
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState
          icon={<Package className="h-7 w-7" />}
          title="Order not found"
          description="We couldn't find that order in this browser."
          action={
            <Button href="/orders" variant="gold">
              View your orders
            </Button>
          }
        />
      </div>
    );
  }

  const eta = new Date(order.createdAt);
  eta.setDate(eta.getDate() + 5);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-up/40 bg-up/10">
          <CheckCircle2 className="h-11 w-11 text-up" />
        </div>
        <h1 className="mt-5 font-display text-3xl font-black text-gold-gradient sm:text-4xl">
          Order confirmed!
        </h1>
        <p className="mt-2 text-muted">
          Your treasure is being prepared for the voyage. A (pretend)
          confirmation has been sent to{" "}
          <span className="text-ink">{order.ship.email}</span>.
        </p>
        <p className="mt-3 rounded-lg border border-gold/40 bg-gold/10 px-4 py-1.5 font-mono text-sm font-bold text-gold-bright">
          {order.id}
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <InfoCard icon={<Mail className="h-5 w-5" />} title="Confirmation" body={order.ship.email} />
        <InfoCard icon={<Truck className="h-5 w-5" />} title="Est. delivery" body={formatDate(eta.toISOString())} />
        <InfoCard icon={<Package className="h-5 w-5" />} title="Payment" body={order.paymentBrandMasked} />
      </div>

      <div className="panel mt-6 p-6">
        <h2 className="mb-4 font-display text-lg font-bold text-gold-bright">
          Order Summary
        </h2>
        <ul className="space-y-3">
          {order.items.map((item) => {
            const product = getProductById(item.productId);
            return (
              <li key={item.productId} className="flex items-center gap-3">
                {product && (
                  <Link href={`/product/${product.slug}`}>
                    <CardArt product={product} showLabel={false} className="h-16 w-12" />
                  </Link>
                )}
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 font-semibold text-ink">{item.name}</p>
                  <p className="text-xs text-muted">Qty {item.qty}</p>
                </div>
                <span className="font-semibold text-ink">
                  {formatUSD(item.price * item.qty)}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 space-y-1.5 border-t border-hairline pt-4 text-sm">
          <Row label="Subtotal" value={formatUSD(order.subtotal)} />
          <Row label="Shipping" value={order.shipping === 0 ? "Free" : formatUSD(order.shipping)} />
          <Row label="Tax" value={formatUSD(order.tax)} />
          <div className="flex items-center justify-between pt-2">
            <span className="font-display text-base font-bold text-ink">Total</span>
            <span className="font-display text-xl font-black text-gold-gradient">
              {formatUSD(order.total)}
            </span>
          </div>
        </div>
        <div className="mt-4 text-sm text-muted">
          Shipping to: {order.ship.fullName}, {order.ship.address}, {order.ship.city},{" "}
          {order.ship.state} {order.ship.zip}, {order.ship.country}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button href="/orders" variant="gold">
          View all orders
        </Button>
        <Button href="/releases" variant="secondary">
          Keep shopping
        </Button>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="panel flex flex-col items-center gap-1 p-4 text-center">
      <div className="text-gold">{icon}</div>
      <p className="text-[11px] uppercase tracking-wider text-muted">{title}</p>
      <p className="line-clamp-1 text-sm font-semibold text-ink">{body}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted">{label}</span>
      <span className="font-semibold text-ink">{value}</span>
    </div>
  );
}
