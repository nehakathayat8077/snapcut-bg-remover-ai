import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHero, Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/payment-pending")({
  head: () => ({
    meta: [
      { title: "Payment Pending — SnapCut AI" },
      {
        name: "description",
        content:
          "Payment pending status page. This route is used while the payment is being processed or waiting on backend confirmation.",
      },
    ],
  }),
  component: PaymentPendingPage,
});

function PaymentPendingPage() {
  return (
    <>
      <PageHero
        eyebrow="Payment status"
        title="Payment pending"
        description="Your payment request has been created, but it is waiting for Razorpay or your backend to confirm the final order status. We will only mark the order as paid after server-side verification."
      />

      <Section className="pt-4">
        <div className="glass-card mx-auto max-w-2xl p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/15 text-3xl text-amber-500">
            ⏳
          </div>
          <h2 className="text-2xl font-semibold">Waiting for confirmation</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Add your polling or webhook instructions here. The backend should confirm the order status and
            route the customer to Success or Failed based on the verified payment result.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button variant="hero" asChild>
              <Link to="/pricing">Return to pricing</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/contact">Contact support</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
