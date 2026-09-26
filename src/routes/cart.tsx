import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { BRAND, PRODUCT_IMAGES, PRODUCT, calculatePrice, formatINR, formatWeight } from "@/lib/product";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | D's PANAI" },
      {
        name: "description",
        content:
          "Review your D's PANAI Panangarkandu order, adjust weights and quantities, then continue to customer details.",
      },
      { property: "og:title", content: "Your D's PANAI order" },
      { property: "og:description", content: "Review your Panangarkandu order before ordering on WhatsApp." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-pack-front.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${BRAND.siteUrl}/cart` }],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, subtotal, updateQuantity, updateWeight, removeLine } = useCart();

  return (
    <div className="mx-auto max-w-[1240px] px-6 py-16 md:px-8 md:py-20">
      <h1 className="font-display text-[clamp(2rem,5vw,3.25rem)] text-forest">Your D's PANAI order</h1>

      {lines.length === 0 ? (
        <div className="surface-card mt-10 p-12 text-center">
          <p className="text-base text-muted-foreground">Your cart is currently empty.</p>
          <Link
            to="/product/$slug"
            params={{ slug: PRODUCT.slug }}
            className="mt-6 inline-flex rounded-full bg-forest px-7 py-4 text-sm font-bold tracking-wide text-primary-foreground uppercase"
          >
            Shop Panangarkandu
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <ul className="space-y-4">
            {lines.map((line) => (
              <li key={line.lineId} className="surface-card flex flex-col gap-5 p-5 sm:flex-row">
                <img
                  src={PRODUCT_IMAGES.front}
                  alt={PRODUCT.name}
                  loading="lazy"
                  decoding="async"
                  className="size-28 shrink-0 rounded-xl object-cover border border-border"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg">{PRODUCT.name}</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLine(line.lineId)}
                      aria-label="Remove item"
                      className="text-warm transition-colors hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <label className="text-xs font-semibold text-forest">
                      Weight
                      <select
                        value={line.weightGrams}
                        onChange={(e) => updateWeight(line.lineId, Number(e.target.value))}
                        className="ml-2 rounded-lg border border-input bg-card px-3 py-2 text-sm font-semibold"
                      >
                        {Array.from(new Set([...PRODUCT.allWeights, line.weightGrams]))
                          .sort((a, b) => a - b)
                          .map((w) => (
                            <option key={w} value={w}>
                              {formatWeight(w)}
                            </option>
                          ))}
                      </select>
                    </label>

                    <div className="flex items-center gap-1 rounded-full border border-border p-1">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(line.lineId, line.quantity - 1)}
                        className="grid size-8 place-items-center rounded-full text-forest hover:bg-cream"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-bold tabular-nums">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
                        className="grid size-8 place-items-center rounded-full text-forest hover:bg-cream"
                      >
                        +
                      </button>
                    </div>

                    <span className="ml-auto font-display text-2xl text-forest tabular-nums">
                      {formatINR(calculatePrice(line.weightGrams) * line.quantity)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="surface-card p-6 lg:sticky lg:top-28">
            <h2 className="font-display text-xl">Order summary</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-bold tabular-nums text-forest">{formatINR(subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="text-right text-xs text-warm">
                  Calculated during order confirmation
                </dd>
              </div>
            </dl>
            <div className="my-5 rule-gold" />
            <div className="flex items-baseline justify-between">
              <span className="eyebrow">Total</span>
              <span className="font-display text-3xl text-forest tabular-nums">
                {formatINR(subtotal)}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">+ applicable shipping</p>
            <Link
              to="/order"
              className="mt-6 block rounded-full bg-forest px-6 py-4 text-center text-sm font-bold tracking-wide text-primary-foreground uppercase transition-transform hover:scale-[1.02]"
            >
              Continue to customer details
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
