import { Link } from "@tanstack/react-router";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { IMAGES, PRODUCT, calculatePrice, formatINR, formatWeight } from "@/lib/product";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { drawerOpen, setDrawerOpen, lines, subtotal, updateQuantity, removeLine } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setDrawerOpen]);

  return (
    <>
      <div
        onClick={() => setDrawerOpen(false)}
        className={cn(
          "fixed inset-0 z-50 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-500",
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-label="Your order"
        aria-modal={drawerOpen}
        className={cn(
          "fixed z-50 flex flex-col bg-ivory shadow-lift transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
          "inset-x-0 bottom-0 max-h-[86vh] rounded-t-3xl sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[420px] sm:max-h-none sm:rounded-none",
          drawerOpen ? "translate-y-0 sm:translate-x-0" : "translate-y-full sm:translate-y-0 sm:translate-x-full",
        )}
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-xl">Your order</h2>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close cart"
            className="grid size-9 place-items-center rounded-full text-forest transition-colors hover:bg-cream"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <ShoppingBag className="size-8 text-warm" />
              <p className="text-sm text-muted-foreground">Your pouch bag is empty.</p>
              <Link
                to="/product/$slug"
                params={{ slug: PRODUCT.slug }}
                onClick={() => setDrawerOpen(false)}
                className="text-sm font-semibold text-forest underline decoration-gold decoration-2 underline-offset-4"
              >
                Shop Panangarkandu
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map((line) => (
                <li key={line.lineId} className="flex gap-4 rounded-xl border border-border bg-card p-3">
                  <img
                    src={IMAGES.product ?? IMAGES.front ?? PRODUCT.gallery[0]?.src ?? ""}
                    alt={PRODUCT.name}
                    className="size-20 shrink-0 rounded-lg object-cover"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.src = IMAGES.front ?? PRODUCT.gallery[0]?.src ?? "";
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-forest">{PRODUCT.shortName}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatWeight(line.weightGrams)} pouch
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 rounded-full border border-border px-2 py-1">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => updateQuantity(line.lineId, line.quantity - 1)}
                          className="px-1 text-forest"
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-xs font-bold tabular-nums">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
                          className="px-1 text-forest"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-bold tabular-nums text-forest">
                        {formatINR(calculatePrice(line.weightGrams) * line.quantity)}
                      </span>
                      <button
                        type="button"
                        aria-label="Remove item"
                        onClick={() => removeLine(line.lineId)}
                        className="text-warm transition-colors hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <footer className="space-y-3 border-t border-border bg-cream/60 px-5 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-bold tabular-nums text-forest">{formatINR(subtotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Shipping is calculated during order confirmation on WhatsApp.
            </p>
            <Link
              to="/cart"
              onClick={() => setDrawerOpen(false)}
              className="block rounded-full bg-forest px-6 py-3.5 text-center text-sm font-bold text-primary-foreground transition-transform duration-300 hover:scale-[1.02]"
            >
              Proceed to order
            </Link>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="block w-full text-center text-xs font-semibold tracking-wide text-warm uppercase"
            >
              Continue shopping
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}
