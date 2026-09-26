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
import { BRAND, PRODUCT_IMAGES, PRODUCT, calculatePrice, formatINR, formatWeight } from "@/lib/product";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        name: "google-site-verification",
        content: "nEeYb1-BNxjD9Rl2vWeqB2rdy9Ic-F_zsSYLEGRn9XY",
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
          "Traditional Tamil Pure Panangarkandu palm candy with natural crystals, from our family trade of 25+ years.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-hero-lifestyle.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-hero-lifestyle.jpg` },
    ],
    links: [{ rel: "canonical", href: "https://www.dspanaitraditions.in/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProductGroup",
          name: PRODUCT.name,
          description: PRODUCT.longDescription,
          brand: { "@type": "Brand", name: BRAND.name },
          url: BRAND.siteUrl,
          productGroupID: "dspanai-panangarkandu-group",
          variesBy: ["https://schema.org/weight"],
          hasVariant: PRODUCT.allWeights.map((w) => ({
            "@type": "Product",
            name: `D's PANAI Pure Panangarkandu (${formatWeight(w)})`,
            sku: `dspanai-panangarkandu-${w}g`,
            weight: {
              "@type": "QuantitativeValue",
              value: w,
              unitCode: "GRM",
            },
            image: `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-pack-front.jpg`,
            offers: {
              "@type": "Offer",
              price: calculatePrice(w),
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
              url: `${BRAND.siteUrl}/product/panangarkandu?weight=${w}`,
            },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: BRAND.name,
          alternateName: BRAND.tamilName,
          url: BRAND.siteUrl,
          logo: `${BRAND.siteUrl}/favicon.png`,
          sameAs: [BRAND.instagramUrl],
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+91-9677892457",
            contactType: "customer service",
            availableLanguage: ["English", "Tamil"],
          },
        }),
      },
    ],
  }),
  component: Home,
});

