import logoMark from "@/assets/logo-mark.png";
import pouchHero from "@/assets/pouch-hero-new.jpg";
import pouchStudio from "@/assets/pouch-studio-new.jpg";

export const IMAGES = {
  logo: logoMark,
  hero: pouchHero,
  product: pouchStudio,
  macro: pouchStudio,
  lifestyle: pouchHero,
  heritage: pouchStudio,
  pouch: pouchStudio,
  brand: pouchHero,
  collection: pouchStudio,
  pouchHero,
  pouchStudio,
};

export const BRAND = {
  name: "D's PANAI",
  tamilName: "D's Panai",
  whatsappNumber: "+91 96778 92457",
  whatsappLink: "https://wa.me/919677892457",
  instagramHandle: "@dspanai.traditions",
  instagramUrl: "https://www.instagram.com/dspanai.traditions/",
  email: "hello@dspanai.com",
  ownerEmail: "divyaselvaraj339@gmail.com",
  monthlyVolumeKg: 2500,
  yearsInTrade: 25,
  shippingIndia: 50,
  shippingInternational: 500,
  siteUrl: "https://www.dspanaitraditions.in",
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
  maxWeightGrams: 20000,
  weightIncrementGrams: 50,
  currency: "INR",
  description:
    "Traditional palm candy (Panangarkandu) with naturally formed crystals, packed in the D's PANAI pouch shown here.",
  longDescription:
    "Panangarkandu — palm candy — is the crystallised sweetness of palm sap, used in Tamil homes for generations in coffee, milk and kashayam. Ours is carefully selected and sealed in the illustrated D's PANAI pack.",
  quickWeights: [250, 500, 750, 1000, 2000, 5000],
  allWeights: [250, 500, 750, 1000, 1250, 1500, 2000, 2500, 3000, 5000, 10000],
  gallery: [
    { src: IMAGES.pouchHero, alt: "D's PANAI Panangarkandu branded pack with palm candy crystals" },
    { src: IMAGES.pouchStudio, alt: "D's PANAI Panangarkandu branded pack in a studio scene" },
    { src: IMAGES.product, alt: "D's PANAI Panangarkandu product pack" },
    { src: IMAGES.macro, alt: "Macro photograph of Panangarkandu palm candy crystals" },
    { src: IMAGES.pouchStudio, alt: "Detail of the D's PANAI branded pack" },
    { src: IMAGES.lifestyle, alt: "Panangarkandu served with traditional filter coffee" },
    { src: IMAGES.collection, alt: "The D's PANAI Panangarkandu pouch range" },
  ],
};

export function calculatePrice(weightGrams: number): number {
  const tiers = [
    [250, 299],
    [500, 499],
    [750, 699],
    [1000, 899],
  ];
  if (weightGrams <= tiers[0][0]) return tiers[0][1];
  for (let i = 1; i < tiers.length; i += 1) {
    const [upperWeight, upperPrice] = tiers[i];
    const [lowerWeight, lowerPrice] = tiers[i - 1];
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
