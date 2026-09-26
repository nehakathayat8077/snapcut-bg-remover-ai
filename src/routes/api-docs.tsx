import { createFileRoute } from "@tanstack/react-router";

import { PageHero, Section, SectionHeading } from "@/components/site/Section";

export const Route = createFileRoute("/api-docs")({
  head: () => ({
    meta: [
      { title: "API Docs — SnapCut AI" },
      {
        name: "description",
        content:
          "REST API reference for SnapCut AI: authenticate with an API key, submit an image and receive a transparent PNG URL.",
      },
      { property: "og:title", content: "API Docs — SnapCut AI" },
      {
        property: "og:description",
        content: "Authentication, endpoints, rate limits and error codes for the SnapCut AI API.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ApiDocsPage,
});

function Code({ children }: { children: string }) {
  return (
    <pre className="glass-card overflow-x-auto p-5 text-left text-sm leading-relaxed">
      <code className="text-muted-foreground">{children}</code>
    </pre>
  );
}

const endpoints = [
  ["POST", "/v1/remove", "Submit an image URL or multipart file for background removal."],
  ["GET", "/v1/jobs/:id", "Poll a job for status and the resulting transparent PNG URL."],
  ["GET", "/v1/usage", "Return credits used, credits remaining and the current plan."],
  ["GET", "/v1/keys", "List active API keys with their rate limits and last-used timestamps."],
];

function ApiDocsPage() {
  return (
    <>
      <PageHero
        eyebrow="Developers"
        title={
          <>
            The SnapCut <span className="gradient-text">API</span>
          </>
        }
        description="One endpoint to remove a background, one to poll the result. Keys, quotas and usage are managed from your dashboard."
      />

      <Section className="pt-4">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-bold">Authentication</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Send your key in the <code className="text-primary">Authorization</code> header. Keys
              are scoped per project and can be rotated at any time. Never expose a key in browser
              code.
            </p>
          </div>
          <Code>{`Authorization: Bearer sk_live_xxxxxxxxxxxxxxxx
Content-Type: application/json`}</Code>
        </div>
      </Section>

      <Section className="pt-0">
        <SectionHeading title="Endpoints" />
        <div className="mt-8 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-card/60">
              <tr>
                <th className="px-5 py-3 font-semibold">Method</th>
                <th className="px-5 py-3 font-semibold">Path</th>
                <th className="px-5 py-3 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map(([method, path, desc]) => (
                <tr key={path} className="border-t border-border">
                  <td className="px-5 py-3 font-mono text-primary">{method}</td>
                  <td className="px-5 py-3 font-mono text-foreground">{path}</td>
                  <td className="px-5 py-3 text-muted-foreground">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-xl font-bold">Example request</h3>
            <div className="mt-4">
              <Code>{`curl https://api.snapcut.ai/v1/remove \\
  -H "Authorization: Bearer $SNAPCUT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "image_url": "https://cdn.example.com/shoe.jpg",
    "output_format": "png"
  }'`}</Code>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold">Example response</h3>
            <div className="mt-4">
              <Code>{`{
  "id": "job_8f21c0b4",
  "status": "succeeded",
  "result_url": "https://cdn.snapcut.ai/tmp/8f21c0b4.png",
  "credits_used": 1,
  "expires_at": "2026-01-02T10:04:11Z"
}`}</Code>
            </div>
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <SectionHeading
          title="Rate limits and errors"
          description="Limits apply per API key and reset every minute."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Free", "10 req / min"],
            ["Pro", "120 req / min"],
            ["Credit packs", "60 req / min"],
            ["Burst window", "60 seconds"],
          ].map(([label, value]) => (
            <div key={label} className="glass-card p-6 text-center">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 font-display text-xl font-bold gradient-text">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Code>{`400  invalid_image        File type or size rejected
401  invalid_api_key      Key missing, revoked or malformed
402  insufficient_credits Top up credits or upgrade the plan
429  rate_limited         Retry after the Retry-After header
500  processing_failed    Job failed; the credit is refunded`}</Code>
        </div>
      </Section>
    </>
  );
}
