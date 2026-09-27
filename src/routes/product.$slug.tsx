import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Leaf, PackageCheck, Truck } from "lucide-react";
import { WhatsAppIcon } from "@/components/Brand";
import { QuantitySelector } from "@/components/QuantitySelector";
import { Reveal } from "@/components/Reveal";
import { useCart } from "@/lib/cart";
import { BRAND, PRODUCT, calculatePrice, formatINR, formatWeight } from "@/lib/product";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    if (params.slug !== PRODUCT.slug) throw notFound();
    return null;
  },
  head: () => ({
    meta: [
      { title: "Pure Panangarkandu (Palm Candy) | D's PANAI" },
      {
        name: "description",
        content:
          "Buy Pure Panangarkandu (palm candy) online from D's PANAI. Authentic Tamil palm sweetener, starting at 250 g for ₹299 with free delivery across India and worldwide.",
      },
      { property: "og:title", content: "D's PANAI Pure Panangarkandu (Palm Candy)" },
      {
        property: "og:description",
        content:
          "Traditional Tamil Panangarkandu with naturally formed crystals, packed in our illustrated D's PANAI pouch.",
      },
      { property: "og:type", content: "product" },
      {
        property: "og:image",
        content: `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-pack-front.jpg`,
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:image",
        content: `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-pack-front.jpg`,
      },
    ],
    links: [{ rel: "canonical", href: `${BRAND.siteUrl}/product/panangarkandu` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: PRODUCT.name,
          category: PRODUCT.category,
          brand: { "@type": "Brand", name: BRAND.name },
          description: PRODUCT.longDescription,
          image: [
            `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-pack-front.jpg`,
            `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-hero-lifestyle.jpg`,
            `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-crystals-terracotta.jpg`,
          ],
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: PRODUCT.currency,
            lowPrice: calculatePrice(PRODUCT.minWeightGrams),
            highPrice: calculatePrice(PRODUCT.maxWeightGrams),
            offerCount: PRODUCT.allWeights.length,
            offers: PRODUCT.allWeights.map((w) => ({
              "@type": "Offer",
              name: `D's PANAI Pure Panangarkandu - ${formatWeight(w)}`,
              price: calculatePrice(w),
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
              url: `${BRAND.siteUrl}/product/panangarkandu?weight=${w}`,
            })),
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BRAND.siteUrl },
            { "@type": "ListItem", position: 2, name: "Shop", item: `${BRAND.siteUrl}/shop` },
            {
              "@type": "ListItem",
              position: 3,
              name: "Pure Panangarkandu",
              item: `${BRAND.siteUrl}/product/panangarkandu`,
            },
          ],
        }),
      },
    ],
  }),
  component: ProductPage,
});

const PRODUCT_DETAILS = [
  { label: "Origin", value: "Udangudi / Thoothukudi, Tamil Nadu" },
  { label: "Package", value: "Illustrated stand-up pouch with resealable zip" },
  { label: "Best use", value: "Filter coffee, tea, warm milk, and everyday sweetening" },
  { label: "Storage", value: "Cool, dry place with the pouch tightly closed" },
];

