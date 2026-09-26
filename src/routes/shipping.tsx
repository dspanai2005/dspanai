import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";
import { BRAND } from "@/lib/product";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping & Delivery Policy | D's PANAI" },
      {
        name: "description",
        content:
          "D's PANAI ships Panangarkandu (palm candy) worldwide. Flat ₹50 shipping within India and ₹500 internationally, confirmed on WhatsApp.",
      },
      { property: "og:title", content: "Shipping & Delivery Policy — D's PANAI" },
      { property: "og:description", content: "How we pack and ship Panangarkandu orders across India and worldwide." },
      { property: "og:type", content: "article" },
      { property: "og:image", content: `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-pack-front.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${BRAND.siteUrl}/assets/images/dspanai-panangarkandu-pack-front.jpg` },
    ],
    links: [{ rel: "canonical", href: `${BRAND.siteUrl}/shipping` }],
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
              name: "Shipping",
              item: `${BRAND.siteUrl}/shipping`,
            },
          ],
        }),
      },
    ],
  }),
  component: () => (
    <LegalPage
      title="Shipping & Delivery"
      intro="We ship Pure Panangarkandu (palm candy) across India and worldwide. Flat ₹50 shipping within India and ₹500 for international orders."
      sections={[
        {
          heading: "Shipping charges",
          body: [
            "Shipping is a flat ₹50 for any order delivered within India, and a flat ₹500 for international orders.",
            "Your WhatsApp order message already includes the shipping charge, and we confirm the final total with you before dispatch.",
          ],
        },
        {
          heading: "Packing",
          body: [
            "Your Panangarkandu is packed in the illustrated D's PANAI pack and then placed in protective outer packaging for transit.",
          ],
        },
        {
          heading: "Dispatch and delivery time",
          body: [
            "We confirm dispatch and expected delivery time for your order on WhatsApp. Delivery timelines depend on the courier and your location.",
          ],
        },
        {
          heading: "Tracking",
          body: [
            "Where the courier provides tracking, we share the tracking details with you on WhatsApp.",
          ],
        },
      ]}
    />
  ),
});
