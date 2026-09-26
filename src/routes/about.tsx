import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — SnapCut AI" },
      {
        name: "description",
        content:
          "SnapCut AI is a small team building one tool exceptionally well: fast, private, one-click background removal.",
      },
      { property: "og:title", content: "About — SnapCut AI" },
      {
        property: "og:description",
        content: "Why we build a single-purpose background remover instead of another photo editor.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const values = [
  {
    title: "One job, done well",
    body: "No editor, no filters, no social feed. SnapCut removes backgrounds and gets out of the way.",
  },
  {
    title: "Privacy is the default",
    body: "Images are processed and deleted within 24 hours. We never train on customer uploads.",
  },
  {
    title: "Honest pricing",
    body: "A real free tier, a flat Pro plan and credits that never expire. No hidden per-seat fees.",
  },
];

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={
          <>
            Built for people who ship <span className="gradient-text">a lot of images</span>
          </>
        }
        description="SnapCut AI started as an internal tool for a product photography studio drowning in cutout requests. It turned out everyone had the same problem."
      />

      <Section className="pt-4">
        <div className="grid gap-5 md:grid-cols-3">
          {values.map((value) => (
            <article key={value.title} className="glass-card p-7">
              <h2 className="text-lg font-semibold">{value.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{value.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <div className="glass-card glow-ring px-8 py-12 text-center">
          <SectionHeading
            title="Want to talk to us?"
            description="Partnerships, bulk pricing, or just feedback on the product — we read everything."
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">Contact the team</Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/pricing">See pricing</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
