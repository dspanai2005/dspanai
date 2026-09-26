import logoMark from "@/assets/logo-mark.png";
import heroImage from "@/assets/dspanai-panangarkandu-hero-lifestyle.jpg";
import packFront from "@/assets/dspanai-panangarkandu-pack-front.jpg";
import packDetail from "@/assets/dspanai-panangarkandu-pack-detail.jpg";
import crystalsTerracotta from "@/assets/dspanai-panangarkandu-crystals-terracotta.jpg";
import kitchenScoop from "@/assets/dspanai-panangarkandu-kitchen-scoop.jpg";
import traditionalCoffee from "@/assets/dspanai-panangarkandu-traditional-coffee.jpg";
import homeCeramicJar from "@/assets/dspanai-panangarkandu-home-ceramic-jar.jpg";
import packSpoon from "@/assets/dspanai-panangarkandu-pack-spoon.jpg";
import mobileLifestyle from "@/assets/dspanai-panangarkandu-mobile-lifestyle.jpg";
import gardenNatural from "@/assets/dspanai-panangarkandu-garden-natural.jpg";
import purityIceConcept from "@/assets/dspanai-panangarkandu-purity-ice-concept.jpg";
import packHighres from "@/assets/dspanai-panangarkandu-pack-highres.jpg";

export const PRODUCT_IMAGES = {
  logo: logoMark,
  hero: heroImage,
  primary: packFront,
  product: packFront,
  front: packFront,
  detail: packDetail,
  crystals: crystalsTerracotta,
  lifestyle: kitchenScoop,
  heritage: traditionalCoffee,
  kitchen: homeCeramicJar,
  spoon: packSpoon,
  mobileBanner: mobileLifestyle,
  natural: gardenNatural,
  purity: purityIceConcept,
  highres: packHighres,
};

export const IMAGES = PRODUCT_IMAGES;

export const BRAND = {
  name: "D's PANAI",
  tamilName: "D's Panai",
  whatsappNumber: "+91 96778 92457",
  whatsappLink: "https://wa.me/919677892457",
  instagramHandle: "@dspanai.traditions",
  instagramUrl: "https://www.instagram.com/dspanai.traditions/",
  email: "dspanaiorders@gmail.com",
  ownerEmail: "dspanaiorders@gmail.com",
  monthlyVolumeKg: 2500,
  yearsInTrade: 25,
  shippingIndia: 50,
  shippingInternational: 500,
  siteUrl: "https://www.dspanaitraditions.in",
  originAddress: "Kumaralakshmipuram, Udangudi, Thoothukudi, Tamil Nadu, India",
};

export const PRODUCT = {
  id: "panangarkandu",
  slug: "panangarkandu",
  name: "D's PANAI Pure Panangarkandu (Palm Candy)",
  shortName: "Pure Panangarkandu — Palm Candy",
  englishName: "Palm Candy",
  tamilName: "பனங்கற்கண்டு",
  category: "Palm Candy",
  basePrice: 299,
  baseWeightGrams: 250,
  minWeightGrams: 250,
  maxWeightGrams: 10000,
  weightIncrementGrams: 50,
  currency: "INR",
  description:
    "Traditional Tamil Panangarkandu (pure palm candy) with naturally formed crystals, packed in our illustrated D's PANAI pouch.",
  longDescription:
    "Panangarkandu (also known as Panakarkandu or palm candy) is the crystallised sweetness of palmyra palm sap. Carefully selected and sealed in our illustrated D's PANAI pack, brought directly to your home.",
  quickWeights: [250, 500, 750, 1000, 1250, 1500, 2000, 2500, 3000, 5000, 10000],
  allWeights: [250, 500, 750, 1000, 1250, 1500, 2000, 2500, 3000, 5000, 10000],
  gallery: [
    {
      src: PRODUCT_IMAGES.front,
      alt: "D's PANAI Pure Panangarkandu 500g branded stand-up zipper pouch front packaging view",
    },
    {
      src: PRODUCT_IMAGES.hero,
      alt: "D's PANAI Panangarkandu pouch alongside traditional South Indian brass filter coffee and amber palm candy crystals",
    },
    {
      src: PRODUCT_IMAGES.detail,
      alt: "Close-up macro detail of D's PANAI gold emblem, logo, and organic pouch paper texture",
    },
    {
      src: PRODUCT_IMAGES.crystals,
      alt: "D's PANAI pouch displayed with amber Panangarkandu crystals and terracotta bowl",
    },
    {
      src: PRODUCT_IMAGES.lifestyle,
      alt: "Scooping authentic D's PANAI Panangarkandu into coffee in a home kitchen setting",
    },
    {
      src: PRODUCT_IMAGES.heritage,
      alt: "Traditional tea and filter coffee pairing with D's PANAI Panangarkandu and natural crystals",
    },
    {
      src: PRODUCT_IMAGES.kitchen,
      alt: "D's PANAI pouch with ceramic kitchen jar filled with natural palm candy crystals",
    },
    {
      src: PRODUCT_IMAGES.spoon,
      alt: "Clean studio shot of D's PANAI 500g pouch with a stainless steel serving spoon",
    },
    {
      src: PRODUCT_IMAGES.natural,
      alt: "Outdoor garden table presentation featuring D's PANAI pouch and fresh fruits",
    },
    {
      src: PRODUCT_IMAGES.purity,
      alt: "Concept shot of D's PANAI Panangarkandu pouch encased in crystal clear ice block",
    },
  ],
};

export function calculatePrice(weightGrams: number): number {
  const tiers: ReadonlyArray<readonly [number, number]> = [
    [250, 299],
    [500, 499],
    [750, 699],
    [1000, 899],
  ];
  const [baseWeight, basePrice] = tiers[0]!;
  if (weightGrams <= baseWeight) return basePrice;
  for (let i = 1; i < tiers.length; i += 1) {
    const [upperWeight, upperPrice] = tiers[i]!;
    const [lowerWeight, lowerPrice] = tiers[i - 1]!;
    if (weightGrams <= upperWeight) {
      return Math.round(
        lowerPrice + ((weightGrams - lowerWeight) / (upperWeight - lowerWeight)) * (upperPrice - lowerPrice),
      );
    }
  }
  return Math.round((weightGrams / 1000) * 899);
}

export function formatWeight(grams: number): string {
  if (grams >= 1000) {
    const kg = grams / 1000;
    return `${Number.isInteger(kg) ? kg : kg.toFixed(2).replace(/0$/, "")} kg`;
  }
  return `${grams} g`;
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
