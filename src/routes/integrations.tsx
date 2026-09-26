import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { PageHero, Section } from "@/components/site/Section";

export const Route = createFileRoute("/integrations")({
  head: () => ({
    meta: [
      { title: "Integrations — SnapCut AI" },
      {
        name: "description",
        content:
          "Integration options for SnapCut AI, including API access, webhooks, and workflow automation. Add your actual partner or platform details here.",
      },
    ],
  }),
  component: IntegrationsPage,
});

const integrations = [
  {
    title: "API and webhooks",
    body:
      "Use the SnapCut AI API to submit image jobs, monitor their status, and retrieve processed backgrounds. Add your real webhook endpoint and authentication details here once your backend is ready.",
  },
  {
    title: "Workflow automation",
    body:
      "This product currently connects to n8n-based automation workflows for processing and image delivery. Add your actual integrations, examples, and supported triggers as they are finalized.",
  },
  {
    title: "Third-party services",
    body:
      "SnapCut may rely on external processing and storage providers for file handling and delivery, including Cloudinary and other backend services required by the application. Add any specific partner details here and keep the wording accurate to your actual implementation.",
  },
];

function IntegrationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Product"
        title="Integrations"
        description="SnapCut AI is designed for fast image-processing workflows and easier automation. Update this page with your real partner integrations, webhook setup steps, and supported platforms."
      />

      <Section className="pt-4">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {integrations.map((integration) => (
            <article key={integration.title} className="glass-card p-7">
              <h2 className="text-lg font-semibold">{integration.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{integration.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="hero" asChild>
            <Link to="/api-docs">Read API docs</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/contact">Contact sales</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
