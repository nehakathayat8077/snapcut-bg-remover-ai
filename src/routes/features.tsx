import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Boxes,
  Clock3,
  Gauge,
  KeyRound,
  Layers,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — SnapCut AI Background Remover" },
      {
        name: "description",
        content:
          "Studio-quality edge detection, batch processing, a developer API and 24-hour auto-deletion. See everything SnapCut AI does.",
      },
      { property: "og:title", content: "Features — SnapCut AI Background Remover" },
      {
        property: "og:description",
        content:
          "Studio-quality cutouts in under five seconds, batch uploads, API access and automatic file deletion.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FeaturesPage,
});

const features = [
  {
    icon: Sparkles,
    title: "Studio-grade edges",
    body: "Hair, fur, glass and motion blur stay intact. Our model is tuned for e-commerce and portrait subjects.",
  },
  {
    icon: Gauge,
    title: "Under five seconds",
    body: "Average processing time stays below 5s per image, even at 5000x5000 resolution.",
  },
  {
    icon: Layers,
    title: "Batch workspace",
    body: "Drop a whole folder. Track every file's progress and download the finished set as a ZIP.",
  },
  {
    icon: Clock3,
    title: "24-hour auto-delete",
    body: "Originals and cutouts are wiped automatically. Nothing is stored permanently, ever.",
  },
  {
    icon: KeyRound,
    title: "Developer API",
    body: "Scoped API keys, per-key rate limits and usage tracking so you can wire SnapCut into your pipeline.",
  },
  {
    icon: Workflow,
    title: "Automation ready",
    body: "Webhook callbacks let you push finished cutouts straight into your CMS, PIM or storefront.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    body: "HTTPS everywhere, encrypted secrets, audit logging and OWASP-aligned request validation.",
  },
  {
    icon: Boxes,
    title: "Transparent PNG output",
    body: "True alpha channels, original resolution preserved, JPG / PNG / WEBP inputs up to 10 MB.",
  },
];

function FeaturesPage() {
  return (
    <>
      <PageHero
        eyebrow="Features"
        title={
          <>
            Everything you need to <span className="gradient-text">cut out the background</span>
          </>
        }
        description="A focused toolset: upload, remove, download. No bloated editor, no learning curve."
      >
        <Button variant="hero" size="xl" asChild>
          <Link to="/pricing">See pricing</Link>
        </Button>
        <Button variant="heroOutline" size="xl" asChild>
          <Link to="/api-docs">Read the API docs</Link>
        </Button>
      </PageHero>

      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article key={feature.title} className="glass-card p-6">
              <feature.icon className="size-6 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          title="Built for the limits you actually hit"
          description="Clear boundaries, published up front — no surprise failures mid-batch."
        />
        <dl className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Max file size", "10 MB"],
            ["Max resolution", "5000 × 5000"],
            ["Formats", "JPG · PNG · WEBP"],
            ["Retention", "24 hours"],
          ].map(([label, value]) => (
            <div key={label} className="glass-card p-6 text-center">
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd className="mt-2 font-display text-2xl font-bold gradient-text">{value}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  );
}
