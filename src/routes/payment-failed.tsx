import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHero, Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/payment-failed")({
  head: () => ({
    meta: [
      { title: "Payment Failed — SnapCut AI" },
      {
        name: "description",
        content:
          "Payment failed status page. Use this route when the backend rejects the Razorpay verification or the user cancels the checkout.",
      },
    ],
  }),
  component: PaymentFailedPage,
});

function PaymentFailedPage() {
  return (
    <>
      <PageHero
        eyebrow="Payment status"
        title="Payment failed"
        description="The payment was not completed or the order could not be verified by the backend. Please retry or contact support if you were charged but the order did not activate."
      />

      <Section className="pt-4">
        <div className="glass-card mx-auto max-w-2xl p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/15 text-3xl text-rose-500">
            !
          </div>
          <h2 className="text-2xl font-semibold">We could not complete your payment</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Add your retry flow and support instructions here. Do not mark the order as paid unless the
            backend confirms a valid Razorpay signature and payment status.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button variant="hero" asChild>
              <Link to="/pricing">Try again</Link>
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