function ProductPage() {
  const { addLine } = useCart();
  const [weight, setWeight] = useState(PRODUCT.baseWeightGrams);
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const current = PRODUCT.gallery[active]!;

  return (
    <div className="pb-20 md:pb-16">
      <nav aria-label="Breadcrumb" className="mx-auto max-w-[1240px] px-6 pt-8 md:px-8">
        <ol className="flex items-center gap-2 text-xs text-muted-foreground">
          <li>
            <Link to="/" className="transition-colors hover:text-forest">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-gold">
            /
          </li>
          <li>
            <Link to="/shop" className="transition-colors hover:text-forest">
              Shop
            </Link>
          </li>
          <li aria-hidden="true" className="text-gold">
            /
          </li>
          <li className="font-semibold text-forest">Pure Panangarkandu</li>
        </ol>
      </nav>

      <div className="mx-auto grid max-w-[1240px] gap-12 px-6 py-10 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="min-w-0">
          <div
            onClick={() => setZoom((v) => !v)}
            className="group relative overflow-hidden rounded-[2rem] border border-border bg-white p-3 shadow-soft"
          >
            <img
              src={current.src}
              alt={current.alt}
              width={1024}
              height={1024}
              decoding="async"
              className={cn(
                "aspect-square w-full cursor-zoom-in object-cover transition-transform duration-700",
                zoom && "scale-150 cursor-zoom-out",
              )}
            />
            <span className="absolute top-4 right-4 rounded-full bg-ivory/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-warm backdrop-blur">
              {zoom ? "Reset" : "Zoom"}
            </span>
          </div>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {PRODUCT.gallery.map((img, i) => (
              <button
                key={`${img.src}-${i}`}
                type="button"
                onClick={() => {
                  setActive(i);
                  setZoom(false);
                }}
                aria-label={`View gallery image ${i + 1}`}
                aria-current={i === active}
                className={cn(
                  "size-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                  i === active
                    ? "scale-95 border-gold"
                    : "border-transparent opacity-70 hover:opacity-100",
                )}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="inline-flex rounded-full border border-gold/30 bg-cream/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-earth">
            authentic palmyra sap
          </p>
          <h1 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.5rem)] leading-tight text-forest">
            {PRODUCT.name}
          </h1>
          <p className="mt-2 font-tamil text-xl text-gold">{PRODUCT.tamilName}</p>
          <div className="mt-6 flex items-end gap-3">
            <p className="font-display text-4xl text-forest">{formatINR(calculatePrice(weight))}</p>
            <p className="text-sm text-muted-foreground">for {formatWeight(weight)}</p>
          </div>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            {PRODUCT.longDescription}
          </p>

          <div className="mt-8 rounded-[1.5rem] border border-border bg-white p-5 shadow-soft">
            <QuantitySelector
              weightGrams={weight}
              onWeightChange={setWeight}
              quantity={qty}
              onQuantityChange={setQty}
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => addLine(weight, qty)}
                className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-forest px-6 py-4 text-sm font-bold tracking-[0.14em] text-primary-foreground uppercase transition-transform hover:-translate-y-0.5"
              >
                Add to cart
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href={BRAND.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-forest/20 bg-cream px-6 py-4 text-sm font-bold tracking-[0.14em] text-forest uppercase transition-colors hover:border-gold hover:bg-white"
              >
                <WhatsAppIcon className="size-4" />
                WhatsApp
              </a>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {PRODUCT_DETAILS.map((item) => (
              <div key={item.label} className="rounded-2xl border border-border bg-cream/50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-warm">
                  {item.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-forest">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mx-auto mt-10 max-w-[1240px] px-6 md:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Leaf,
              title: "Natural crystals",
              text: "Naturally formed from palm sap with no artificial color.",
            },
            {
              icon: PackageCheck,
              title: "Freshly packed",
              text: "Sealed in an illustrated D's PANAI pouch for freshness.",
            },
            {
              icon: Truck,
              title: "Free shipping",
              text: "Delivery across India and worldwide, with easy WhatsApp support.",
            },
          ].map((item) => (
            <Reveal key={item.title} className="surface-card p-5">
              <item.icon className="size-6 text-palm" strokeWidth={1.5} />
              <h3 className="mt-4 text-lg text-forest">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-[1240px] px-6 md:px-8">
        <Reveal className="rounded-[2rem] border border-border bg-cream/50 p-8 text-center">
          <p className="section-label">Bulk orders</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,4vw,2.8rem)] text-forest">
            Need more than a family pouch?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            We regularly handle more than {BRAND.monthlyVolumeKg.toLocaleString("en-IN")} kg every
            month for households, gifting, and larger family requirements.
          </p>
          <a
            href={BRAND.whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-forest px-7 py-4 text-sm font-bold tracking-[0.14em] text-primary-foreground uppercase transition-transform hover:-translate-y-0.5"
          >
            <WhatsAppIcon className="size-4" />
            Talk to us on WhatsApp
          </a>
        </Reveal>
      </section>
    </div>
  );
}
