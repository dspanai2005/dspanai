import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, Globe2, Leaf, ShieldCheck, Truck } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { WhatsAppIcon } from "@/components/Brand";
import { QuantitySelector } from "@/components/QuantitySelector";
import {
  BRAND,
  PRODUCT_IMAGES,
  PRODUCT,
  calculatePrice,
  formatINR,
  formatWeight,
} from "@/lib/product";
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
          "Pure Panangarkandu (palm candy) from D's PANAI, a Tamil family trade rooted in Udangudi. Choose your weight, from 250 g to 10 kg, with free shipping across India and worldwide.",
      },
      { property: "og:title", content: "D's PANAI — Pure Panangarkandu (Palm Candy)" },
      {
        property: "og:description",
        content:
          "Traditional Tamil palm candy with naturally formed amber crystals, packed in D's PANAI's illustrated pouch.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:image",
        content: `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-hero-lifestyle.jpg`,
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:image",
        content: `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-hero-lifestyle.jpg`,
      },
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

const TRUST_ITEMS = [
  { icon: Leaf, title: "25+ years in trade", text: "A family tradition rooted in Tamil Nadu." },
  {
    icon: ShieldCheck,
    title: "Pure palm sugar",
    text: "Natural crystals, no fillers, no additives.",
  },
  { icon: Globe2, title: "Free shipping", text: "Across India and worldwide." },
  { icon: Truck, title: "Direct order support", text: "Confirmed through WhatsApp with ease." },
];

