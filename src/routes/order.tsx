import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, Loader2, Upload } from "lucide-react";
import { OrderLoading } from "@/components/OrderLoading";
import {
  EMPTY_DETAILS,
  useCart,
  type CustomerDetails,
  type ShippingDestination,
} from "@/lib/cart";
import { BRAND, PRODUCT_IMAGES, PRODUCT, calculatePrice, formatINR, formatWeight } from "@/lib/product";
import { placeOrder, uploadPaymentProof } from "@/lib/orders.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "Review & Place Order | D's PANAI" },
      {
        name: "description",
        content:
          "Enter your delivery details, review your Panangarkandu order and place it. We email your invoice and contact you to confirm dispatch.",
      },
      { property: "og:title", content: "Place your Panangarkandu order — D's PANAI" },
      {
        property: "og:description",
        content:
          "Review your order, get a unique order ID, and receive your invoice by email. No online payment required.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-pack-front.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${BRAND.siteUrl}/order` }],
  }),
  component: OrderPage,
});

const REQUIRED: (keyof CustomerDetails)[] = [
  "fullName",
  "mobile",
  "address",
  "city",
  "state",
  "pincode",
];

const PAYMENT_QR_URL =
  "https://dspanai.lovable.app/__l5e/assets-v1/b3f3c6ee-aea6-411d-87a0-d5356b065c8a/dspanai-payment-qr.png";

type FieldDef = {
  key: keyof CustomerDetails;
  label: string;
  type?: string;
  span?: boolean;
  textarea?: boolean;
  select?: { options: { value: string; label: string }[] };
  optional?: boolean;
};

const FIELDS: FieldDef[] = [
  { key: "fullName", label: "Full name" },
  { key: "mobile", label: "Mobile number", type: "tel" },
  { key: "email", label: "Email", type: "email" },
  { key: "address", label: "Address", span: true, textarea: true },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "pincode", label: "Pincode", type: "text" },
  { key: "landmark", label: "Landmark", optional: true },
  {
    key: "country",
    label: "Shipping destination",
    select: {
      options: [
        { value: "India", label: "India (₹50 shipping)" },
        { value: "International", label: "International (₹500 shipping)" },
      ],
    },
  },
  { key: "instructions", label: "Delivery instructions", span: true, textarea: true, optional: true },
];

