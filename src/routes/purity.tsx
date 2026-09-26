import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { BRAND, PRODUCT_IMAGES, PRODUCT } from "@/lib/product";

export const Route = createFileRoute("/purity")({
  head: () => ({
    meta: [
      { title: "Authentic Purity & Selection | D's PANAI Panangarkandu" },
      {
        name: "description",
        content:
          "Discover how D's PANAI selects authentic pure Panangarkandu (palm candy) and packs it in our illustrated stand-up zipper pouch.",
      },
      { property: "og:title", content: "Pure Panangarkandu — Authentic Tamil Palm Sweetener" },
      {
        property: "og:description",
        content: "Our commitment to single-product focus, natural palmyra sap crystals, and transparent standards.",
      },
      { property: "og:type", content: "article" },
      { property: "og:image", content: `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-purity-ice-concept.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-purity-ice-concept.jpg` },
    ],
    links: [{ rel: "canonical", href: `${BRAND.siteUrl}/purity` }],
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
              name: "Purity & Selection",
              item: `${BRAND.siteUrl}/purity`,
            },
          ],
        }),
      },
    ],
  }),
  component: Purity,
});

const PILLARS = [
  {
    title: "Dedicated Single-Product Focus",
    body: "We specialize exclusively in pure Panangarkandu. All our attention and sourcing expertise goes into bringing you authentic palmyra palm candy.",
  },
  {
    title: "25+ Years Family Trade",
    body: "Our family has traded palm candy across generations from Udangudi / Thoothukudi. That hands-on experience guides our selection.",
  },
  {
    title: "Careful Crystal Selection",
    body: "Every batch is inspected before packing so that what reaches your doorstep is clean, well-crystallized palm candy.",
  },
  {
    title: "Illustrated Stand-Up Pouch",
    body: "Sealed in our illustrated D's PANAI zipper pouch designed to maintain freshness during transit and storage.",
  },
  {
    title: "Direct WhatsApp Ordering",
    body: "Order directly with us via WhatsApp. No third-party markups or middle-man delays.",
  },
  {
    title: "Transparent & Defensible Standards",
    body: "We describe our product accurately as a traditional natural sweetener. We make no unverified medical or health claims.",
  },
];

function Purity() {
  return (
    <div>
      <section className="mx-auto max-w-[1240px] px-6 pt-20 pb-10 md:px-8">
        <p className="eyebrow">Purity & Selection</p>
        <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.25rem,6vw,4.25rem)] leading-[1.02]">
          One product. One tradition.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Panangarkandu is a natural sweetener with a rich heritage in Tamil cuisine. We present it facts-first, keeping our standards clear and honest.
        </p>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 py-10 md:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 80} className="surface-card p-7">
              <span className="font-display text-2xl text-gold tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-3 text-xl font-display text-forest">{p.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-10 border-y border-border bg-cream/50">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-6 py-20 md:px-8 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <img
              src={PRODUCT_IMAGES.purity}
              alt="Artistic concept shot of D's PANAI Panangarkandu pouch encased in crystal clear ice block"
              width={787}
              height={1400}
              loading="lazy"
              decoding="async"
              className="w-full rounded-3xl object-cover shadow-soft border border-border"
            />
          </Reveal>
          <Reveal delay={120}>
            <h2 className="font-display text-[clamp(1.75rem,3.6vw,2.75rem)] leading-tight text-forest">
              Honest & Defensible Standards
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Panangarkandu is an unrefined natural sweetener with a long history of use in Tamil households. It is a traditional kitchen ingredient. We never claim it cures disease, is low-calorie, or acts as a medical drug.
            </p>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Our packaging is clearly illustrated on every pouch, sealed securely to keep your palm candy clean and fresh.
            </p>
            <Link
              to="/product/$slug"
              params={{ slug: PRODUCT.slug }}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest px-7 py-4 text-sm font-bold tracking-wide text-primary-foreground uppercase transition-transform hover:scale-[1.02]"
            >
              Order Panangarkandu →
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