/* ---------------------------------------------------------------- HERO
   Image: PRODUCT_IMAGES.hero — wide editorial lifestyle shot of the pouch & coffee setup. */
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
            Pure Panangarkandu / Palm Candy
          </p>
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
            packed in our illustrated D's PANAI pouch and delivered to your door.
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
            <li>✦ Direct WhatsApp confirmation</li>
          </ul>
        </div>

        <div className="relative">
          <div
            className="relative mx-auto max-w-[560px] transition-all duration-[1400ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
            style={{ opacity: loaded ? 1 : 0, transform: loaded ? "scale(1)" : "scale(0.96)" }}
          >
            <img
              src={PRODUCT_IMAGES.hero}
              alt="D's PANAI Panangarkandu pouch alongside traditional South Indian brass filter coffee and amber palm candy crystals"
              width={1122}
              height={1402}
              loading="eager"
              decoding="async"
              className="ornate-frame w-full object-cover shadow-lift"
            />
            <p className="caption mt-3 text-center">Our illustrated D's PANAI pack</p>
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
    body: "Our illustrated pouch keeps the product recognisable from shelf to doorstep.",
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
   Image: PRODUCT_IMAGES.crystals — authentic crystals with pouch shot. */
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
            ta="பனங்கற்கண்டு என்றால் என்ன?"
            taClassName="text-lg"
          />
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Panangarkandu (also called Panakarkandu or palm candy) is a traditional crystalline sweetener made from palmyra palm sap. In Tamil homes, it has always been the sweetener kept in the kitchen jar — stirred into filter coffee, warm milk, herbal drinks, or enjoyed as a natural treat.
          </p>
          <ul className="mt-7 space-y-3 text-sm">
            {[
              ["Naturally formed amber crystals", "இயற்கையான படிகங்கள்"],
              ["No added colour, preservatives, or refined sugar", "செயற்கை நிறமிகள் இல்லை"],
              ["Traditional Tamil kitchen staple for generations", "பாரம்பரிய சுவை"],
              ["Packed by weight from 250 g up to 10 kg", "விருப்பமான அளவு"],
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
            src={PRODUCT_IMAGES.crystals}
            alt="D's PANAI Panangarkandu pouch displayed with authentic amber palm candy crystals and terracotta bowl"
            width={787}
            height={1400}
            loading="lazy"
            decoding="async"
            className="ornate-frame w-full object-cover"
          />
          <p className="caption mt-3">Authentic Panangarkandu crystals</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- FEATURED PRODUCT
   Image: PRODUCT_IMAGES.front — clean primary studio product shot. */
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
                src={PRODUCT_IMAGES.front}
                alt="D's PANAI Pure Panangarkandu 500g branded stand-up zipper pouch front packaging view"
                width={1024}
                height={1024}
                loading="lazy"
                decoding="async"
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
   Image: PRODUCT_IMAGES.lifestyle — human kitchen usage scene. */
const USES = [
  {
    icon: Coffee,
    en: "In degree filter coffee & tea",
    ta: "",
    body: "Add a crystal or two to your daily degree filter coffee for a rich caramel notes.",
  },
  {
    icon: Sparkles,
    en: "In warm milk",
    ta: "",
    body: "The traditional Tamil family recipe for soothing warm milk at night.",
  },
  {
    icon: Leaf,
    en: "With herbal preparations",
    ta: "",
    body: "Stirred into traditional home-made kashayam for natural sweetness.",
  },
  {
    icon: ShieldCheck,
    en: "Straight from the kitchen jar",
    ta: "",
    body: "Kept in a ceramic kitchen jar and enjoyed plain, as Tamil families have done for decades.",
  },
];

function WaysToUse() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-20 md:px-8 md:py-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <Reveal>
          <img
            src={PRODUCT_IMAGES.lifestyle}
            alt="Scooping authentic D's PANAI Panangarkandu into coffee in a home kitchen setting"
            width={787}
            height={1400}
            loading="lazy"
            decoding="async"
            className="ornate-frame w-full object-cover"
          />
          <p className="caption mt-3">Everyday kitchen use</p>
        </Reveal>
        <Reveal delay={120}>
          <p className="section-label">How families use it</p>
          <Bi
            as="h2"
            className="mt-5 font-display text-[clamp(2rem,4.5vw,3.1rem)] leading-tight"
            en="Four traditional ways to enjoy palm candy"
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
   Image: PRODUCT_IMAGES.detail — close-up pouch detail & paper texture. */
const STEPS = [
  ["Selected by hand", "", "Crystals are selected so clean, well-formed pieces are packed."],
  ["Weighed to your order", "", "From 250 g up to 10 kg in 50 g steps — choose your required weight."],
  ["Sealed in D's PANAI pouch", "", "Sealed in our illustrated stand-up pouch to protect freshness."],
  ["Shipped & confirmed", "", "Secure outer packaging, dispatched and confirmed directly on WhatsApp."],
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
              src={PRODUCT_IMAGES.detail}
              alt="Close-up macro detail of D's PANAI gold emblem, logo, and organic pouch paper texture"
              width={1024}
              height={1024}
              loading="lazy"
              decoding="async"
              className="ornate-frame w-full object-cover"
            />
            <p className="caption mt-3">Pouch craftsmanship & seal</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- HERITAGE
   Image: PRODUCT_IMAGES.heritage — traditional coffee pairing still life. */
function HeritageScale() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-20 md:px-8 md:py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <img
            src={PRODUCT_IMAGES.heritage}
            alt="Traditional tea and filter coffee pairing with D's PANAI Panangarkandu and natural crystals"
            width={1024}
            height={1024}
            loading="lazy"
            decoding="async"
            className="ornate-frame w-full object-cover"
          />
          <p className="caption mt-3">Family trade & heritage</p>
        </Reveal>
        <Reveal delay={120}>
          <p className="section-label">Our story</p>
          <Bi
            as="h2"
            className="mt-5 font-display text-[clamp(2rem,4.5vw,3.1rem)] leading-tight"
            en="A 25+ year family trade, now direct to your door."
            ta=""
            taClassName="text-lg"
          />
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            D's PANAI is rooted in a family trade of more than {BRAND.yearsInTrade} years from Udangudi / Thoothukudi in Tamil Nadu. The same authentic Panangarkandu we have always traded is now packed in our illustrated pouch and delivered across India and worldwide.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6">
            <div>
              <p className="font-display text-4xl text-forest tabular-nums">
                <CountUp to={BRAND.yearsInTrade} suffix="+" />
              </p>
              <p className="eyebrow mt-2">Years in trade</p>
            </div>
            <div>
              <p className="font-display text-4xl text-forest tabular-nums">
                <CountUp to={BRAND.monthlyVolumeKg} suffix="+" />
              </p>
              <p className="eyebrow mt-2">kg handled / month</p>
            </div>
            <div>
              <p className="font-display text-4xl text-forest">01</p>
              <p className="eyebrow mt-2">Dedicated product focus</p>
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
            <p className="section-label">Simple, transparent pricing</p>
            <h2 className="mt-4 font-display text-[clamp(1.75rem,3.6vw,2.75rem)]">
              {formatWeight(PRODUCT.baseWeightGrams)} = {formatINR(PRODUCT.basePrice)}
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Order any quantity from 250 g upwards in 50 g steps. Flat{" "}
            {formatINR(BRAND.shippingIndia)} shipping across India and{" "}
            {formatINR(BRAND.shippingInternational)} worldwide.
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
              en: `India shipping flat ${formatINR(BRAND.shippingIndia)}`,
              ta: "",
            },
            {
              icon: Globe2,
              en: `International flat ${formatINR(BRAND.shippingInternational)}`,
              ta: "",
            },
            { icon: Scale, en: "Any weight in 50 g steps", ta: "" },
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
    "Yes. Panangarkandu (also spelled Panakarkandu) is the Tamil name for palm candy — crystallised sweetness made from palmyra palm sap.",
  ],
  [
    "How do I place an order?",
    "?",
    "Select your desired weight, add it to your cart, fill in your delivery details, and click send on WhatsApp. We confirm order details and dispatch status right on WhatsApp.",
  ],
  [
    "What are the shipping charges?",
    "?",
    `Flat ${formatINR(BRAND.shippingIndia)} anywhere in India and ${formatINR(BRAND.shippingInternational)} for international delivery.`,
  ],
  [
    "Do I need to pay online on this site?",
    "?",
    "No online payment is collected on this website. Payment details are shared and confirmed directly on WhatsApp.",
  ],
  [
    "Can I order in bulk?",
    "?",
    "Yes — we handle bulk quantities of up to 2,500+ kg monthly. Message us on WhatsApp with your requested weight and delivery location for bulk pricing.",
  ],
];

function Faq() {
  return (
    <section className="mx-auto max-w-[900px] px-6 py-20 md:px-8">
      <Reveal className="text-center">
        <p className="section-label">Questions & Answers</p>
        <Bi
          as="h2"
          className="mt-5 font-display text-[clamp(1.9rem,4vw,2.9rem)]"
          en="Frequently asked questions"
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
   Images: PRODUCT_IMAGES.natural, kitchen, spoon, purity — zero repetition! */
function InstagramSection() {
  const shots: [string, string][] = [
    [PRODUCT_IMAGES.natural, "Outdoor garden photoshoot scene with D's PANAI pouch"],
    [PRODUCT_IMAGES.kitchen, "D's PANAI pouch with ceramic jar in warm home kitchen setting"],
    [PRODUCT_IMAGES.spoon, "Clean studio shot of D's PANAI pouch with serving spoon"],
    [PRODUCT_IMAGES.purity, "Artistic concept of D's PANAI pouch encased in clear ice block"],
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
                decoding="async"
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
            Your message includes the product name, selected weight, total price, and your delivery address. We confirm availability and order total right away.
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
