import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { PageHero, Section } from "@/components/site/Section";

export const Route = createFileRoute("/shipping-delivery")({
  head: () => ({
    meta: [
      { title: "Shipping & Delivery Policy — SnapCut AI" },
      {
        name: "description",
        content:
          "SnapCut AI is a digital SaaS service. This page explains how plans, credits, and subscriptions are delivered after successful payment.",
      },
    ],
  }),
  component: ShippingDeliveryPage,
});

const sections = [
  {
    title: "Digital service only",
    body:
      "SnapCut AI is a software and image-processing service. We do not ship physical goods, products, or materials. There are no product deliveries, printed items, or shipping costs associated with the service.",
  },
  {
    title: "How access is delivered",
    body:
      "After a successful payment is verified, access to the purchased service is enabled in the customer account or application workflow. Credits, subscriptions, or other digital benefits are delivered immediately or as soon as the backend confirms the order and payment status.",
  },
  {
    title: "Download and processing",
    body:
      "Processed images are delivered as downloadable output files through the SnapCut AI interface or by API result URL where applicable. File availability depends on the plan, output settings, and retention policy described elsewhere in our privacy and terms pages.",
  },
  {
    title: "Support and questions",
    body:
      "If you need help with a payment, access issue, or missing digital entitlement, contact support through the contact page. Include your order reference or email address so we can confirm the exact transaction and activation status.",
  },
];

function ShippingDeliveryPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Shipping & Delivery Policy"
        description="SnapCut AI provides digital software access and image-processing services. This page explains how paid services are delivered after successful payment."
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
            <Link to="/pricing">Review plans</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/contact">Contact support</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
