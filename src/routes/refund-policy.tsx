import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHero, Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund & Cancellation Policy — SnapCut AI" },
      {
        name: "description",
        content:
          "Placeholder refund and cancellation policy for SnapCut AI. Update this with your business rules before launch.",
      },
    ],
  }),
  component: RefundPolicyPage,
});

const sections = [
  {
    title: "Policy placeholder",
    body:
      "Replace this page with your own refund and cancellation rules before going live. Add your business policy for duplicate charges, service issues, failed payments, and plan cancellations here.",
  },
  {
    title: "Refund eligibility",
    body:
      "Add your eligibility rules for refunds, chargebacks, and service credit requests. Keep the wording specific to your business, payment provider, and subscription terms.",
  },
  {
    title: "Cancellations",
    body:
      "Explain how customers cancel a subscription or credit pack, when access ends, and whether any prorated credit or partial refund is available.",
  },
  {
    title: "Payment failures",
    body:
      "Document how failed or pending Razorpay transactions are handled, whether the user receives a retry option, and what support ticket steps are required.",
  },
  {
    title: "Support process",
    body:
      "Provide your support email or contact route for refund requests and include the expected response time. Keep this placeholder easy to update later.",
  },
];

function RefundPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Billing"
        title="Refund & Cancellation Policy"
        description="This is a placeholder policy page. Replace the wording below with your own refund and cancellation rules before launch."
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
          <Button variant="hero" asChild>
            <Link to="/pricing">Back to pricing</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/contact">Contact support</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
