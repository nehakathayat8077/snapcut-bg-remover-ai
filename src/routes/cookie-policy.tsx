import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { PageHero, Section } from "@/components/site/Section";

export const Route = createFileRoute("/cookie-policy")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — SnapCut AI" },
      {
        name: "description",
        content:
          "SnapCut AI cookie policy. We use only minimal browser storage required for site functionality and do not rely on advertising or tracking cookies.",
      },
    ],
  }),
  component: CookiePolicyPage,
});

const sections = [
  {
    title: "What we use",
    body:
      "SnapCut AI uses minimal browser storage needed to keep the application functioning correctly, such as remembering simple UI preferences or temporary state in the browser. This may include cookies or local storage for forms, session state, or interface settings.",
  },
  {
    title: "What we do not use",
    body:
      "We do not use advertising cookies, tracking pixels, analytics cookies, remarketing tools, or cross-site behavioral tracking for marketing purposes. This site is not configured to sell or share user data for advertising or targeting.",
  },
  {
    title: "Third-party services",
    body:
      "External services used by the app, such as Razorpay, n8n, and cloud storage providers, may store or process data as required to complete payments, automation tasks, or file handling. Their own privacy and security practices apply to that processing, and we keep only the minimum necessary data in our own systems.",
  },
  {
    title: "Managing cookies",
    body:
      "Most browsers allow users to accept, reject, or delete cookies. If your browser settings block or remove cookies, some parts of the site may work less smoothly or may need to be reconfigured. Add your specific cookie-management instructions here if you want more detail.",
  },
];

function CookiePolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Cookie Policy"
        description="A truthful summary of the browser storage and cookie usage on SnapCut AI. We keep it minimal and functional, without advertising or tracking cookies."
      />

      <Section className="pt-4">
        <div className="mx-auto max-w-3xl space-y-6">
          {sections.map((section) => (
            <article key={section.title} className="glass-card p-7">
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="hero" asChild>
            <Link to="/privacy">Read privacy policy</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/contact">Contact support</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
