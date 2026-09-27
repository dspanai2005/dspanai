import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ExternalLink, Loader2, LockKeyhole, RefreshCw, Search } from "lucide-react";
import {
  ORDER_STATUSES,
  getOrders,
  lockDashboard,
  setOrderStatus,
  unlockDashboard,
  type OrderRecord,
  type OrderStatus,
} from "@/lib/orders.functions";
import { formatINR, formatWeight } from "@/lib/product";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/order-divya2004")({
  head: () => ({
    meta: [
      { title: "Orders Dashboard | D's PANAI" },
      { name: "description", content: "Private order dashboard for D's PANAI." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Orders Dashboard — D's PANAI" },
      { property: "og:description", content: "Private order dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const STATUS_CLASS: Record<OrderStatus, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Confirmed: "bg-emerald-100 text-emerald-800",
  Shipped: "bg-sky-100 text-sky-800",
  "In Transit": "bg-violet-100 text-violet-800",
  Delivered: "bg-forest text-primary-foreground",
};

function driveThumbnailUrl(fileUrl: string): string | null {
  const fileId = fileUrl.match(/(?:\/d\/|[?&]id=)([^/?&]+)/)?.[1];
  return fileId
    ? `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w320`
    : null;
}

function Dashboard() {
  const fetchOrders = useServerFn(getOrders);
  const unlock = useServerFn(unlockDashboard);
  const lock = useServerFn(lockDashboard);
  const updateStatus = useServerFn(setOrderStatus);
  const queryClient = useQueryClient();

  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | OrderStatus>("All");

  const ordersQuery = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => fetchOrders({ data: undefined }),
    retry: false,
  });

  const unlockMutation = useMutation({
    mutationFn: (value: string) => unlock({ data: { password: value } }),
    onSuccess: (res) => {
      if (res.ok) {
        setAuthError(null);
        setPassword("");
        void queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      } else {
        setAuthError("That password is not correct.");
      }
    },
    onError: (e: Error) => setAuthError(e.message),
  });

  const statusMutation = useMutation({
    mutationFn: (vars: { orderId: string; status: OrderStatus }) => updateStatus({ data: vars }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
  });

  const locked = ordersQuery.data?.locked !== false;
  const orders: OrderRecord[] = ordersQuery.data?.orders ?? [];

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== "All" && o.status !== filter) return false;
      if (!q) return true;
      return [o.orderId, o.fullName, o.mobile, o.email, o.city, o.pincode]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [orders, query, filter]);

  const stats = useMemo(() => {
    const revenue = orders.reduce((s, o) => s + o.total, 0);
    const counts = ORDER_STATUSES.map((s) => ({
      status: s,
      count: orders.filter((o) => o.status === s).length,
    }));
    return { revenue, counts, total: orders.length };
  }, [orders]);

  if (ordersQuery.isLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="size-6 animate-spin text-warm" />
      </div>
    );
  }

  if (locked) {
    return (
      <div className="mx-auto grid min-h-[70vh] max-w-[440px] place-items-center px-6">
        <form
          className="surface-card w-full p-8"
          onSubmit={(e) => {
            e.preventDefault();
            unlockMutation.mutate(password);
          }}
        >
          <span className="grid size-12 place-items-center rounded-full bg-forest text-primary-foreground">
            <LockKeyhole className="size-5" />
          </span>
          <h1 className="mt-5 font-display text-2xl">Orders dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the owner password to see all orders.
          </p>
          <input
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mt-6 w-full rounded-lg border border-input bg-card px-4 py-3 text-sm"
          />
          {authError && <p className="mt-2 text-xs text-destructive">{authError}</p>}
          <button
            type="submit"
            disabled={unlockMutation.isPending || password.length === 0}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-bold tracking-wide text-primary-foreground uppercase disabled:opacity-50"
          >
            {unlockMutation.isPending && <Loader2 className="size-4 animate-spin" />}
            Unlock
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-12 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Owner area</p>
          <h1 className="mt-2 font-display text-[clamp(1.9rem,4vw,2.75rem)]">Orders dashboard</h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => ordersQuery.refetch()}
            className="inline-flex items-center gap-2 rounded-full border border-forest/25 px-5 py-2.5 text-xs font-bold tracking-wide text-forest uppercase hover:bg-cream"
          >
            <RefreshCw className={cn("size-4", ordersQuery.isFetching && "animate-spin")} />
            Refresh
          </button>
          <button
            type="button"
            onClick={async () => {
              await lock({ data: undefined });
              void queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
            }}
            className="rounded-full border border-forest/25 px-5 py-2.5 text-xs font-bold tracking-wide text-forest uppercase hover:bg-cream"
          >
            Lock
          </button>
        </div>
      </div>

      {ordersQuery.isError && (
        <p className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {(ordersQuery.error as Error).message}
        </p>
      )}

      <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-7">
        <div className="surface-card p-5">
          <p className="text-xs tracking-wide text-warm uppercase">Orders</p>
          <p className="mt-1 font-display text-2xl text-forest">{stats.total}</p>
        </div>
        <div className="surface-card p-5 sm:col-span-2">
          <p className="text-xs tracking-wide text-warm uppercase">Total value</p>
          <p className="mt-1 font-display text-2xl text-forest">{formatINR(stats.revenue)}</p>
        </div>
        {stats.counts.map((c) => (
          <div key={c.status} className="surface-card p-5">
            <p className="text-xs tracking-wide text-warm uppercase">{c.status}</p>
            <p className="mt-1 font-display text-2xl text-forest">{c.count}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-warm" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order ID, name, phone, city…"
            className="w-full rounded-full border border-input bg-card py-3 pr-4 pl-10 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["All", ...ORDER_STATUSES] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-bold tracking-wide uppercase",
                filter === s
                  ? "border-forest bg-forest text-primary-foreground"
                  : "border-forest/20 text-forest hover:bg-cream",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[1050px] text-left text-sm">
          <thead className="bg-ivory text-xs tracking-wide text-warm uppercase">
            <tr>
              {[
                "Order",
                "Customer",
                "Items",
                "Delivery",
                "Total",
                "Status",
                "Payment",
                "Invoice",
              ].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((o) => (
              <tr key={o.orderId} className="border-t border-border align-top">
                <td className="px-4 py-4">
                  <p className="font-bold text-forest">{o.orderId}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{o.createdAt}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-semibold text-forest">{o.fullName}</p>
                  <p className="text-xs text-muted-foreground">{o.mobile}</p>
                  {o.email && <p className="text-xs text-muted-foreground">{o.email}</p>}
                </td>
                <td className="px-4 py-4 text-xs whitespace-pre-line text-muted-foreground">
                  {o.itemsSummary}
                  <p className="mt-1 text-forest">{formatWeight(o.totalWeightGrams)} total</p>
                </td>
                <td className="max-w-[260px] px-4 py-4 text-xs text-muted-foreground">
                  {o.address}
                  <br />
                  {o.city}, {o.state} - {o.pincode}
                  {o.instructions && <p className="mt-1 italic">“{o.instructions}”</p>}
                </td>
                <td className="px-4 py-4 font-bold text-forest tabular-nums">
                  {formatINR(o.total)}
                  <p className="text-xs font-normal text-muted-foreground">
                    {o.shipping > 0 ? `incl. ${formatINR(o.shipping)} shipping` : "Free shipping"}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={cn(
                      "inline-block rounded-full px-3 py-1 text-[11px] font-bold",
                      STATUS_CLASS[o.status] ?? "bg-muted",
                    )}
                  >
                    {o.status}
                  </span>
                  <select
                    value={o.status}
                    disabled={statusMutation.isPending}
                    onChange={(e) =>
                      statusMutation.mutate({
                        orderId: o.orderId,
                        status: e.target.value as OrderStatus,
                      })
                    }
                    className="mt-2 w-full rounded-lg border border-input bg-card px-2 py-1.5 text-xs"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-4 text-xs">
                  <p
                    className={cn(
                      "font-bold",
                      o.paymentStatus === "Proof uploaded" ? "text-emerald-700" : "text-warm",
                    )}
                  >
                    {o.paymentStatus || "Not paid"}
                  </p>
                  {o.paymentProofUrl && (
                    <>
                      {driveThumbnailUrl(o.paymentProofUrl) && (
                        <a
                          href={o.paymentProofUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 block w-fit"
                        >
                          <img
                            src={driveThumbnailUrl(o.paymentProofUrl)!}
                            alt={`Payment proof for ${o.orderId}`}
                            loading="lazy"
                            className="h-16 w-20 rounded-md border border-border object-cover"
                          />
                        </a>
                      )}
                      <a
                        href={o.paymentProofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1 font-bold text-forest uppercase hover:text-gold"
                      >
                        View proof <ExternalLink className="size-3" />
                      </a>
                    </>
                  )}
                </td>
                <td className="px-4 py-4">
                  {o.invoiceUrl ? (
                    <a
                      href={o.invoiceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-forest uppercase hover:text-gold"
                    >
                      PDF <ExternalLink className="size-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No orders match this view yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Changing a status here emails the customer automatically and updates the Google Sheet.
      </p>
    </div>
  );
}
