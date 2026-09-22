import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Coffee,
  Globe2,
  Leaf,
  Package,
  Scale,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { Reveal, CountUp } from "@/components/Reveal";
import { Ornament, WhatsAppIcon } from "@/components/Brand";
import { Bi } from "@/components/Bilingual";
import { QuantitySelector } from "@/components/QuantitySelector";
import { BRAND, IMAGES, PRODUCT, calculatePrice, formatINR, formatWeight } from "@/lib/product";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        name: "google-site-verification",
        content: "gNiZtRslMcOx60FKcxXBttVF3cRMUbOkMggBwyRSeso",
      },
      { title: "D's PANAI | Pure Panangarkandu Palm Candy" },
      {
        name: "description",
        content:
          "Buy Pure Panangarkandu (palm candy) online from D's PANAI — a 25+ year family trade in our illustrated branded pack. From ₹299 / 250 g. Shipping ₹50 across India, ₹500 worldwide.",
      },
      { property: "og:title", content: "D's PANAI — Pure Panangarkandu (Palm Candy)" },
      {
        property: "og:description",
        content:
          "A traditional Tamil sweetness, carried forward for 25+ years. Order on WhatsApp, shipped worldwide.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: PRODUCT.name,
          alternateName: "",
          category: "Palm Candy",
          description: PRODUCT.longDescription,
          brand: { "@type": "Brand", name: BRAND.name },
          offers: {
            "@type": "Offer",
            price: PRODUCT.basePrice,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
          },
        }),
      },
    ],
  }),
  component: Home,
});

