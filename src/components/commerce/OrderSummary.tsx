import type { Totals } from "@/lib/commerce";
import { formatUSD } from "@/lib/utils";

export function OrderSummary({
  totals,
  title = "Order Summary",
}: {
  totals: Totals;
  title?: string;
}) {
  return (
    <div className="panel p-5">
      <h2 className="mb-4 font-display text-lg font-bold text-gold-bright">
        {title}
      </h2>
      <dl className="space-y-2.5 text-sm">
        <Row label={`Subtotal (${totals.itemCount} items)`} value={formatUSD(totals.subtotal)} />
        <Row
          label="Shipping"
          value={totals.shipping === 0 ? "Free" : formatUSD(totals.shipping)}
          accent={totals.shipping === 0}
        />
        <Row label="Tax (est.)" value={formatUSD(totals.tax)} />
        <div className="my-3 rule-gold" />
        <div className="flex items-center justify-between">
          <dt className="font-display text-base font-bold text-ink">Total</dt>
          <dd className="font-display text-2xl font-black text-gold-gradient">
            {formatUSD(totals.total)}
          </dd>
        </div>
      </dl>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className={accent ? "font-semibold text-up" : "font-semibold text-ink"}>
        {value}
      </dd>
    </div>
  );
}
