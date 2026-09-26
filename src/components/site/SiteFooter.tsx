import { Link } from "@tanstack/react-router";

const logoSrc = "/images/snapcut-logo.png";

const groups = [
  {
    title: "Product",
    links: [
      { to: "/features", label: "Features" },
      { to: "/pricing", label: "Pricing" },
      { to: "/api-docs", label: "API" },
      { to: "/integrations", label: "Integrations" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/blog", label: "Blog" },
      { to: "/careers", label: "Careers" },
      { to: "/contact", label: "Contact / Support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/terms", label: "Terms & Conditions" },
      { to: "/refund-policy", label: "Refund & Cancellation Policy" },
      { to: "/shipping-delivery", label: "Shipping & Delivery Policy" },
      { to: "/cookie-policy", label: "Cookie Policy" },
      { to: "/payment-success", label: "Payment Success" },
      { to: "/payment-failed", label: "Payment Failed" },
      { to: "/payment-pending", label: "Payment Pending" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-card/40">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logoSrc} alt="SnapCut AI" className="h-9 w-9 rounded-lg" />
            <span className="font-display text-lg font-bold">SnapCut AI</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            One-click background removal for teams that ship product images fast. Files are deleted
            automatically after 24 hours.
          </p>
        </div>

        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              {group.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {group.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60">
        <p className="mx-auto w-full max-w-6xl px-4 py-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} SnapCut AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