/* ---------------------------------------------------------------- HERO
   Image used here: IMAGES.hero — the wide lifestyle shot of the pouch. */
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(true), []);

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-cream)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-24 -right-24 -z-10 size-[520px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--sand), transparent 65%)" }}
        aria-hidden="true"
      />

      <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-6 pt-12 pb-16 md:px-8 lg:grid-cols-[1.05fr_1fr] lg:pt-20 lg:pb-24">
        <div>
          <p className="section-label animate-rise" style={{ animationDelay: "60ms" }}>
            Palm Candy</p>
          <h1
            className="animate-rise mt-5 font-display text-[clamp(2.5rem,6.6vw,4.5rem)] leading-[1.02]"
            style={{ animationDelay: "160ms" }}
          >
            A timeless sweetness,
            <br />
            <span className="text-palm italic">carried forward.</span>
          </h1>
          <p
            className="animate-rise mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg"
            style={{ animationDelay: "300ms" }}
          >
            Pure Panangarkandu (palm candy) from a family trade of {BRAND.yearsInTrade}+ years —
            packed in our illustrated D's PANAI pack and delivered to your door.
          </p>

          <div
            className="animate-rise mt-8 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "420ms" }}
          >
            <Link
              to="/product/$slug"
              params={{ slug: PRODUCT.slug }}
              className="group inline-flex items-center gap-2 rounded-full bg-forest px-7 py-4 text-sm font-bold tracking-wide text-primary-foreground uppercase transition-all duration-300 hover:shadow-lift"
            >
              Order now<span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <a
              href={BRAND.whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-forest/25 px-7 py-4 text-sm font-bold tracking-wide text-forest uppercase transition-colors duration-300 hover:border-gold hover:bg-cream"
            >
              <WhatsAppIcon className="size-4" />
              WhatsApp us
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-warm">
            <li>✦ {formatINR(PRODUCT.basePrice)} / 250 g</li>
            <li>✦ India shipping {formatINR(BRAND.shippingIndia)}</li>
            <li>✦ Worldwide {formatINR(BRAND.shippingInternational)}</li>
            <li>✦ No online payment needed</li>
          </ul>
        </div>

        <div className="relative">
          <div
            className="relative mx-auto max-w-[560px] transition-all duration-[1400ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
            style={{ opacity: loaded ? 1 : 0, transform: loaded ? "scale(1)" : "scale(0.96)" }}
          >
            <img
              src={IMAGES.hero}
              alt="D's PANAI Panangarkandu branded pack beside palm candy crystals on a wooden table"
              width={1376}
              height={768}
              className="ornate-frame w-full object-cover shadow-lift"
            />
            <p className="caption mt-3 text-center">
              Our D's PANAI pack</p>
            <div className="absolute -bottom-2 -left-3 rounded-2xl border border-gold/40 bg-ivory/95 px-5 py-3 shadow-soft backdrop-blur md:-left-10">
              <p className="eyebrow">Starting at</p>
              <p className="font-display text-2xl text-forest">
                {formatINR(PRODUCT.basePrice)} <span className="text-sm text-warm">/ 250 g</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- TRUST */
const TRUST = [
  {
    icon: Leaf,
    en: "25+ years family trade",
    ta: "",
    body: "The same trade our family has run for over two decades — now online.",
  },
  {
    icon: Sparkles,
    en: "Pure palm candy only",
    ta: "",
    body: "One product, chosen and packed carefully. No mixing, no fillers.",
  },
  {
    icon: Package,
    en: "Recognisable D's PANAI pack",
    ta: "",
    body: "Our illustrated pack keeps the product recognisable from shelf to doorstep.",
  },
  {
    icon: Globe2,
    en: "Worldwide shipping",
    ta: "",
    body: `India ${formatINR(BRAND.shippingIndia)} · International ${formatINR(BRAND.shippingInternational)}.`,
  },
];

function TrustStrip() {
  return (
    <section className="border-y border-border bg-cream/60">
      <div className="mx-auto grid max-w-[1240px] gap-4 px-6 py-12 sm:grid-cols-2 md:px-8 lg:grid-cols-4">
        {TRUST.map((item, i) => (
          <Reveal key={item.en} delay={i * 90} className="surface-card p-6">
            <item.icon className="size-6 text-palm" strokeWidth={1.5} />
            <h3 className="mt-4 text-lg leading-snug">{item.en}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------- WHAT IS PANANGARKANDU
   Image used here: IMAGES.macro — macro shot of the crystals. */
function WhatIsIt() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-20 md:px-8 md:py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <p className="section-label">The tradition</p>
          <Bi
            as="h2"
            className="mt-5 font-display text-[clamp(2rem,4.5vw,3.1rem)] leading-tight"
            en="What is Panangarkandu?"
            ta="?"
            taClassName="text-lg"
          />
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Panangarkandu is palm candy — the crystallised sweetness of palmyra palm sap. In Tamil
            homes it has always been the sweetness kept in the kitchen jar: dropped into filter
            coffee, stirred into warm milk, added to kashayam, or simply given to children as a
            treat.
          </p>
          <ul className="mt-7 space-y-3 text-sm">
            {[
              ["Naturally formed crystals", ""],
              ["No added colour or flavour", ""],
              ["Traditional Tamil kitchen staple", ""],
              ["Sold by weight, from 250 g", ""],
            ].map(([en, ta]) => (
              <li key={en} className="flex gap-3">
                <span className="mt-1 text-gold">✦</span>
                <span>
                  <span className="font-semibold text-forest">{en}</span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={120}>
          <img
            src={IMAGES.macro}
            alt="Macro photograph of golden Panangarkandu palm candy crystals"
            width={1024}
            height={1024}
            loading="lazy"
            className="ornate-frame w-full object-cover"
          />
          <p className="caption mt-3">
            Macro: the natural crystal structure</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- FEATURED PRODUCT
   Image used here: IMAGES.product — the studio pouch photo. */
function FeaturedProduct() {
  const { addLine } = useCart();
  const [weight, setWeight] = useState(PRODUCT.baseWeightGrams);
  const [qty, setQty] = useState(1);

  return (
    <section className="border-y border-border bg-cream/50">
      <div className="mx-auto max-w-[1240px] px-6 py-20 md:px-8 md:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="section-label">The product</p>
          <Bi
            as="h2"
            className="mt-5 font-display text-[clamp(2rem,4.5vw,3.1rem)] leading-tight"
            en="One pouch. One tradition."
            ta=""
            taClassName="text-lg"
          />
          <Ornament className="mt-6" />
        </Reveal>

        <Reveal delay={120} className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
              <img
                src={IMAGES.product}
                alt="D's PANAI Pure Panangarkandu palm candy in its branded pack"
                width={1024}
                height={1024}
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]"
              />
              <span className="absolute top-5 left-5 rounded-full bg-ivory/90 px-3 py-1.5 text-[10px] font-bold tracking-[0.18em] text-forest uppercase backdrop-blur">
                D's PANAI branded pack
              </span>
            </div>
            <p className="caption mt-3">Product photo</p>
          </div>

          <div>
            <h3 className="font-display text-3xl md:text-4xl">{PRODUCT.name}</h3>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {PRODUCT.description}
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
                Add to cart<span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
              <Link
                to="/product/$slug"
                params={{ slug: PRODUCT.slug }}
                className="inline-flex items-center justify-center rounded-full border border-forest/25 px-7 py-4 text-sm font-bold tracking-wide text-forest uppercase transition-colors hover:border-gold hover:bg-cream"
              >
                Full details
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ WAYS TO USE
   Image used here: IMAGES.lifestyle — palm candy served with filter coffee. */
const USES = [
  {
    icon: Coffee,
    en: "In filter coffee & tea",
    ta: "",
    body: "A crystal or two instead of refined sugar in your morning degree coffee.",
  },
  {
    icon: Sparkles,
    en: "In warm milk",
    ta: "",
    body: "The classic way children in Tamil homes are given palm candy.",
  },
  {
    icon: Leaf,
    en: "With kashayam & herbal drinks",
    ta: "",
    body: "Traditionally added to home-made kashayam for taste.",
  },
  {
    icon: ShieldCheck,
    en: "Just as it is",
    ta: "",
    body: "Kept in a jar and eaten plain, the way it always has been.",
  },
];

function WaysToUse() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-20 md:px-8 md:py-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <Reveal>
          <img
            src={IMAGES.lifestyle}
            alt="Panangarkandu palm candy served alongside traditional South Indian filter coffee"
            width={1024}
            height={1024}
            loading="lazy"
            className="ornate-frame w-full object-cover"
          />
          <p className="caption mt-3">Everyday use at home</p>
        </Reveal>
        <Reveal delay={120}>
          <p className="section-label">How families use it</p>
          <Bi
            as="h2"
            className="mt-5 font-display text-[clamp(2rem,4.5vw,3.1rem)] leading-tight"
            en="Four ways palm candy is used"
            ta=""
            taClassName="text-lg"
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {USES.map((u) => (
              <div key={u.en} className="surface-card p-5">
                <u.icon className="size-5 text-palm" strokeWidth={1.5} />
                <h3 className="mt-3 text-base leading-snug">{u.en}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{u.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- HOW WE PACK IT
  Image used here: IMAGES.pouchStudio — detail of the branded pack. */
const STEPS = [
  ["Selected by hand", "", "Crystals are sorted so only clean, well-formed pieces are packed."],
  ["Weighed to your order", "", "From 250 g upwards in 50 g steps — you choose the exact weight."],
  ["Packed with care", "", "Sealed in the illustrated D's PANAI branded pack."],
  ["Shipped & confirmed", "", "Outer protective packing, then dispatched and confirmed on WhatsApp."],
];

function HowWePack() {
  return (
    <section className="border-y border-border bg-cream/50">
      <div className="mx-auto max-w-[1240px] px-6 py-20 md:px-8 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <Reveal>
            <p className="section-label">From our hands to yours</p>
            <Bi
              as="h2"
              className="mt-5 font-display text-[clamp(2rem,4.5vw,3.1rem)] leading-tight"
              en="How your pouch is prepared"
              ta=""
              taClassName="text-lg"
            />
            <ol className="mt-8 space-y-6">
              {STEPS.map(([en, ta, body], i) => (
                <li key={en} className="flex gap-5">
                  <span className="font-display text-2xl text-gold tabular-nums">
                    0{i + 1}
                  </span>
                  <div className="border-l border-border pl-5">
                    <h3 className="text-lg leading-snug">{en}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={120}>
            <img
              src={IMAGES.pouch}
              alt="Detail of the D's PANAI branded pack"
              width={1024}
              height={1024}
              loading="lazy"
              className="ornate-frame w-full object-cover"
            />
            <p className="caption mt-3">Pouch detail</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- HERITAGE
   Image used here: IMAGES.heritage — the family trade photo. */
function HeritageScale() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-20 md:px-8 md:py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <img
            src={IMAGES.heritage}
            alt="A multigenerational Tamil family continuing their traditional palm candy trade"
            width={1024}
            height={1024}
            loading="lazy"
            className="ornate-frame w-full object-cover"
          />
          <p className="caption mt-3">Our family trade</p>
        </Reveal>
        <Reveal delay={120}>
          <p className="section-label">Our story</p>
          <Bi
            as="h2"
            className="mt-5 font-display text-[clamp(2rem,4.5vw,3.1rem)] leading-tight"
            en="A family trade, now online."
            ta=""
            taClassName="text-lg"
          />
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            D's PANAI is not a new brand pretending to be traditional. It is a modern
            consumer-facing brand built on a family trade of more than {BRAND.yearsInTrade} years —
            the same Panangarkandu we have always supplied, now brought directly to your home.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6">
            <div>
              <p className="font-display text-4xl text-forest tabular-nums">
                <CountUp to={BRAND.yearsInTrade} suffix="+" />
              </p>
              <p className="eyebrow mt-2">Years in the trade</p>
            </div>
            <div>
              <p className="font-display text-4xl text-forest tabular-nums">
                <CountUp to={BRAND.monthlyVolumeKg} suffix="+" />
              </p>
              <p className="eyebrow mt-2">kg handled / month</p>
            </div>
            <div>
              <p className="font-display text-4xl text-forest">01</p>
              <p className="eyebrow mt-2">Product we specialise in</p>
            </div>
          </div>
          <Link
            to="/our-story"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-forest/25 px-6 py-3.5 text-sm font-bold tracking-wide text-forest uppercase transition-colors hover:border-gold hover:bg-cream"
          >
            Read our story
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- PRICE + SHIPPING */
function PriceLadder() {
  const { addLine } = useCart();
  return (
    <section className="border-y border-border bg-cream/60">
      <div className="mx-auto max-w-[1240px] px-6 py-20 md:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-label">Simple, honest pricing</p>
            <h2 className="mt-4 font-display text-[clamp(1.75rem,3.6vw,2.75rem)]">
              {formatWeight(PRODUCT.baseWeightGrams)} = {formatINR(PRODUCT.basePrice)}
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Order any quantity from 250 g upwards in 50 g steps. Shipping is a flat{" "}
            {formatINR(BRAND.shippingIndia)} within India and{" "}
            {formatINR(BRAND.shippingInternational)} internationally.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[250, 500, 1000, 2000].map((w, i) => (
            <Reveal key={w} delay={i * 80}>
              <div className="surface-card group flex items-center justify-between p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
                <div>
                  <p className="font-display text-2xl text-forest">{formatWeight(w)}</p>
                  <p className="mt-1 text-sm font-semibold text-gold">
                    {formatINR(calculatePrice(w))}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => addLine(w, 1)}
                  aria-label={`Add ${formatWeight(w)} pouch to cart`}
                  className="grid size-10 place-items-center rounded-full border border-forest/20 text-forest transition-colors group-hover:border-forest group-hover:bg-forest group-hover:text-primary-foreground"
                >
                  +
                </button>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Truck,
              en: `India shipping ${formatINR(BRAND.shippingIndia)}`,
              ta: "",
            },
            {
              icon: Globe2,
              en: `International ${formatINR(BRAND.shippingInternational)}`,
              ta: "",
            },
            { icon: Scale, en: "Any weight, 50 g steps", ta: "" },
          ].map((s) => (
            <div key={s.en} className="flex items-center gap-3 rounded-2xl border border-gold/30 bg-ivory px-5 py-4">
              <s.icon className="size-5 shrink-0 text-palm" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold text-forest">{s.en}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- FAQ */
const FAQS: [string, string, string][] = [
  [
    "Is Panangarkandu the same as palm candy?",
    "?",
    "Yes. Panangarkandu is the Tamil name for palm candy — crystallised palmyra palm sap.",
  ],
  [
    "How do I place an order?",
    "?",
    "Choose your weight, add it to the cart, fill in your delivery details and send the order to us on WhatsApp. We confirm availability and the final total there.",
  ],
  [
    "What are the shipping charges?",
    "?",
    `Flat ${formatINR(BRAND.shippingIndia)} anywhere in India and ${formatINR(BRAND.shippingInternational)} for international orders.`,
  ],
  [
    "Do I have to pay online?",
    "?",
    "No. There is no online payment on this website. Payment is arranged with us directly on WhatsApp after your order is confirmed.",
  ],
  [
    "Can I order in bulk?",
    "?",
    "Yes — we handle large volumes every month. Send us your quantity and city on WhatsApp for a bulk quote.",
  ],
];

function Faq() {
  return (
    <section className="mx-auto max-w-[900px] px-6 py-20 md:px-8">
      <Reveal className="text-center">
        <p className="section-label">Questions</p>
        <Bi
          as="h2"
          className="mt-5 font-display text-[clamp(1.9rem,4vw,2.9rem)]"
          en="Frequently asked"
          ta=""
          taClassName="text-lg"
        />
        <Ornament className="mt-6" />
      </Reveal>
      <div className="mt-10 divide-y divide-border border-y border-border">
        {FAQS.map(([q, qta, a], i) => (
          <Reveal key={q} delay={i * 60}>
            <details className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <span>
                  <span className="font-display text-lg text-forest">{q}</span>
                </span>
                <span className="mt-1 text-gold transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------------------- INSTAGRAM GRID
   Images used here: IMAGES.macro, lifestyle, collection, brand. */
function InstagramSection() {
  const shots: [string, string][] = [
    [IMAGES.macro, "Panangarkandu crystals in close-up"],
    [IMAGES.lifestyle, "Palm candy with filter coffee"],
    [IMAGES.collection, "The D's PANAI pouch range"],
    [IMAGES.brand, "D's PANAI brand still life"],
  ];
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-16 md:px-8">
      <Reveal className="text-center">
        <p className="section-label">Follow the journey</p>
        <Bi
          as="h2"
          className="mt-5 font-display text-[clamp(1.75rem,3.6vw,2.75rem)]"
          en="Inside the tradition"
          ta=""
          taClassName="text-base"
        />
      </Reveal>
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        {shots.map(([src, alt], i) => (
          <Reveal key={`${src}-${i}`} delay={i * 80}>
            <div className="group overflow-hidden rounded-2xl border border-border">
              <img
                src={src}
                alt={alt}
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
              />
            </div>
            <p className="caption mt-2">{alt}</p>
          </Reveal>
        ))}
      </div>
      <div className="mt-8 text-center">
        <a
          href={BRAND.instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-forest/25 px-7 py-4 text-sm font-bold tracking-wide text-forest uppercase transition-colors hover:border-gold hover:bg-cream"
        >
          Follow {BRAND.instagramHandle}
        </a>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- LEAD BANNER */
function LeadBanner() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 pb-20 md:px-8">
      <Reveal>
        <div
          className="ornate-frame overflow-hidden px-8 py-14 text-center"
          style={{ background: "var(--gradient-forest)" }}
        >

        <p className="text-[11px] font-semibold tracking-[0.24em] text-primary-foreground/70 uppercase">
          Order in minutes
        </p>
        <h2 className="mt-4 font-display text-[clamp(1.9rem,4.2vw,3rem)] text-primary-foreground">
          Send your order on WhatsApp
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-primary-foreground/80">
          Your message already includes the product photo, weight, price and your delivery
          address. We confirm availability and the final total right there.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={BRAND.whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-bold tracking-wide text-forest uppercase transition-transform hover:scale-[1.03]"
          >
            <WhatsAppIcon className="size-4" />
            {BRAND.whatsappNumber}
          </a>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/35 px-7 py-4 text-sm font-bold tracking-wide text-primary-foreground uppercase transition-colors hover:bg-primary-foreground/10"
          >
            Browse weights
          </Link>
        </div>
        </div>
      </Reveal>
    </section>
  );
}

function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <WhatIsIt />
      <FeaturedProduct />
      <WaysToUse />
      <HowWePack />
      <HeritageScale />
      <PriceLadder />
      <Faq />
      <InstagramSection />
      <LeadBanner />
    </>
  );
}