function OrderPage() {
  const { lines, subtotal, details, setDetails, clearCart } = useCart();
  const [step, setStep] = useState<"details" | "review">("details");
  const [confirmed, setConfirmed] = useState(false);
  const [touched, setTouched] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState<{ orderId: string; emailed: boolean } | null>(null);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const submitOrder = useServerFn(placeOrder);
  const submitPaymentProof = useServerFn(uploadPaymentProof);

  const shipping =
    details.country === "International" ? BRAND.shippingInternational : BRAND.shippingIndia;
  const total = subtotal + shipping;

  const missing = REQUIRED.filter((k) => !details[k].trim());
  const canContinue = missing.length === 0 && confirmed;

  const update = (key: keyof CustomerDetails, value: string) =>
    setDetails({ ...(details ?? EMPTY_DETAILS), [key]: value });

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setOrderError(null);
    try {
      const res = await submitOrder({
        data: {
          fullName: details.fullName,
          mobile: details.mobile,
          whatsapp: details.mobile,
          email: details.email,
          address: details.address,
          city: details.city,
          state: details.state,
          pincode: details.pincode,
          landmark: details.landmark,
          instructions: details.instructions,
          items: lines.map((l) => ({
            weightGrams: l.weightGrams,
            quantity: l.quantity,
            unitPrice: calculatePrice(l.weightGrams),
            lineTotal: calculatePrice(l.weightGrams) * l.quantity,
          })),
          productTotal: subtotal,
          shipping,
          total,
        },
      });
      setPlaced({ orderId: res.orderId, emailed: res.emailedCustomer });
      clearCart();
    } catch (err) {
      setOrderError(
        err instanceof Error ? err.message : "We could not place the order. Please try again.",
      );
    } finally {
      setPlacing(false);
    }
  };

  const handlePaymentProof = async (file: File) => {
    if (!placed) return;
    setUploadingProof(true);
    setPaymentMessage(null);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("We could not read that screenshot."));
        reader.readAsDataURL(file);
      });
      await submitPaymentProof({
        data: { orderId: placed.orderId, fileName: file.name, mimeType: file.type, dataUrl },
      });
      setPaymentMessage("Payment screenshot received. We will verify it before dispatch.");
    } catch (err) {
      setPaymentMessage(err instanceof Error ? err.message : "We could not upload that screenshot.");
    } finally {
      setUploadingProof(false);
    }
  };

  if (placed) {
    return (
      <div className="mx-auto max-w-[760px] px-6 py-20 md:px-8 md:py-28">
        <div className="surface-card p-8 text-center md:p-12">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-forest text-primary-foreground">
            <Check className="size-7" />
          </span>
          <h1 className="mt-6 font-display text-[clamp(1.9rem,4.5vw,2.75rem)]">
            Order placed. Thank you!
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            We have your order and will contact you shortly to confirm availability, the final
            amount and dispatch.
          </p>
          <div className="mt-8 rounded-2xl border border-border bg-ivory p-6">
            <p className="eyebrow">Your order ID</p>
            <p className="mt-2 font-display text-3xl text-forest">{placed.orderId}</p>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            {placed.emailed
              ? "Your invoice PDF and a thank-you note have been emailed to you."
              : "Add an email next time and we will send your invoice PDF automatically."}
          </p>
          <div className="mt-8 grid gap-6 border-t border-border pt-8 text-left md:grid-cols-[180px_1fr] md:items-center">
            <img src={PAYMENT_QR_URL} alt="D's PANAI payment QR code" className="mx-auto w-full max-w-[180px] rounded-xl border border-border" />
            <div>
              <p className="eyebrow">Optional payment</p>
              <h2 className="mt-2 font-display text-xl">Pay now or wait for WhatsApp</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Scan the QR to pay the order total, or wait and we will contact you directly on WhatsApp. Payment is not required to place the order.
              </p>
              <a
                href={BRAND.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex rounded-full bg-forest px-5 py-3 text-xs font-bold tracking-wide text-primary-foreground uppercase"
              >
                Contact us on WhatsApp
              </a>
              <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-forest/25 px-5 py-3 text-xs font-bold tracking-wide text-forest uppercase hover:bg-cream">
                <Upload className="size-4" />
                {uploadingProof ? "Uploading" : "Upload payment screenshot"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  disabled={uploadingProof}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handlePaymentProof(file);
                    e.currentTarget.value = "";
                  }}
                />
              </label>
              {paymentMessage && <p className="mt-3 text-xs text-forest">{paymentMessage}</p>}
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/shop"
              className="rounded-full border border-forest/25 px-7 py-4 text-sm font-bold tracking-wide text-forest uppercase hover:bg-cream"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-[720px] px-6 py-24 text-center md:px-8">
        <h1 className="font-display text-3xl">Nothing to order yet</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Add a pouch of Panangarkandu and your order details will appear here.
        </p>
        <Link
          to="/product/$slug"
          params={{ slug: PRODUCT.slug }}
          className="mt-8 inline-flex rounded-full bg-forest px-7 py-4 text-sm font-bold tracking-wide text-primary-foreground uppercase"
        >
          Shop Panangarkandu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-16 md:px-8 md:py-20">
      <ol className="flex items-center gap-3 text-xs font-semibold tracking-wide uppercase">
        {(["details", "review"] as const).map((s, i) => (
          <li key={s} className="flex items-center gap-3">
            <span
              className={cn(
                "grid size-7 place-items-center rounded-full border text-[11px]",
                step === s || (s === "details" && step === "review")
                  ? "border-forest bg-forest text-primary-foreground"
                  : "border-border text-warm",
              )}
            >
              {i + 1}
            </span>
            <span className={step === s ? "text-forest" : "text-warm"}>
              {s === "details" ? "Customer details" : "Review order"}
            </span>
            {i === 0 && <span className="text-border">———</span>}
          </li>
        ))}
      </ol>

      <h1 className="mt-8 font-display text-[clamp(2rem,5vw,3.25rem)]">
        {step === "details" ? "Where should we deliver?" : "Your order"}
      </h1>

      {step === "details" ? (
        <form
          className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start"
          onSubmit={(e) => {
            e.preventDefault();
            setTouched(true);
            if (canContinue) setStep("review");
          }}
        >
          <div className="surface-card grid gap-5 p-6 sm:grid-cols-2">
            {FIELDS.map((f) => {
              const invalid = touched && !f.optional && !details[f.key].trim();
              return (
                <div key={f.key} className={cn(f.span && "sm:col-span-2")}>
                  <label
                    htmlFor={f.key}
                    className="block text-xs font-semibold tracking-wide text-forest"
                  >
                    {f.label}
                    {!f.optional && <span className="text-destructive"> *</span>}
                  </label>
                  {f.select ? (
                    <select
                      id={f.key}
                      value={details[f.key]}
                      onChange={(e) => update(f.key, e.target.value)}
                      className={cn(
                        "mt-2 w-full rounded-lg border bg-card px-3 py-2.5 text-sm",
                        invalid ? "border-destructive" : "border-input",
                      )}
                    >
                      {f.select.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : f.textarea ? (
                    <textarea
                      id={f.key}
                      rows={3}
                      value={details[f.key]}
                      onChange={(e) => update(f.key, e.target.value)}
                      className={cn(
                        "mt-2 w-full rounded-lg border bg-card px-3 py-2.5 text-sm",
                        invalid ? "border-destructive" : "border-input",
                      )}
                    />
                  ) : (
                    <input
                      id={f.key}
                      type={f.type ?? "text"}
                      value={details[f.key]}
                      onChange={(e) => update(f.key, e.target.value)}
                      className={cn(
                        "mt-2 w-full rounded-lg border bg-card px-3 py-2.5 text-sm",
                        invalid ? "border-destructive" : "border-input",
                      )}
                    />
                  )}
                  {invalid && (
                    <p className="mt-1 text-xs text-destructive">{f.label} is required.</p>
                  )}
                </div>
              );
            })}

            <label className="flex items-start gap-3 sm:col-span-2">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1 size-4 accent-[var(--forest)]"
              />
              <span className="text-sm text-muted-foreground">
                I confirm that the above details are correct.
              </span>
            </label>
          </div>

          <aside className="surface-card p-6 lg:sticky lg:top-28">
            <OrderSummary />
            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-forest px-6 py-4 text-sm font-bold tracking-wide text-primary-foreground uppercase transition-transform hover:scale-[1.02]"
            >
              Review order
            </button>
            {touched && !canContinue && (
              <p className="mt-3 text-xs text-destructive">
                Please complete the required fields and confirm your details.
              </p>
            )}
          </aside>
        </form>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start">
          <div className="space-y-6">
            <div className="surface-card p-6">
              <h2 className="font-display text-xl">Product</h2>
              <ul className="mt-4 space-y-4">
                {lines.map((l) => (
                  <li key={l.lineId} className="flex gap-4">
                    <img
                      src={PRODUCT_IMAGES.front}
                      alt={PRODUCT.name}
                      loading="lazy"
                      decoding="async"
                      className="size-20 rounded-lg object-cover border border-border"
                    />
                    <div className="text-sm">
                      <p className="font-semibold text-forest">{PRODUCT.name}</p>
                      <p className="mt-1 text-muted-foreground">
                        {formatWeight(l.weightGrams)} · Qty {l.quantity}
                      </p>
                      <p className="font-bold text-forest tabular-nums">
                        {formatINR(calculatePrice(l.weightGrams) * l.quantity)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface-card p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl">Customer</h2>
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="text-xs font-semibold tracking-wide text-warm uppercase hover:text-forest"
                >
                  Edit details
                </button>
              </div>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                {(
                  [
                    ["Name", details.fullName],
                    ["Phone", details.mobile],
                    ["Email", details.email],
                    ["Address", details.address],
                    ["City", details.city],
                    ["State", details.state],
                    ["Pincode", details.pincode],
                    ["Landmark", details.landmark],
                    ["Instructions", details.instructions],
                  ] as const
                )
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs tracking-wide text-warm uppercase">{k}</dt>
                      <dd className="text-forest">{v}</dd>
                    </div>
                  ))}
              </dl>
            </div>

          </div>

          <aside className="surface-card p-6 lg:sticky lg:top-28">
            <OrderSummary />
            <button
              type="button"
              disabled={placing}
              onClick={handlePlaceOrder}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-4 text-sm font-bold tracking-wide text-primary-foreground uppercase transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              {placing && <Loader2 className="size-4 animate-spin" />}
              {placing ? "Placing order" : "Place order"}
            </button>
            {placing && <OrderLoading label="Creating your order" />}
            {orderError && <p className="mt-3 text-xs text-destructive">{orderError}</p>}
            <p className="mt-4 text-xs text-muted-foreground">
              Your invoice PDF will be emailed as soon as this order is created.
            </p>
          </aside>
        </div>
      )}
    </div>
  );

  function OrderSummary() {
    return (
      <>
        <h2 className="font-display text-xl">Order summary</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Product total</dt>
            <dd className="font-bold tabular-nums text-forest">{formatINR(subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd className="text-right text-xs text-warm">To be confirmed</dd>
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
      </>
    );
  }
}
