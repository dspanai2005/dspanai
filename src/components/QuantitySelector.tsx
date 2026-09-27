import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { PRODUCT, calculatePrice, formatINR, formatWeight } from "@/lib/product";
import { cn } from "@/lib/utils";

export function QuantitySelector({
  weightGrams,
  onWeightChange,
  quantity,
  onQuantityChange,
}: {
  weightGrams: number;
  onWeightChange: (grams: number) => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
}) {
  const [customOpen, setCustomOpen] = useState(false);
  const [customValue, setCustomValue] = useState(String(weightGrams));
  const [error, setError] = useState<string | null>(null);

  const applyCustom = (raw: string) => {
    setCustomValue(raw);
    const grams = Number(raw);
    if (!Number.isFinite(grams) || grams < PRODUCT.minWeightGrams) {
      setError(`Minimum order is ${formatWeight(PRODUCT.minWeightGrams)}.`);
      return;
    }
    if (grams > PRODUCT.maxWeightGrams) {
      setError(`For orders above ${formatWeight(PRODUCT.maxWeightGrams)}, message us on WhatsApp.`);
      return;
    }
    if (grams % PRODUCT.weightIncrementGrams !== 0) {
      setError(`Please use ${PRODUCT.weightIncrementGrams} g steps.`);
      return;
    }
    setError(null);
    onWeightChange(grams);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-baseline justify-between">
          <span className="eyebrow">Select weight</span>
          <span className="text-xs text-muted-foreground">
            {formatWeight(PRODUCT.baseWeightGrams)} = {formatINR(PRODUCT.basePrice)}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRODUCT.quickWeights.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => {
                onWeightChange(w);
                setCustomValue(String(w));
                setError(null);
              }}
              aria-pressed={weightGrams === w}
              className={cn(
                "min-w-[76px] rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-300",
                weightGrams === w
                  ? "border-forest bg-forest text-primary-foreground shadow-soft"
                  : "border-border bg-card text-forest hover:-translate-y-0.5 hover:border-gold",
              )}
            >
              {formatWeight(w)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCustomOpen((v) => !v)}
            className={cn(
              "rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-300",
              customOpen
                ? "border-gold bg-sand text-forest"
                : "border-dashed border-warm/50 text-warm hover:border-gold hover:text-forest",
            )}
          >
            Custom
          </button>
        </div>

        {customOpen && (
          <div className="mt-4 rounded-xl border border-gold/40 bg-cream/70 p-4">
            <label
              htmlFor="custom-weight"
              className="block text-xs font-semibold tracking-wide text-forest"
            >
              Custom quantity in grams ({PRODUCT.weightIncrementGrams} g steps)
            </label>
            <div className="mt-2 flex items-center gap-3">
              <input
                id="custom-weight"
                type="number"
                inputMode="numeric"
                min={PRODUCT.minWeightGrams}
                step={PRODUCT.weightIncrementGrams}
                value={customValue}
                onChange={(e) => applyCustom(e.target.value)}
                className="w-32 rounded-lg border border-input bg-card px-3 py-2 text-sm font-semibold text-forest"
              />
              <span className="text-sm text-muted-foreground">grams</span>
            </div>
            {error ? (
              <p className="mt-2 text-xs font-medium text-destructive">{error}</p>
            ) : (
              <p className="mt-2 text-xs text-muted-foreground">
                Currently {formatWeight(weightGrams)} · {formatINR(calculatePrice(weightGrams))}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="grid size-10 place-items-center rounded-full text-forest transition-colors hover:bg-cream"
          >
            <Minus className="size-4" />
          </button>
          <span
            aria-live="polite"
            className="w-10 text-center text-base font-bold tabular-nums text-forest"
          >
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => onQuantityChange(Math.min(99, quantity + 1))}
            className="grid size-10 place-items-center rounded-full text-forest transition-colors hover:bg-cream"
          >
            <Plus className="size-4" />
          </button>
        </div>
        <div className="text-right">
          <div className="eyebrow">
            {formatWeight(weightGrams)} × {quantity}
          </div>
          <div className="font-display text-3xl font-semibold text-forest tabular-nums">
            {formatINR(calculatePrice(weightGrams) * quantity)}
          </div>
        </div>
      </div>
    </div>
  );
}
