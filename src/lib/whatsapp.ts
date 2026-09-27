import type { CartLine, CustomerDetails } from "./cart";
import { BRAND, PRODUCT, calculatePrice, formatINR, formatWeight } from "./product";

function linesToTable(lines: CartLine[]): string {
  return lines
    .map((l, i) => {
      const lineTotal = calculatePrice(l.weightGrams) * l.quantity;
      return [
        `${i + 1}. ${PRODUCT.shortName}`,
        `   Weight: ${formatWeight(l.weightGrams)}`,
        `   Quantity: ${l.quantity}`,
        `   Line Total: ${formatINR(lineTotal)}`,
      ].join("\n");
    })
    .join("\n\n");
}

function optionalCustomerFields(details: CustomerDetails): string[] {
  const out: string[] = [];
  if (details.whatsapp && details.whatsapp.trim() !== details.mobile.trim()) {
    out.push(`WhatsApp: ${details.whatsapp}`);
  }
  if (details.email?.trim()) out.push(`Email: ${details.email}`);
  if (details.landmark?.trim()) out.push(`Landmark: ${details.landmark}`);
  if (details.instructions?.trim()) out.push(`Instructions: ${details.instructions}`);
  return out;
}

export function buildOrderMessage(
  lines: CartLine[],
  details: CustomerDetails,
  shipping = BRAND.shippingIndia,
): string {
  const productTotal = lines.reduce(
    (sum, l) => sum + calculatePrice(l.weightGrams) * l.quantity,
    0,
  );

  const optional = optionalCustomerFields(details);

  return [
    `Hello ${BRAND.name},`,
    "",
    "I would like to place an order for Panangarkandu (Palm Candy).",
    "",
    "ORDER DETAILS",
    linesToTable(lines),
    "",
    "CUSTOMER DETAILS",
    `Name: ${details.fullName}`,
    `Contact: ${details.mobile}`,
    ...optional,
    "",
    "DELIVERY ADDRESS",
    details.address,
    `${details.city}, ${details.state} - ${details.pincode}`,
    `${details.country === "International" ? "International" : "India"} shipping`,
    "",
    "ORDER TOTAL",
    `Product Total: ${formatINR(productTotal)}`,
    `Shipping: ${shipping > 0 ? formatINR(shipping) : "Free"}`,
    `Estimated Total: ${formatINR(productTotal + shipping)}`,
    "",
    "Please confirm availability and the final payable amount.",
    "",
    "Thank you.",
  ].join("\n");
}

export function whatsappUrl(message: string): string {
  return `${BRAND.whatsappLink}?text=${encodeURIComponent(message)}`;
}

/** Short enquiry message used by lead-capture blocks. */
export function buildLeadMessage(name: string, interest: string): string {
  return [
    `Hello ${BRAND.name},`,
    "",
    `My name is ${name}.`,
    `I am interested in: ${interest}`,
    "",
    "Please send me the palm candy (Panangarkandu) price list and availability.",
  ].join("\n");
}
