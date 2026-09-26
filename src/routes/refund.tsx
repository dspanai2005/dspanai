import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";
import { BRAND } from "@/lib/product";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Cancellation & Refund Policy | D's PANAI" },
      {
        name: "description",
        content:
          "Clear cancellation and refund policy for D's PANAI Pure Panangarkandu (palm candy) orders.",
      },
      { property: "og:title", content: "Cancellation & Refund Policy — D's PANAI" },
      { property: "og:description", content: "How cancellations and refunds are handled for D's PANAI orders." },
      { property: "og:type", content: "article" },
      { property: "og:image", content: `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-pack-front.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-pack-front.jpg` },
    ],
    links: [{ rel: "canonical", href: `${BRAND.siteUrl}/refund` }],
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
              name: "Refund Policy",
              item: `${BRAND.siteUrl}/refund`,
            },
          ],
        }),
      },
    ],
  }),
  component: () => (
    <LegalPage
      title="Cancellation & Refund Policy"
      intro="Because every order is confirmed personally on WhatsApp, cancellations and issues are handled directly with us."
      sections={[
        {
          heading: "Cancellation",
          body: [
            "You can cancel your order on WhatsApp any time before it is dispatched. Once a parcel has been handed to the courier, it can no longer be cancelled.",
          ],
        },
        {
          heading: "Damaged or incorrect orders",
          body: [
            "If your parcel arrives damaged, or the weight or item is not what was confirmed, message us on WhatsApp within 48 hours of delivery with photographs of the parcel and pouch.",
          ],
        },
        {
          heading: "Food product limitation",
          body: [
            "As Panangarkandu is a food product, we cannot accept returns of opened pouches for hygiene reasons.",
          ],
        },
        {
          heading: "Refunds",
          body: [
            "Where a refund is agreed, it is processed to the same method you used to pay, and the timeline depends on your bank or payment provider.",
          ],
        },
      ]}
    />
  ),
});
