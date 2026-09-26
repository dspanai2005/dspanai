import { createFileRoute, Link } from "@tanstack/react-router";
import { CountUp, Reveal } from "@/components/Reveal";
import { BRAND, PRODUCT_IMAGES, PRODUCT } from "@/lib/product";

export const Route = createFileRoute("/our-story")({
  head: () => ({
    meta: [
      { title: "Our Story | D's PANAI Panangarkandu Tradition" },
      {
        name: "description",
        content:
          "D's PANAI is built on a 25+ year family trade in Panangarkandu (palm candy), serving over 2,500 kg monthly from Udangudi / Thoothukudi, Tamil Nadu.",
      },
      { property: "og:title", content: "A family tradition, carried forward — D's PANAI" },
      {
        property: "og:description",
        content: "The story of a Tamil family trade in Panangarkandu, brought to homes across India.",
      },
      { property: "og:type", content: "article" },
      { property: "og:image", content: `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-traditional-coffee.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-traditional-coffee.jpg` },
    ],
    links: [{ rel: "canonical", href: `${BRAND.siteUrl}/our-story` }],
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
              name: "Our Story",
              item: `${BRAND.siteUrl}/our-story`,
            },
          ],
        }),
      },
    ],
  }),
  component: OurStory,
});

const TIMELINE = [
  { label: "Our Roots", body: "Family trade in Panangarkandu begins with our family elders in Udangudi / Thoothukudi." },
  { label: "Decades of Trade", body: "Supplying bulk pure palm candy consistently to homes and merchants for 25+ years." },
  { label: "Today", body: "Handling over 2,500 kg of pure Panangarkandu every month." },
  { label: "D's PANAI", body: "Branded consumer pouches bringing authentic palm sweetener directly to step." },
];

function OurStory() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <img
          src={PRODUCT_IMAGES.heritage}
          alt="Traditional tea and filter coffee pairing with D's PANAI Panangarkandu and natural crystals"
          className="animate-drift absolute inset-0 size-full object-cover opacity-20"
        />
        <div className="relative mx-auto max-w-[1240px] px-6 py-24 md:px-8 md:py-32">
          <p className="eyebrow">Our Story</p>
          <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.25rem,6vw,4.25rem)] leading-[1.02]">
            A family tradition, carried forward.
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1240px] gap-12 px-6 py-20 md:px-8 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <p className="text-lg leading-relaxed text-muted-foreground">
            D's PANAI is built on a family trade of selling Panangarkandu that spans over {BRAND.yearsInTrade} years from Udangudi in Thoothukudi district, Tamil Nadu. What began as a traditional trade continues today with the same commitment to natural purity, bringing our illustrated pouch directly to homes.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            The name unites our founder Divya's initial with{" "}
            <span className="text-gold font-semibold">Panai</span> — the palmyra palm tree at the heart of our tradition.
          </p>
          <div className="mt-10">
            <p className="font-display text-6xl text-forest tabular-nums">
              <CountUp to={BRAND.monthlyVolumeKg} suffix="+" />
            </p>
            <p className="eyebrow mt-2">kg of Panangarkandu handled per month</p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <img
            src={PRODUCT_IMAGES.kitchen}
            alt="D's PANAI Panangarkandu pouch with ceramic kitchen jar in warm home setting"
            width={1024}
            height={1024}
            loading="lazy"
            decoding="async"
            className="w-full rounded-3xl object-cover shadow-soft border border-border"
          />
        </Reveal>
      </section>

      <section className="border-y border-border bg-cream/50">
        <div className="mx-auto max-w-[1240px] px-6 py-20 md:px-8">
          <h2 className="font-display text-3xl">How it has moved forward</h2>
          <ol className="mt-10 space-y-2">
            {TIMELINE.map((step, i) => (
              <Reveal as="li" key={step.label} delay={i * 110}>
                <div className="flex gap-6 border-t border-border py-7">
                  <span className="font-display text-2xl text-gold tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-xl">{step.label}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 py-20 text-center md:px-8">
        <Reveal>
          <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)]">
            From our family to your home.
          </h2>
          <Link
            to="/product/$slug"
            params={{ slug: PRODUCT.slug }}
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-forest px-7 py-4 text-sm font-bold tracking-wide text-primary-foreground uppercase transition-all hover:shadow-lift"
          >
            Shop Panangarkandu
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
