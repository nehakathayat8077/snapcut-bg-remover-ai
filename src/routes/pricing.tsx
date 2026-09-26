import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  createRazorpayOrder,
  openRazorpayCheckout,
  verifyRazorpayPayment,
} from "@/lib/razorpay";
import { saveVerifiedPayment } from "@/lib/payment-store";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — SnapCut AI" },
      {
        name: "description",
        content:
          "Start free with 5 images a day. Go Pro for unlimited background removal, or buy credit packs that never expire.",
      },
      { property: "og:title", content: "Pricing — SnapCut AI" },
      {
        property: "og:description",
        content: "Free daily images, unlimited Pro plan and pay-as-you-go credit packs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    blurb: "For trying SnapCut on a few product shots.",
    features: [
      "5 images per day",
      "Full resolution downloads",
      "JPG, PNG and WEBP input",
      "24-hour auto-delete",
    ],
    cta: "Start free",
    highlighted: false,
    destination: "/contact",
    planKey: null,
  },
  {
    name: "Pro Monthly",
    price: "₹799",
    period: "per month",
    blurb: "For stores and studios shipping images every day.",
    features: [
      "Unlimited background removal",
      "Batch uploads and ZIP export",
      "Priority processing queue",
      "7-day download history",
      "Email support",
    ],
    cta: "Go Pro",
    highlighted: true,
    destination: "/pricing",
    planKey: "pro-monthly",
  },
  {
    name: "Credit Packs",
    price: "₹499",
    period: "for 500 credits",
    blurb: "For bursts of work and API integrations.",
    features: [
      "Credits never expire",
      "API key access",
      "Usage analytics",
      "Webhook callbacks",
    ],
    cta: "Buy credits",
    highlighted: false,
    destination: "/pricing",
    planKey: "credit-packs",
  },
] as const;

const faqs = [
  {
    q: "What counts as one image?",
    a: "Every successful background removal uses one credit. Failed jobs are never charged, and retries on the same file are free.",
  },
  {
    q: "How long are my files kept?",
    a: "Uploads and results are deleted automatically 24 hours after processing. Download links in your history stop working after that.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "Cards, UPI, netbanking and wallets through Razorpay. Invoices are issued for every successful payment.",
  },
  {
    q: "Can I cancel Pro at any time?",
    a: "Yes. Cancel from Billing and you keep Pro access until the end of the current billing period.",
  },
];

function PricingPage() {
  const navigate = useNavigate();

  async function handleCheckout(planKey: "pro-monthly" | "credit-packs") {
    try {
      const order = await createRazorpayOrder({ plan: planKey });

      await openRazorpayCheckout({
        amount: order.amount,
        currency: order.currency,
        name: "SnapCut AI",
        description:
          planKey === "pro-monthly" ? "SnapCut Pro Monthly" : "SnapCut Credit Pack",
        orderId: order.id,
        plan: planKey,
        onSuccess: async (payment) => {
          try {
            const verification = await verifyRazorpayPayment(payment);

            if (verification.status === "paid") {
              const record = saveVerifiedPayment({
                planKey,
                planName: planKey === "pro-monthly" ? "Pro Monthly" : "Credit Pack",
                amount: planKey === "pro-monthly" ? 79900 : 49900,
                currency: "INR",
                orderId: payment.razorpay_order_id ?? "",
                paymentId: payment.razorpay_payment_id ?? "",
                receipt: `snapcut-${planKey}`,
                creditsAwarded: planKey === "credit-packs" ? 500 : 0,
              });

              if (record) {
                console.info("Saved verified payment transaction", record);
              }

              navigate({ to: "/payment-success" });
              return;
            }

            if (verification.status === "pending") {
              navigate({ to: "/payment-pending" });
              return;
            }

            navigate({ to: "/payment-failed" });
          } catch (error) {
            console.error(error);
            navigate({ to: "/payment-failed" });
          }
        },
        onFailure: () => {
          navigate({ to: "/payment-failed" });
        },
        onDismiss: () => {
          navigate({ to: "/payment-pending" });
        },
      });
    } catch (error) {
      console.error(error);
      navigate({ to: "/payment-failed" });
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title={
          <>
            Simple pricing, <span className="gradient-text">no surprises</span>
          </>
        }
        description="Start free. Upgrade when your volume grows. Every plan includes full-resolution downloads."
      />

      <Section className="pt-4">
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={
                plan.highlighted
                  ? "glass-card glow-ring relative flex flex-col p-8"
                  : "glass-card flex flex-col p-8"
              }
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-8 rounded-full bg-[image:var(--gradient-brand)] px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Most popular
                </span>
              )}
              <h2 className="font-display text-xl font-bold">{plan.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{plan.blurb}</p>
              <p className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.planKey ? (
                <Button
                  variant={plan.highlighted ? "hero" : "heroOutline"}
                  size="xl"
                  className="mt-8"
                  onClick={() => handleCheckout(plan.planKey as "pro-monthly" | "credit-packs")}
                >
                  {plan.cta}
                </Button>
              ) : (
                <Button
                  variant={plan.highlighted ? "hero" : "heroOutline"}
                  size="xl"
                  className="mt-8"
                  asChild
                >
                  <Link to={plan.destination}>{plan.cta}</Link>
                </Button>
              )}
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading title="Questions, answered" />
        <Accordion type="single" collapsible className="mx-auto mt-8 max-w-2xl">
          {faqs.map((faq) => (
            <AccordionItem key={faq.q} value={faq.q}>
              <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
    </>
  );
}
