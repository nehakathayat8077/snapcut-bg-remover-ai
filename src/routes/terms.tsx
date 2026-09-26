import { createFileRoute } from "@tanstack/react-router";

import { PageHero, Section } from "@/components/site/Section";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — SnapCut AI" },
      {
        name: "description",
        content:
          "The terms covering SnapCut AI accounts, acceptable use, credits, subscriptions, refunds and service availability.",
      },
      { property: "og:title", content: "Terms of Service — SnapCut AI" },
      {
        property: "og:description",
        content: "Account rules, acceptable use, billing and availability commitments.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TermsPage,
});

const sections = [
  {
    title: "Your account",
    body: "You are responsible for keeping your login credentials and API keys secure. One account is for one organisation; sharing keys outside your organisation is not permitted.",
  },
  {
    title: "Acceptable use",
    body: "Do not upload content you do not have the rights to process, or content that is unlawful. We may suspend accounts that abuse the service or attempt to bypass rate limits.",
  },
  {
    title: "Credits and subscriptions",
    body: "Free accounts receive 5 images per day. Pro subscriptions renew monthly until cancelled. Credit packs do not expire and are consumed before plan quota.",
  },
  {
    title: "Refunds",
    body: "Failed jobs are never charged and any credit consumed is returned automatically. Subscription refunds are handled case by case within 7 days of a charge.",
  },
  {
    title: "Availability",
    body: "We target 99.5% monthly uptime. Planned maintenance is announced in advance. The service is provided without warranty beyond that commitment.",
  },
  {
    title: "Changes",
    body: "We may update these terms; material changes are announced by email at least 14 days before they take effect.",
  },
];

function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        description="Last updated 1 March 2026. Plain terms for using SnapCut AI."
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
      </Section>
    </>
  );
}
