import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, CreditCard, Download, FileText, KeyRound, ImageUp, LayoutGrid, Settings, Upload, UserCircle2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { getDashboardSummary, getImageSummary, readProcessedImages, type DashboardSummary, type ProcessedImageRecord } from "@/lib/payment-store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — SnapCut AI" },
      {
        name: "description",
        content: "View your plan, credits, recent images and verified payment history for SnapCut AI.",
      },
    ],
  }),
  component: DashboardPage,
});

export default DashboardPage;

const defaultSummary: DashboardSummary = {
  currentPlan: "Free",
  creditsAvailable: 0,
  totalSpent: 0,
  purchaseCount: 0,
  paymentHistory: [],
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string): string {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(value);
}

function formatProcessingTime(ms: number | null): string {
  if (ms === null || Number.isNaN(ms)) return "No data yet";
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}

function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>(defaultSummary);
  const [recentImages, setRecentImages] = useState<ProcessedImageRecord[]>([]);

  useEffect(() => {
    setSummary(getDashboardSummary());
    setRecentImages(readProcessedImages());
  }, []);

  const imageSummary = useMemo(() => getImageSummary(), [recentImages]);
  const recentPayment = summary.paymentHistory[0] ?? null;
  const creditsPurchased = summary.paymentHistory.reduce((sum, payment) => sum + payment.creditsAwarded, 0);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:py-10">
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="glass-card h-fit p-4 lg:sticky lg:top-20">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <UserCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Signed in</p>
              <p className="font-medium">SnapCut Pro</p>
            </div>
          </div>

          <nav className="mt-5 space-y-1.5">
            {[
              { label: "Dashboard", icon: LayoutGrid, active: true, to: "/dashboard" },
              { label: "Upload", icon: Upload, active: false, to: "/" },
              { label: "History", icon: FileText, active: false, to: "/history" },
              { label: "Billing", icon: CreditCard, active: false, to: "/history" },
              { label: "API Keys", icon: KeyRound, active: false, to: "/api-docs" },
              { label: "Settings", icon: Settings, active: false, to: "/contact" },
            ].map(({ label, icon: Icon, active, to }) => (
              <Link
                key={label}
                to={to}
                className={[
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-border/80 bg-background/40 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Current plan</p>
            <p className="mt-2 text-xl font-semibold">{summary.currentPlan}</p>
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>Credits remaining</span>
              <span className="font-medium text-foreground">{summary.creditsAvailable}</span>
            </div>
          </div>
        </aside>

        <main className="space-y-6">
          <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Overview</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">Dashboard</h1>
            </div>
            <Button variant="hero" size="sm" asChild>
              <Link to="/pricing">
                Upgrade <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Images Processed", value: imageSummary.totalProcessed.toString(), detail: "Completed jobs" },
              { label: "Credits Remaining", value: summary.creditsAvailable.toString(), detail: "Available in your account" },
              { label: "Images Processed This Month", value: imageSummary.processedThisMonth.toString(), detail: "Current month" },
              { label: "Average Processing Time", value: formatProcessingTime(imageSummary.averageProcessingMs), detail: "Across processed images" },
            ].map((item) => (
              <div key={item.label} className="glass-card p-4">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-4 text-3xl font-semibold text-foreground">{item.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            {[
              { title: "Upload Image", desc: "Start a new background removal", icon: Upload, to: "/" },
              { title: "View History", desc: "Review recent processing output", icon: FileText, to: "/history" },
              { title: "API Access", desc: "Manage keys and API usage", icon: KeyRound, to: "/api-docs" },
            ].map(({ title, desc, icon: Icon, to }) => (
              <Link key={title} to={to} className="glass-card flex items-center gap-4 p-4 transition-colors hover:border-primary/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{title}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </Link>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="glass-card p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Recent images</p>
                  <h2 className="mt-1 text-xl font-semibold">Processing history</h2>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/">Upload more</Link>
                </Button>
              </div>

              {recentImages.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-background/30 p-6 text-center text-sm text-muted-foreground">
                  No processed images yet. Upload an image to begin tracking your recent results here.
                </div>
              ) : (
                <div className="space-y-3">
                  {recentImages.map((item) => (
                    <div key={item.id} className="flex flex-col gap-3 rounded-xl border border-border/70 bg-background/30 p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">{item.fileName}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-emerald-500">
                          {item.status}
                        </span>
                        {item.outputUrl ? (
                          <a href={item.outputUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary">
                            View <Download className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">No output</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div id="billing" className="glass-card p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Billing</p>
              <h2 className="mt-1 text-xl font-semibold">Billing summary</h2>

              <dl className="mt-5 space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between gap-4">
                  <dt>Current plan</dt>
                  <dd className="font-medium text-foreground">{summary.currentPlan}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt>Credits remaining</dt>
                  <dd className="font-medium text-foreground">{summary.creditsAvailable}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt>Credits purchased</dt>
                  <dd className="font-medium text-foreground">{creditsPurchased}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt>Recent payment</dt>
                  <dd className="font-medium text-foreground">{recentPayment ? formatCurrency(recentPayment.amount) : "—"}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt>Payment status</dt>
                  <dd className="font-medium text-emerald-500">{recentPayment ? (recentPayment.status === "paid" ? "Success" : recentPayment.status) : "—"}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt>Payment date</dt>
                  <dd className="font-medium text-foreground">{recentPayment ? formatDate(recentPayment.paymentDate) : "—"}</dd>
                </div>
              </dl>

              <div className="mt-5 flex gap-3">
                <Button variant="hero" size="sm" asChild>
                  <Link to="/history">View payment history</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/pricing">Upgrade</Link>
                </Button>
              </div>
            </div>
          </section>

          <section className="glass-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Billing</p>
                <h2 className="mt-1 text-xl font-semibold">Payment history</h2>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/history">View all</Link>
              </Button>
            </div>

            {summary.paymentHistory.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-background/30 p-5 text-sm text-muted-foreground">
                No verified transactions yet. Your purchases will appear here once a Razorpay payment is confirmed.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-muted-foreground">
                    <tr className="border-b border-border/70">
                      <th className="pb-3 pr-4 font-medium">Plan / Pack</th>
                      <th className="pb-3 pr-4 font-medium">Amount</th>
                      <th className="pb-3 pr-4 font-medium">Date</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      <th className="pb-3 pr-4 font-medium">Order ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.paymentHistory.map((payment) => (
                      <tr key={`${payment.orderId}-${payment.paymentId}`} className="border-b border-border/50 align-top">
                        <td className="py-3 pr-4 font-medium text-foreground">{payment.planName}</td>
                        <td className="py-3 pr-4">{formatCurrency(payment.amount)}</td>
                        <td className="py-3 pr-4">{formatDate(payment.paymentDate)}</td>
                        <td className="py-3 pr-4">
                          <span className="inline-flex rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-emerald-500">
                            {payment.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">{payment.orderId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="glass-card p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">API access</p>
                <h2 className="mt-1 text-xl font-semibold">Developer API</h2>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/30 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-foreground">API keys and usage</p>
                <p className="text-sm text-muted-foreground">Manage your API keys, rate limits and integration details.</p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/api-docs">Open API docs</Link>
              </Button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
