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
                if (weightGrams !== w) onQuantityChange(1);
                onWeightChange(w);
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
        </div>
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
