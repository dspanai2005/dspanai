import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { BRAND, PRODUCT_IMAGES, PRODUCT, calculatePrice, formatINR, formatWeight } from "@/lib/product";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Pure Panangarkandu Palm Candy | D's PANAI" },
      {
        name: "description",
        content:
          "Browse available weights of D's PANAI Pure Panangarkandu (Palm Candy) in our illustrated branded pack — from 250 g to 10 kg. Worldwide shipping.",
      },
      { property: "og:title", content: "Shop Pure Panangarkandu (Palm Candy) — D's PANAI" },
      {
        property: "og:description",
        content: "Traditional Tamil palm candy in our illustrated D's PANAI pouch. Select your weight from 250 g to 10 kg.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-pack-front.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-pack-front.jpg` },
    ],
    links: [{ rel: "canonical", href: `${BRAND.siteUrl}/shop` }],
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
              name: "Shop",
              item: `${BRAND.siteUrl}/shop`,
            },
          ],
        }),
      },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { addLine } = useCart();

  return (
    <div className="mx-auto max-w-[1240px] px-6 py-16 md:px-8 md:py-24">
      <Reveal>
        <p className="eyebrow">Shop Weights</p>
        <h1 className="mt-4 font-display text-[clamp(2.25rem,5.5vw,3.75rem)] leading-tight">
          One product, chosen carefully.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
          We specialize exclusively in Pure Panangarkandu. Choose your weight — from a 250 g pouch to bulk family quantities up to 10 kg — and confirm direct shipping on WhatsApp.
        </p>
      </Reveal>

      <Reveal delay={140} className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <Link
          to="/product/$slug"
          params={{ slug: PRODUCT.slug }}
          className="group block overflow-hidden rounded-3xl border border-border bg-card shadow-soft"
        >
          <img
            src={PRODUCT_IMAGES.front}
            alt="D's PANAI Pure Panangarkandu 500g branded stand-up zipper pouch"
            width={1024}
            height={1024}
            loading="eager"
            decoding="async"
            className="aspect-square w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]"
          />
        </Link>
        <div>
          <h2 className="font-display text-3xl md:text-4xl">{PRODUCT.name}</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {PRODUCT.longDescription}
          </p>
          <p className="mt-6 font-display text-3xl text-forest">
            {formatINR(PRODUCT.basePrice)}{" "}
            <span className="text-base text-warm">/ {formatWeight(PRODUCT.baseWeightGrams)}</span>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/product/$slug"
              params={{ slug: PRODUCT.slug }}
              className="group inline-flex items-center gap-2 rounded-full bg-forest px-7 py-4 text-sm font-bold tracking-wide text-primary-foreground uppercase transition-all hover:shadow-lift"
            >
              Choose quantity
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <button
              type="button"
              onClick={() => addLine(PRODUCT.baseWeightGrams, 1)}
              className="rounded-full border border-forest/25 px-7 py-4 text-sm font-bold tracking-wide text-forest uppercase transition-colors hover:border-gold hover:bg-cream"
            >
              Quick add 250 g
            </button>
          </div>
        </div>
      </Reveal>

      <div className="mt-20">
        <h2 className="font-display text-2xl">All available weights</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCT.allWeights.map((w, i) => (
            <Reveal key={w} delay={i * 50}>
              <div className="surface-card flex items-center justify-between p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
                <div>
                  <p className="font-display text-xl text-forest">{formatWeight(w)}</p>
                  <p className="text-sm font-semibold text-gold">{formatINR(calculatePrice(w))}</p>
                </div>
                <button
                  type="button"
                  onClick={() => addLine(w, 1)}
                  className="rounded-full border border-forest/20 px-4 py-2 text-xs font-bold tracking-wide text-forest uppercase transition-colors hover:bg-forest hover:text-primary-foreground"
                >
                  Add
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
