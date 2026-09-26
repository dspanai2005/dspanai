import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";
import { BRAND } from "@/lib/product";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | D's PANAI" },
      {
        name: "description",
        content:
          "The terms that apply when you place a Panangarkandu order with D's PANAI over WhatsApp.",
      },
      { property: "og:title", content: "Terms & Conditions — D's PANAI" },
      { property: "og:description", content: "Terms that apply to orders placed with D's PANAI." },
      { property: "og:type", content: "article" },
      { property: "og:image", content: `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-pack-front.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-pack-front.jpg` },
    ],
    links: [{ rel: "canonical", href: `${BRAND.siteUrl}/terms` }],
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
              name: "Terms",
              item: `${BRAND.siteUrl}/terms`,
            },
          ],
        }),
      },
    ],
  }),
  component: () => (
    <LegalPage
      title="Terms & Conditions"
      intro="These terms apply to orders placed with D's PANAI through this website and WhatsApp."
      sections={[
        {
          heading: "Orders",
          body: [
            "Selecting a quantity on this website prepares an order request. An order is confirmed only after we reply on WhatsApp with availability, shipping charges and the final total.",
          ],
        },
        {
          heading: "Pricing",
          body: [
            "Prices shown are for the product only and are quoted in Indian Rupees. Shipping is confirmed separately for each order. We may update prices at any time; the price confirmed on WhatsApp applies to your order.",
          ],
        },
        {
          heading: "Product information",
          body: [
            "Panangarkandu is a traditional palm sweetener. Crystal size, shape and colour vary naturally between batches. We make no medical or health claims about the product.",
          ],
        },
        {
          heading: "Contact",
          body: [
            "For anything related to these terms, message us on WhatsApp and we will respond directly.",
          ],
        },
      ]}
    />
  ),
});
