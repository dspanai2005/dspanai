import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
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
          "Buy Pure Panangarkandu (palm candy) online from D's PANAI. Authentic Tamil palm sweetener, starting at 250 g for ₹299. Shipping flat ₹50 across India, ₹500 worldwide.",
      },
      { property: "og:title", content: "D's PANAI Pure Panangarkandu (Palm Candy)" },
      {
        property: "og:description",
        content:
          "Traditional Tamil Panangarkandu with naturally formed crystals, packed in our illustrated D's PANAI pouch.",
      },
      { property: "og:type", content: "product" },
      { property: "og:image", content: `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-pack-front.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-pack-front.jpg` },
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
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: BRAND.siteUrl,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Shop",
              item: `${BRAND.siteUrl}/shop`,
            },
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

const DETAIL_SECTIONS = [
  {
    title: "What is Panangarkandu?",
    body: "Panangarkandu (also called Panakarkandu or palm candy) is a traditional crystalline sweetener produced by evaporating the sap of the palmyra palm (Borassus flabellifer). The sap is boiled down slowly and left to crystallize naturally over time. It has been used for generations in Tamil culinary tradition.",
  },
  {
    title: "Packaging & Heritage",
    body: "Each pouch is packed in our illustrated D's PANAI stand-up zipper bag, featuring palm tree artwork and origin details from Udangudi / Thoothukudi, Tamil Nadu, India.",
  },
  {
    title: "Natural Crystal Variation Notice",
    body: "Because Panangarkandu is a 100% natural, unrefined sweetener, individual crystals naturally vary in size, color gradient (ranging from light honey to deep amber), and shape from batch to batch. This variation is a mark of authentic palm sap crystallization.",
  },
  {
    title: "Recommended Storage",
    body: "Store in a cool, dry pantry away from direct moisture and humidity. Once opened, keep the pouch zipper securely closed or transfer crystals to a clean glass/ceramic kitchen container.",
  },
  {
    title: "Everyday Culinary Uses",
    body: "Stir into degree filter coffee or tea, mix with warm milk, blend into traditional Tamil beverages, or consume as a natural sweetener.",
  },
];

function ProductPage() {
  const { addLine } = useCart();
  const [weight, setWeight] = useState(PRODUCT.baseWeightGrams);
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const gallery = PRODUCT.gallery;
  const current = gallery[active]!;

  return (
    <div className="pb-28 md:pb-16">
      <nav aria-label="Breadcrumb" className="mx-auto max-w-[1240px] px-6 pt-8 md:px-8">
        <ol className="flex items-center gap-2 text-xs text-muted-foreground">
          <li>
            <Link to="/" className="transition-colors hover:text-forest">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-gold">/</li>
          <li>
            <Link to="/shop" className="transition-colors hover:text-forest">
              Shop
            </Link>
          </li>
          <li aria-hidden="true" className="text-gold">/</li>
          <li className="font-semibold text-forest">Pure Panangarkandu</li>
        </ol>
      </nav>

      <div className="mx-auto grid max-w-[1240px] gap-12 px-6 py-10 md:px-8 lg:grid-cols-[1.05fr_1fr]">
        <div className="min-w-0">
          <div
            onClick={() => setZoom((v) => !v)}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-soft"
          >
            <img
              src={current.src}
              alt={current.alt}
              width={1024}
              height={1024}
              decoding="async"
              className={cn(
                "aspect-square w-full cursor-zoom-in object-cover transition-transform duration-[900ms]",
                zoom && "scale-150 cursor-zoom-out",
              )}
            />
            <span className="absolute top-4 right-4 rounded-full bg-ivory/90 px-3 py-1 text-[11px] font-semibold text-warm backdrop-blur">
              {zoom ? "Click to reset" : "Click to zoom"}
            </span>
          </div>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {gallery.map((img, i) => (
              <button
                key={img.src + i}
                type="button"
                onClick={() => {
                  setActive(i);
                  setZoom(false);
                }}
                aria-label={`View product gallery image ${i + 1}`}
                aria-current={i === active}
                className={cn(
                  "size-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                  i === active ? "border-gold shadow-sm scale-95" : "border-transparent opacity-70 hover:opacity-100",
                )}
              >
                <img src={img.src} alt={img.alt} loading="lazy" decoding="async" className="size-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="status-pill border border-gold/30 bg-cream/70 text-earth">
            Authentic Palmyra Sap
          </span>
          <h1 className="mt-3 font-display text-[clamp(2rem,4.6vw,3.25rem)] leading-tight text-forest">
            {PRODUCT.name}
          </h1>
          <p className="font-tamil mt-2 text-xl text-gold">{PRODUCT.tamilName}</p>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            {PRODUCT.longDescription}
          </p>

          <div className="my-8 rule-gold" />

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
              className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-forest px-7 py-4 text-sm font-bold tracking-wide text-primary-foreground uppercase transition-all duration-300 hover:shadow-lift"
            >
              Add to cart
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
            <a
              href={BRAND.whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-forest/25 px-6 py-4 text-sm font-bold tracking-wide text-forest uppercase transition-colors hover:border-gold hover:bg-cream"
            >
              <WhatsAppIcon className="size-4" />
              Ask us on WhatsApp
            </a>
          </div>

          <dl className="mt-10 divide-y divide-border border-y border-border">
            {DETAIL_SECTIONS.map((s) => (
              <div key={s.title} className="py-5">
                <dt className="font-display text-xl text-forest">{s.title}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-6 md:px-8">
        <Reveal className="surface-card p-8 text-center">
          <h2 className="font-display text-2xl text-forest">Need bulk quantities for family functions or wholesale?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We regularly handle {BRAND.monthlyVolumeKg.toLocaleString("en-IN")}+ kg every month for wholesale and bulk orders. Message us on WhatsApp to discuss bulk rates and dispatch timelines.
          </p>
          <a
            href={BRAND.whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 text-sm font-bold text-primary-foreground uppercase tracking-wide transition-transform hover:scale-[1.02]"
          >
            <WhatsAppIcon className="size-4" />
            Talk to us on WhatsApp
          </a>
        </Reveal>
      </div>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-ivory/95 px-4 py-3 backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <p className="text-[11px] font-semibold text-warm">
              {formatWeight(weight)} × {qty}
            </p>
            <p className="font-display text-xl leading-none text-forest tabular-nums">
              {formatINR(calculatePrice(weight) * qty)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => addLine(weight, qty)}
            className="flex-1 rounded-full bg-forest px-5 py-3.5 text-sm font-bold tracking-wide text-primary-foreground uppercase"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
