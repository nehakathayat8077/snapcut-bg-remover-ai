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
    title: "Use of SnapCut AI",
    body: "SnapCut AI is a tool for background removal and image-processing workflows. You are responsible for using it lawfully, for having the rights to upload the images you send to the service, and for keeping your account access and API credentials secure.",
  },
  {
    title: "User responsibilities",
    body: "Do not upload content that is unlawful, infringing, harmful, or otherwise prohibited by applicable law. The service is not intended for unlawful, abusive, fraudulent, or deceptive use, or for bypassing the intended rate limits or processing rules.",
  },
  {
    title: "Content and output",
    body: "The images you upload may be processed by the SnapCut AI workflow and returned as edited output files. You remain responsible for the content you upload and for verifying that the results are suitable for your use case.",
  },
  {
    title: "Payments, subscriptions and credits",
    body: "The terms for pricing, plan access, and credit usage are defined in the pricing page and your payment provider checkout flow. SnapCut AI may offer subscriptions, credit packs, or usage-based access depending on the product configuration and backend setup.",
  },
  {
    title: "Refunds and cancellations",
    body: "Refunds and cancellation rights are governed by the SnapCut AI refund and cancellation policy and by the actual payment/plan configuration you purchase. We do not mark a payment as successful without backend verification, and any disputed or failed payment should be reviewed through the support contact method.",
  },
  {
    title: "Service availability and liability",
    body: "SnapCut AI aims to provide a reliable service, but online software may be interrupted, restricted, or subject to maintenance. The service is provided on an as-is basis, and liability should be limited to the extent permitted by applicable law. Add your final legal wording and business-specific limitations before publishing this page publicly.",
  },
  {
    title: "Changes and contact",
    body: "SnapCut AI may update these terms and policies over time. When changes are made, the updated wording should be published on the relevant site pages and communicated via the support/contact route or other appropriate channel. If you need help interpreting any term, use the contact page.",
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

        <div className="mx-auto mt-8 flex max-w-3xl flex-col justify-center gap-3 sm:flex-row">
          <a href="/privacy" className="text-sm text-primary underline-offset-4 hover:underline">
            Read Privacy Policy
          </a>
          <a href="/refund-policy" className="text-sm text-primary underline-offset-4 hover:underline">
            Read Refund Policy
          </a>
          <a href="/contact" className="text-sm text-primary underline-offset-4 hover:underline">
            Contact support
          </a>
        </div>
      </Section>
    </>
  );
}
