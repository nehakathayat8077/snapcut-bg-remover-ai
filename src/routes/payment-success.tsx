import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { PageHero, Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { readPaymentHistory } from "@/lib/payment-store";

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
  const [payment, setPayment] = useState<{
    planName: string;
    orderId: string;
    paymentId: string;
    amount: number;
    status: string;
  } | null>(null);

  useEffect(() => {
    const history = readPaymentHistory();
    const latest = history.find((item) => item.status === "paid") ?? null;

    if (latest) {
      setPayment({
        planName: latest.planName,
        orderId: latest.orderId,
        paymentId: latest.paymentId,
        amount: latest.amount,
        status: latest.status,
      });
    }
  }, []);

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
            The transaction below reflects the last verified payment saved for the current user in the app.
          </p>

          <div className="mt-6 space-y-3 rounded-xl border border-border/60 bg-background/40 p-4 text-left text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Plan:</span> {payment?.planName ?? "—"}
            </p>
            <p>
              <span className="font-medium text-foreground">Order ID:</span> {payment?.orderId ?? "—"}
            </p>
            <p>
              <span className="font-medium text-foreground">Payment ID:</span> {payment?.paymentId ?? "—"}
            </p>
            <p>
              <span className="font-medium text-foreground">Amount:</span> {payment ? `₹${(payment.amount / 100).toFixed(2)}` : "—"}
            </p>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button variant="hero" asChild>
              <Link to="/dashboard">View dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/pricing">Back to pricing</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
