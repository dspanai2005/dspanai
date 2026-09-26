import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle } from "lucide-react";
import { WhatsAppIcon } from "@/components/Brand";
import { Reveal } from "@/components/Reveal";
import { BRAND, PRODUCT_IMAGES } from "@/lib/product";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact D's PANAI | Panangarkandu Customer Support & Orders" },
      {
        name: "description",
        content:
          "Connect with D's PANAI on WhatsApp (+91 96778 92457) or email for Panangarkandu orders, bulk quantities, and delivery questions.",
      },
      { property: "og:title", content: "Contact D's PANAI — Panangarkandu Support" },
      {
        property: "og:description",
        content: "WhatsApp us directly for Panangarkandu orders, bulk inquiries, and shipping support.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-pack-front.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-pack-front.jpg` },
    ],
    links: [{ rel: "canonical", href: `${BRAND.siteUrl}/contact` }],
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
              name: "Contact",
              item: `${BRAND.siteUrl}/contact`,
            },
          ],
        }),
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="mx-auto grid max-w-[1240px] gap-12 px-6 py-20 md:px-8 lg:grid-cols-2 lg:items-center">
      <Reveal>
        <p className="eyebrow">Contact & Orders</p>
        <h1 className="mt-5 font-display text-[clamp(2.25rem,5.5vw,3.75rem)] leading-tight text-forest">
          We reply promptly on WhatsApp.
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
          For orders, bulk quantities, shipping status, or product questions — send us a direct message and our team will assist you personally.
        </p>

        <div className="mt-10 space-y-3">
          <a
            href={BRAND.whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="surface-card flex items-center gap-4 p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
          >
            <WhatsAppIcon className="size-6 text-palm" />
            <div>
              <p className="text-sm font-bold text-forest">{BRAND.whatsappNumber}</p>
              <p className="text-xs text-muted-foreground">WhatsApp — fastest response time</p>
            </div>
          </a>
          <a
            href={`mailto:${BRAND.email}`}
            className="surface-card flex items-center gap-4 p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
          >
            <Mail className="size-6 text-palm" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-bold text-forest">{BRAND.email}</p>
              <p className="text-xs text-muted-foreground">Email inquiry</p>
            </div>
          </a>
          <a
            href={BRAND.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="surface-card flex items-center gap-4 p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
          >
            <MessageCircle className="size-6 text-palm" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-bold text-forest">Instagram {BRAND.instagramHandle}</p>
              <p className="text-xs text-muted-foreground">Follow our traditional journey</p>
            </div>
          </a>
        </div>
      </Reveal>

      <Reveal delay={140}>
        <img
          src={PRODUCT_IMAGES.front}
          alt="D's PANAI Pure Panangarkandu 500g branded stand-up zipper pouch front packaging view"
          width={1024}
          height={1024}
          loading="lazy"
          decoding="async"
          className="w-full rounded-3xl object-cover shadow-lift border border-border"
        />
      </Reveal>
    </div>
  );
}
