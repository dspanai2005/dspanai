import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

export type OrderStatus = "Pending" | "Confirmed" | "Shipped" | "In Transit" | "Delivered";

export const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Shipped",
  "In Transit",
  "Delivered",
];

export type OrderItemInput = {
  weightGrams: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderInput = {
  fullName: string;
  mobile: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  instructions: string;
  items: OrderItemInput[];
  productTotal: number;
  shipping: number;
  total: number;
};

export type OrderRecord = {
  orderId: string;
  createdAt: string;
  status: OrderStatus;
  fullName: string;
  mobile: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  instructions: string;
  itemsSummary: string;
  totalWeightGrams: number;
  productTotal: number;
  shipping: number;
  total: number;
  invoiceUrl: string;
  paymentStatus: string;
  paymentProofUrl: string;
  emailedCustomer: string;
};

export type TrackedOrder = {
  orderId: string;
  createdAt: string;
  status: OrderStatus;
  firstName: string;
  total: number;
  invoiceUrl: string;
};

/* ------------------------------------------------------------------ */
/* Apps Script bridge                                                  */
/* ------------------------------------------------------------------ */

async function callScript<T>(action: string, payload: Record<string, unknown>): Promise<T> {
  const url = process.env["APPS_SCRIPT_URL"] ?? process.env["VITE_APPS_SCRIPT_URL"];
  if (!url) throw new Error("Order system is not connected yet (missing APPS_SCRIPT_URL).");

  const adminPassword = process.env["ADMIN_PASSWORD"];
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action, ...(adminPassword ? { adminPassword } : {}), ...payload }),
    redirect: "follow",
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`Order system error [${res.status}]: ${text.slice(0, 500)}`);

  let json: { ok?: boolean; error?: string } & Record<string, unknown>;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Order system returned an unexpected response: ${text.slice(0, 300)}`);
  }
  if (!json.ok) throw new Error(json.error ?? "Order system rejected the request.");
  return json as T;
}

/* ------------------------------------------------------------------ */
/* Public: place an order                                              */
/* ------------------------------------------------------------------ */

function clean(v: unknown): string {
  return typeof v === "string" ? v.trim().slice(0, 500) : "";
}

function validateOrder(input: OrderInput): OrderInput {
  const items = Array.isArray(input.items) ? input.items.slice(0, 30) : [];
  if (items.length === 0) throw new Error("Your cart is empty.");
  const required: (keyof OrderInput)[] = [
    "fullName",
    "mobile",
    "email",
    "address",
    "city",
    "state",
    "pincode",
  ];
  for (const key of required) {
    if (!clean(input[key])) throw new Error("Please complete all required delivery fields.");
  }
  return {
    fullName: clean(input.fullName),
    mobile: clean(input.mobile),
    whatsapp: clean(input.whatsapp),
    email: clean(input.email),
    address: clean(input.address),
    city: clean(input.city),
    state: clean(input.state),
    pincode: clean(input.pincode),
    landmark: clean(input.landmark),
    instructions: clean(input.instructions),
    items: items.map((i) => ({
      weightGrams: Number(i.weightGrams) || 0,
      quantity: Number(i.quantity) || 0,
      unitPrice: Number(i.unitPrice) || 0,
      lineTotal: Number(i.lineTotal) || 0,
    })),
    productTotal: Number(input.productTotal) || 0,
    shipping: Number(input.shipping) || 0,
    total: Number(input.total) || 0,
  };
}

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: OrderInput) => data)
  .handler(async ({ data }) => {
    const order = validateOrder(data);
    const result = await callScript<{ orderId: string; emailedCustomer: boolean }>(
      "create",
      { order },
    );
    return { orderId: result.orderId, emailedCustomer: result.emailedCustomer };
  });

export const uploadPaymentProof = createServerFn({ method: "POST" })
  .inputValidator((data: { orderId: string; fileName: string; mimeType: string; dataUrl: string }) => data)
  .handler(async ({ data }) => {
    const orderId = clean(data.orderId).toUpperCase();
    const fileName = clean(data.fileName).slice(0, 120);
    const mimeType = clean(data.mimeType).toLowerCase();
    const dataUrl = typeof data.dataUrl === "string" ? data.dataUrl : "";
    if (!orderId || !fileName || !dataUrl) throw new Error("Please choose a payment screenshot.");
    if (!/^image\/(png|jpeg|webp)$/.test(mimeType)) {
      throw new Error("Please upload a PNG, JPG or WebP screenshot.");
    }
    if (dataUrl.length > 7_000_000) throw new Error("The screenshot must be smaller than 5 MB.");
    return callScript<{ paymentStatus: string; paymentProofUrl: string }>(
      "uploadPaymentProof",
      { orderId, fileName, mimeType, dataUrl },
    );
  });

export const trackOrder = createServerFn({ method: "POST" })
  .inputValidator((data: { orderId: string }) => data)
  .handler(async ({ data }) => {
    const orderId = clean(data.orderId).toUpperCase();
    if (!orderId) throw new Error("Enter your order ID.");
    const result = await callScript<{ order: TrackedOrder }>("track", { orderId });
    return result.order;
  });

/* ------------------------------------------------------------------ */
/* Owner dashboard: shared-password gate                               */
/* ------------------------------------------------------------------ */

const sessionConfig = {
  password: process.env["SESSION_SECRET"] ?? "dev-only-session-secret-please-set-me-32c",
  name: "dspanai-admin",
  maxAge: 60 * 60 * 12,
  cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
};

type AdminSession = { unlocked?: boolean };

function matches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function isUnlocked(): Promise<boolean> {
  const session = await useSession<AdminSession>(sessionConfig);
  return session.data.unlocked === true;
}

export const unlockDashboard = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_PASSWORD"];
    if (!expected) throw new Error("Dashboard password is not set up yet.");
    if (!matches(String(data.password ?? ""), expected)) return { ok: false as const };
    const session = await useSession<AdminSession>(sessionConfig);
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const lockDashboard = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig);
  await session.clear();
  return { ok: true as const };
});

export const getOrders = createServerFn({ method: "POST" }).handler(async () => {
  if (!(await isUnlocked())) return { locked: true as const, orders: [] as OrderRecord[] };
  const result = await callScript<{ orders: OrderRecord[] }>("list", {});
  return { locked: false as const, orders: result.orders ?? [] };
});

export const setOrderStatus = createServerFn({ method: "POST" })
  .inputValidator((data: { orderId: string; status: OrderStatus }) => data)
  .handler(async ({ data }) => {
    if (!(await isUnlocked())) throw new Error("Please unlock the dashboard first.");
    const status = ORDER_STATUSES.includes(data.status) ? data.status : "Pending";
    await callScript("updateStatus", { orderId: clean(data.orderId), status });
    return { ok: true as const };
  });
