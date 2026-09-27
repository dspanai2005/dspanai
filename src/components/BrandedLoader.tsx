import { useEffect, useState } from "react";
import logoMark from "@/assets/logo-mark.png";

const LOADER_DURATION = 1900;

export function BrandedLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), LOADER_DURATION);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="brand-loader" role="status" aria-label="Loading D's Panai">
      <div className="brand-loader__candy" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="brand-loader__tree">
        <img className="brand-loader__logo" src={logoMark} alt="" width={594} height={805} />
      </div>
      <div className="brand-loader__copy">
        <strong>D&apos;s Panai</strong>
        <span>Pure Palm Candy</span>
      </div>
    </div>
  );
}
