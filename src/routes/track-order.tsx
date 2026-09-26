import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, ExternalLink, PackageSearch } from "lucide-react";
import { OrderLoading } from "@/components/OrderLoading";
import { trackOrder, type TrackedOrder } from "@/lib/orders.functions";
import { BRAND, formatINR } from "@/lib/product";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title: "Track Your Order | D's PANAI" },
      { name: "description", content: "Check your D's PANAI Pure Panangarkandu order status and invoice details." },
      { property: "og:title", content: "Track Your Order — D's PANAI" },
      { property: "og:description", content: "Check status and dispatch details for your Panangarkandu order." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-pack-front.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${BRAND.siteUrl}/track-order` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: BRAND.siteUrl,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Track Order",
              item: `${BRAND.siteUrl}/track-order`,
            },
          ],
        }),
      },
    ],
  }),
  component: TrackOrderPage,
});

const STATUS_STEPS = ["Pending", "Confirmed", "Shipped", "In Transit", "Delivered"] as const;

function TrackOrderPage() {
  const lookup = useServerFn(trackOrder);
  const [orderId, setOrderId] = useState("");
  const [tracked, setTracked] = useState<TrackedOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setTracked(null);
    try {
      setTracked(await lookup({ data: { orderId } }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not find that order.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-[920px] px-6 py-16 md:px-8 md:py-24">
      <div className="max-w-xl">
        <p className="eyebrow">A sweet little update</p>
        <h1 className="mt-4 font-display text-[clamp(2.3rem,6vw,4.5rem)]">Track your order</h1>
        <p className="mt-4 text-muted-foreground">
          Enter the order ID from your order confirmation email.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <form onSubmit={handleSubmit} className="surface-card space-y-5 p-6 md:p-8">
          <div>
            <label htmlFor="order-id" className="block text-xs font-semibold tracking-wide text-forest">
              Order ID
            </label>
            <input
              id="order-id"
              required
              value={orderId}
              onChange={(event) => setOrderId(event.target.value.toUpperCase())}
              placeholder="DSP-260910-0001"
              className="mt-2 w-full rounded-lg border border-input bg-card px-3 py-3 text-sm uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-4 text-sm font-bold tracking-wide text-primary-foreground uppercase transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            <PackageSearch className="size-4" />
            {loading ? "Finding your order" : "Check status"}
          </button>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {loading && <OrderLoading label="Following your palm-candy journey" />}
        </form>

        {tracked ? <TrackingResult order={tracked} /> : <TrackingPrompt />}
      </div>
    </div>
  );
}

function TrackingPrompt() {
  return (
    <div className="surface-card flex min-h-72 flex-col items-center justify-center p-8 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-cream text-gold">
        <PackageSearch className="size-7" />
      </span>
      <h2 className="mt-5 font-display text-2xl">Your parcel's story</h2>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Your latest status and invoice link will appear here.
      </p>
    </div>
  );
}

function TrackingResult({ order }: { order: TrackedOrder }) {
  const activeIndex = STATUS_STEPS.indexOf(order.status);
  return (
    <div className="surface-card p-6 md:p-8">
      <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="eyebrow">Order for {order.firstName}</p>
          <h2 className="mt-2 font-display text-2xl text-forest">{order.orderId}</h2>
          <p className="mt-1 text-xs text-warm">Placed {order.createdAt}</p>
        </div>
        <CheckCircle2 className="size-7 shrink-0 text-gold" />
      </div>
      <div className="mt-7 space-y-4">
        {STATUS_STEPS.map((status, index) => (
          <div key={status} className="flex items-center gap-3 text-sm">
            <span className={cn("grid size-7 place-items-center rounded-full border text-xs", index <= activeIndex ? "border-forest bg-forest text-primary-foreground" : "border-border text-warm")}>
              {index + 1}
            </span>
            <span className={index === activeIndex ? "font-bold text-forest" : "text-muted-foreground"}>{status}</span>
          </div>
        ))}
      </div>
      <div className="mt-7 flex items-center justify-between border-t border-border pt-5">
        <span className="text-sm text-muted-foreground">Order total</span>
        <span className="font-display text-2xl text-forest">{formatINR(order.total)}</span>
      </div>
      {order.invoiceUrl && (
        <a href={order.invoiceUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-forest">
          Open invoice PDF <ExternalLink className="size-4" />
        </a>
      )}
    </div>
  );
}
