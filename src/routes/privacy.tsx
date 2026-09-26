import { createFileRoute } from "@tanstack/react-router";

import { PageHero, Section } from "@/components/site/Section";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — SnapCut AI" },
      {
        name: "description",
        content:
          "How SnapCut AI handles uploaded images, account data and payments, including our 24-hour automatic deletion policy.",
      },
      { property: "og:title", content: "Privacy Policy — SnapCut AI" },
      {
        property: "og:description",
        content: "Our data handling, retention and deletion practices in plain language.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPage,
});

const sections = [
  {
    title: "What we collect",
    body: "Your account email, plan and credit balance; the images you upload for processing; and payment records created by our payment provider. We do not collect analytics that identify you personally.",
  },
  {
    title: "How images are handled",
    body: "Uploads are stored temporarily so they can be processed and returned to you. Both the original and the resulting cutout are deleted automatically within 24 hours. We never use customer images to train models.",
  },
  {
    title: "Payments",
    body: "Card and UPI details are handled entirely by our payment provider. SnapCut AI never sees or stores your full payment credentials — only the transaction reference, amount and status.",
  },
  {
    title: "Security",
    body: "All traffic uses HTTPS. Secrets are encrypted at rest, access to production data is restricted and audited, and API keys can be rotated or revoked by you at any time.",
  },
  {
    title: "Your rights",
    body: "You can export your account data, delete your account, or request removal of any record at any time. Deleting an account removes stored metadata within 30 days.",
  },
  {
    title: "Contact",
    body: "Privacy questions can be sent through our contact page and are answered within one business day.",
  },
];

function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="Last updated 1 March 2026. We keep as little data as possible, for as short a time as possible."
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
