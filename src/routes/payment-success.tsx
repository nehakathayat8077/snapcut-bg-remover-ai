import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHero, Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/payment-success")({
  head: () => ({
    meta: [
      { title: "Payment Success — SnapCut AI" },
      {
        name: "description",
        content:
          "Payment success confirmation page. This page appears only after backend verification confirms the Razorpay payment.",
      },
    ],
  }),
  component: PaymentSuccessPage,
});

function PaymentSuccessPage() {
  return (
    <>
      <PageHero
        eyebrow="Payment status"
        title="Payment successful"
        description="This page is shown only after the backend verifies the Razorpay payment and confirms the order status. The frontend never marks a payment as paid on its own."
      />

      <Section className="pt-4">
        <div className="glass-card mx-auto max-w-2xl p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-3xl text-emerald-500">
            ✓
          </div>
          <h2 className="text-2xl font-semibold">Your payment has been confirmed</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Replace the placeholder details below with your real order summary once the backend is
            connected. Keep the final status driven by server-side verification.
          </p>

          <div className="mt-6 space-y-3 rounded-xl border border-border/60 bg-background/40 p-4 text-left text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Plan:</span> Pro Monthly
            </p>
            <p>
              <span className="font-medium text-foreground">Order ID:</span> placeholder-order-id
            </p>
            <p>
              <span className="font-medium text-foreground">Amount:</span> ₹799
            </p>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button variant="hero" asChild>
              <Link to="/pricing">Back to pricing</Link>
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
