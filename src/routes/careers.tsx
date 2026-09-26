import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { PageHero, Section } from "@/components/site/Section";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — SnapCut AI" },
      {
        name: "description",
        content:
          "Career opportunities and hiring information for SnapCut AI. Update this page with your actual roles, contact details, and hiring process.",
      },
    ],
  }),
  component: CareersPage,
});

function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Company"
        title="Careers"
        description="This page is a placeholder for future hiring information. Add your real roles, hiring email, and application process before publishing publicly."
      />

      <Section className="pt-4">
        <div className="glass-card mx-auto max-w-3xl p-8">
          <h2 className="text-lg font-semibold">Hiring details placeholder</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Add your real roles, department names, application instructions, and any internal hiring
            policies here. Do not add invented company information, email addresses, office details, or
            benefits claims without confirming them.
          </p>

          <div className="mt-6 rounded-lg border border-dashed border-border bg-background/40 p-5 text-sm text-muted-foreground">
            Example fields to fill in later:
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Open roles</li>
              <li>Application email or form URL</li>
              <li>Location or remote policy</li>
              <li>Hiring process timeline</li>
            </ul>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button variant="hero" asChild>
              <Link to="/contact">Contact support</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/about">Learn about SnapCut</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
