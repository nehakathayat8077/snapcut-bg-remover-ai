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
    body: "SnapCut AI may process the information you provide when using the service, including account contact details, uploaded images, processed result files, payment references, and messages sent through the contact form. We do not intentionally use this information for advertising or personalized tracking.",
  },
  {
    title: "How images are handled",
    body: "Uploaded images and processed outputs are used to perform the background-removal workflow. The application currently keeps files only as long as needed for processing and may delete them automatically after a short retention period. The exact retention schedule should be confirmed in your production setup and backend config.",
  },
  {
    title: "Third-party services",
    body: "The service may use external providers for automation, processing, or payment handling such as n8n, cloud storage or delivery endpoints, and Razorpay. Those services process data on our behalf under their own terms and security practices, and we only send the minimum details needed for the request to work.",
  },
  {
    title: "Payments",
    body: "Payment details are handled by the payment provider and not stored directly in the frontend. SnapCut AI only keeps the payment status, amount, and reference information needed to manage the order and support the customer.",
  },
  {
    title: "Cookies and browser storage",
    body: "The app may use minimal browser cookies or local storage for functional preferences, such as UI state or temporary session behaviour. We do not rely on advertising or tracking cookies for marketing purposes.",
  },
  {
    title: "Contact",
    body: "If you need to confirm how your data is handled, use the contact page and include your request details. Add your actual response time and business contact method here before publishing this page for customer use.",
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

        <div className="mx-auto mt-8 flex max-w-3xl flex-col justify-center gap-3 sm:flex-row">
          <a href="/terms" className="text-sm text-primary underline-offset-4 hover:underline">
            Read Terms & Conditions
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