const FAQS = [
  {
    q: "What is Panangarkandu?",
    a: "Panangarkandu is the Tamil name for palm candy, made from the sap of the palmyra palm and crystallised naturally.",
  },
  {
    q: "How do I order?",
    a: "Choose your pack, add it to cart, fill in your delivery details, and we confirm your order on WhatsApp.",
  },
  {
    q: "Is shipping free?",
    a: "Yes. We offer free shipping within India and internationally on our product orders.",
  },
];

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(224,184,114,0.26),transparent_35%),linear-gradient(180deg,#fffdf8_0%,#f7f0e4_100%)]"
        aria-hidden="true"
      />
      <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-6 py-12 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-earth">
            Pure Panangarkandu · Palm Candy
          </p>
          <h1 className="font-display text-[clamp(2.6rem,7vw,5rem)] leading-[0.96] text-forest">
            Traditional Tamil sweetness,
            <span className="mt-2 block text-gold">in a single pouch.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            D's PANAI brings authentic palm candy from Udangudi, Tamil Nadu — naturally
            crystallised, carefully packed, and ready for your home.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/product/$slug"
              params={{ slug: PRODUCT.slug }}
              className="group inline-flex items-center gap-2 rounded-full bg-forest px-7 py-4 text-sm font-bold tracking-[0.14em] text-primary-foreground uppercase transition-transform hover:-translate-y-0.5"
            >
              Shop Panangarkandu
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={BRAND.whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-white/40 px-7 py-4 text-sm font-bold tracking-[0.14em] text-forest uppercase transition-colors hover:border-gold hover:bg-cream"
            >
              <WhatsAppIcon className="size-4" />
              WhatsApp us
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-warm">
            <li>Starts at {formatINR(PRODUCT.basePrice)} / 250 g</li>
            <li>Free shipping in India</li>
            <li>Worldwide delivery</li>
          </ul>
        </div>

        <div className="relative">
          <div className="brand-photo relative mx-auto max-w-[560px] overflow-hidden rounded-[2rem] border border-border bg-white p-3 shadow-[0_28px_60px_-26px_rgba(26,23,20,0.28)]">
            <img
              src={PRODUCT_IMAGES.front}
              alt="D's PANAI Pure Panangarkandu pouch on a wooden table with natural palm candy crystals"
              width={1024}
              height={1024}
              loading="eager"
              decoding="async"
              className="w-full rounded-[1.5rem] object-cover"
            />
            <div className="absolute -bottom-4 left-6 rounded-2xl border border-gold/30 bg-ivory/95 px-4 py-3 shadow-soft backdrop-blur">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-warm">
                Starting from
              </p>
              <p className="mt-1 font-display text-2xl text-forest">
                {formatINR(PRODUCT.basePrice)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductQuickBuy() {
  const { addLine } = useCart();
  const [weight, setWeight] = useState(PRODUCT.baseWeightGrams);
  const [qty, setQty] = useState(1);

  return (
    <section className="border-y border-border bg-cream/60">
      <div className="mx-auto grid max-w-[1240px] gap-8 px-6 py-16 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <Reveal>
          <div className="brand-photo overflow-hidden rounded-[2rem] border border-border bg-white p-3 shadow-soft">
            <img
              src={PRODUCT_IMAGES.hero}
              alt="D's PANAI Panangarkandu pouch with natural crystals and traditional South Indian coffee setup"
              width={1200}
              height={1200}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full rounded-[1.5rem] object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={100}>
          <p className="section-label">The product</p>
          <h2 className="mt-5 font-display text-[clamp(2.1rem,5vw,3.3rem)] leading-tight text-forest">
            Pure Panangarkandu, packed simply and well.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            {PRODUCT.longDescription}
          </p>

          <div className="mt-8 rounded-[1.5rem] border border-border bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-warm">
                  Selected weight
                </p>
                <p className="mt-2 font-display text-3xl text-forest">{formatWeight(weight)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-warm">Total</p>
                <p className="mt-2 font-display text-3xl text-forest">
                  {formatINR(calculatePrice(weight) * qty)}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <QuantitySelector
                weightGrams={weight}
                onWeightChange={setWeight}
                quantity={qty}
                onQuantityChange={setQty}
              />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => addLine(weight, qty)}
                className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-forest px-6 py-4 text-sm font-bold tracking-[0.14em] text-primary-foreground uppercase transition-transform hover:-translate-y-0.5"
              >
                Add to cart
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </button>
              <Link
                to="/product/$slug"
                params={{ slug: PRODUCT.slug }}
                className="inline-flex items-center justify-center rounded-full border border-forest/20 bg-cream px-6 py-4 text-sm font-bold tracking-[0.14em] text-forest uppercase transition-colors hover:border-gold hover:bg-white"
              >
                Details
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function WhyItMatters() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-20 md:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="section-label">Why customers return</p>
        <h2 className="mt-5 font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-forest">
          One ingredient. One honest product.
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {TRUST_ITEMS.map((item, index) => (
          <Reveal key={item.title} delay={index * 80}>
            <div className="surface-card brand-card h-full p-5">
              <item.icon className="size-6 text-palm" strokeWidth={1.5} />
              <h3 className="mt-4 text-lg leading-snug text-forest">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function StorySection() {
  return (
    <section className="border-y border-border bg-cream/60">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-6 py-20 md:px-8 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <Reveal>
          <img
            src={PRODUCT_IMAGES.heritage}
            alt="Traditional South Indian coffee and Panangarkandu on a warm morning table"
            width={1000}
            height={1000}
            loading="lazy"
            decoding="async"
            className="brand-photo w-full rounded-[2rem] border border-border object-cover shadow-soft"
          />
        </Reveal>

        <Reveal delay={100}>
          <p className="section-label">Our story</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-forest">
            A family trade carried forward with care.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            D's PANAI is built on a Tamil family trade spanning more than {BRAND.yearsInTrade}{" "}
            years. We continue the same careful sourcing and packaging from {BRAND.originAddress},
            bringing the tradition of pure Panangarkandu to homes across India and overseas.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="brand-card rounded-2xl border border-border bg-white p-4">
              <p className="font-display text-3xl text-forest">25+</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-warm">years</p>
            </div>
            <div className="brand-card rounded-2xl border border-border bg-white p-4">
              <p className="font-display text-3xl text-forest">2500+</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-warm">kg</p>
            </div>
            <div className="brand-card rounded-2xl border border-border bg-white p-4">
              <p className="font-display text-3xl text-forest">1</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-warm">product</p>
            </div>
          </div>
          <Link
            to="/our-story"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-forest/20 bg-white px-6 py-3.5 text-sm font-bold tracking-[0.14em] text-forest uppercase transition-colors hover:border-gold hover:bg-cream"
          >
            Read more
            <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function OrderSteps() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-20 md:px-8">
      <Reveal className="text-center">
        <p className="section-label">How it works</p>
        <h2 className="mt-5 font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-forest">
          Order in three simple steps.
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          {
            step: "01",
            title: "Choose your weight",
            text: "From 250 g to 10 kg, packed in the same traditional D's PANAI pouch.",
          },
          {
            step: "02",
            title: "Review and confirm",
            text: "Add to cart, check your delivery details, and keep it simple.",
          },
          {
            step: "03",
            title: "Get it delivered",
            text: "We confirm your order and shipment details directly on WhatsApp.",
          },
        ].map((item, index) => (
          <Reveal key={item.step} delay={index * 80}>
            <div className="surface-card brand-card h-full p-6">
              <p className="font-display text-4xl text-gold">{item.step}</p>
              <h3 className="mt-4 text-xl text-forest">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="mx-auto max-w-[920px] px-6 py-20 md:px-8">
      <Reveal className="text-center">
        <p className="section-label">Questions</p>
        <h2 className="mt-5 font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-forest">
          Straight answers for first-time buyers.
        </h2>
      </Reveal>

      <div className="mt-10 divide-y divide-border border-y border-border">
        {FAQS.map((item, index) => (
          <Reveal key={item.q} delay={index * 60}>
            <details className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span className="font-display text-xl text-forest">{item.q}</span>
                <span className="text-2xl text-gold transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function LeadBanner() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 pb-20 md:px-8">
      <Reveal>
        <div className="overflow-hidden rounded-[2rem] border border-forest/10 bg-[#1a1714] px-8 py-12 text-center shadow-lift">
          <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-primary-foreground/70">
            Ready to order
          </p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] text-primary-foreground">
            Bring home authentic Panangarkandu.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/75">
            Choose the weight you need, review the details, and contact us directly on WhatsApp for
            a simple order confirmation.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/product/$slug"
              params={{ slug: PRODUCT.slug }}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-bold tracking-[0.14em] text-forest uppercase transition-transform hover:-translate-y-0.5"
            >
              Shop now
              <ArrowRight className="size-4" />
            </Link>
            <a
              href={BRAND.whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-white/5 px-7 py-4 text-sm font-bold tracking-[0.14em] text-primary-foreground uppercase transition-colors hover:border-gold hover:bg-white/10"
            >
              <WhatsAppIcon className="size-4" />
              {BRAND.whatsappNumber}
            </a>
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
      <ProductQuickBuy />
      <WhyItMatters />
      <StorySection />
      <OrderSteps />
      <FaqSection />
      <LeadBanner />
    </>
  );
}
