import { Link, useLocation } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useState, type ReactNode } from "react";
import { BRAND, PRODUCT } from "@/lib/product";
import { useCart } from "@/lib/cart";
import { CartDrawer } from "./CartDrawer";
import { Logo, WhatsAppIcon } from "./Brand";
import { WhatsAppFloat } from "./WhatsAppFloat";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/track-order", label: "Track order" },
  { to: "/our-story", label: "Our Story" },
  { to: "/purity", label: "Purity" },
  { to: "/contact", label: "Contact" },
] as const;


function AnnouncementBar() {
  return (
    <div className="overflow-hidden bg-forest px-4 py-2 text-center">
      <p className="animate-marquee inline-block whitespace-nowrap text-[11px] font-medium tracking-[0.14em] text-primary-foreground/90 uppercase md:animate-none">
        Pure Palm Candy · Free order support on WhatsApp · Worldwide shipping
      </p>
    </div>
  );
}

function Header() {
  const { itemCount, setDrawerOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const restoreScrollLock = () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.removeAttribute("data-menu-open");
    };

    if (!menuOpen) {
      restoreScrollLock();
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.setAttribute("data-menu-open", "true");

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.removeAttribute("data-menu-open");
    };
  }, [menuOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-500",
        scrolled
          ? "border-b border-border/70 bg-ivory/80 backdrop-blur-xl supports-[backdrop-filter]:bg-cream/70"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-3 px-4 py-2 md:px-8">
        <Logo className={cn("transition-all duration-500", scrolled && "h-10 md:h-12")} />

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="group relative text-sm font-semibold text-forest/85 transition-colors hover:text-forest"
              activeProps={{ className: "text-forest" }}
            >

              {item.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold transition-all duration-400 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
            className="relative grid size-11 place-items-center rounded-full text-forest transition-colors hover:bg-cream"
          >
            <ShoppingBag className="size-5" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-0.5 grid min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-forest">
                {itemCount}
              </span>
            )}
          </button>

          <Link
            to="/product/$slug"
            params={{ slug: PRODUCT.slug }}
            className="group hidden items-center gap-2 rounded-full bg-forest px-5 py-3 text-xs font-bold tracking-wide text-primary-foreground uppercase transition-all duration-300 hover:shadow-lift md:inline-flex"
          >
            Shop Panangarkandu
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="grid size-11 place-items-center rounded-full text-forest transition-colors hover:bg-cream lg:hidden"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      </header>
      {mounted && createPortal(
        <div
          id="mobile-menu"
          aria-hidden={!menuOpen}
          className={cn(
            "fixed inset-0 z-[60] flex min-h-[100dvh] flex-col bg-cream transition-opacity duration-300 lg:hidden",
            menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-4 py-3">
            <Logo className="h-10" />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="grid size-11 place-items-center rounded-full text-forest hover:bg-ivory"
            >
              <X className="size-6" />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto overscroll-contain px-6 pt-4 pb-2">
            <ul className="flex flex-col">
              {NAV.map((item, i) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    activeOptions={{ exact: item.to === "/" }}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-baseline justify-between gap-3 border-b border-border/60 py-4 text-forest"
                    activeProps={{ className: "text-gold" }}
                    style={{
                      transition: "opacity .4s, transform .4s",
                      transitionDelay: `${60 + i * 45}ms`,
                      opacity: menuOpen ? 1 : 0,
                      transform: menuOpen ? "none" : "translateY(10px)",
                    }}
                  >
                    <span className="font-display text-2xl leading-none">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="shrink-0 space-y-3 border-t border-border/60 px-6 py-5">
            <Link
              to="/product/$slug"
              params={{ slug: PRODUCT.slug }}
              onClick={() => setMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-3.5 text-xs font-bold tracking-wide text-primary-foreground uppercase"
            >
              Shop Panangarkandu
            </Link>
            <a
              href={BRAND.whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-forest/25 px-6 py-3.5 text-sm font-bold text-forest"
            >
              <WhatsAppIcon className="size-5" />
              Order on WhatsApp
            </a>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-cream">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-6 py-16 md:grid-cols-4 md:px-8">
        <div>
          <h3 className="font-display text-2xl">{BRAND.name}</h3>
          <p className="mt-1 text-sm tracking-[0.2em] text-gold uppercase">Palm Candy</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Pure Panangarkandu (palm candy) from a family trade of {BRAND.yearsInTrade}+ years,
            packed in our illustrated D's PANAI pack. Shipped across India (
            {`₹${BRAND.shippingIndia}`}) and worldwide ({`₹${BRAND.shippingInternational}`}).
          </p>
        </div>
        <FooterCol
          title="Explore"
          links={[
            { to: "/shop", label: "Shop" },
            { to: "/track-order", label: "Track order" },
            { to: "/our-story", label: "Our Story" },
            { to: "/purity", label: "Purity" },
            { to: "/contact", label: "Contact" },
          ]}
        />
        <FooterCol
          title="Help"
          links={[
            { to: "/shipping", label: "Shipping & Delivery" },
            { to: "/refund", label: "Cancellation & Refunds" },
            { to: "/privacy", label: "Privacy Policy" },
            { to: "/terms", label: "Terms & Conditions" },
          ]}
        />
        <div>
          <h4 className="eyebrow">Connect</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={BRAND.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-forest hover:text-gold"
              >
                <WhatsAppIcon className="size-4" />
                {BRAND.whatsappNumber}
              </a>
            </li>
            <li>
              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="text-forest hover:text-gold"
              >
                Instagram {BRAND.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="rule-gold" />
      <div className="mx-auto max-w-[1240px] px-6 py-6 md:px-8">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="eyebrow">{title}</h4>
      <ul className="mt-4 space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-forest transition-colors hover:text-gold">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <WhatsAppFloat />
    </div>
  );
}
