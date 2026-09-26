import { createFileRoute } from "@tanstack/react-router";

import { PageHero, Section } from "@/components/site/Section";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — SnapCut AI" },
      {
        name: "description",
        content:
          "Guides on product photography, transparent PNGs, bulk image workflows and automating cutouts with the SnapCut AI API.",
      },
      { property: "og:title", content: "Blog — SnapCut AI" },
      {
        property: "og:description",
        content: "Practical writing on cutouts, catalog images and image automation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogPage,
});

const posts = [
  {
    title: "Why transparent PNGs still beat clipping paths",
    excerpt:
      "Clipping paths were built for print. Here is why an alpha channel is the better default for online catalogs.",
    tag: "Guides",
    date: "12 Mar 2026",
    read: "6 min read",
  },
  {
    title: "Preparing 500 product photos for a marketplace launch",
    excerpt:
      "A repeatable workflow for shooting, cutting out and exporting a full catalog in a single afternoon.",
    tag: "Workflow",
    date: "28 Feb 2026",
    read: "9 min read",
  },
  {
    title: "Automating cutouts with the SnapCut API and webhooks",
    excerpt:
      "Push a photo from your PIM, get a transparent PNG back automatically. A walkthrough with real payloads.",
    tag: "Engineering",
    date: "05 Feb 2026",
    read: "8 min read",
  },
  {
    title: "Hair, fur and glass: the hard edges of background removal",
    excerpt:
      "What makes certain subjects difficult, and how to shoot them so any remover handles them cleanly.",
    tag: "Photography",
    date: "19 Jan 2026",
    read: "7 min read",
  },
];

function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title={
          <>
            Notes on <span className="gradient-text">image workflows</span>
          </>
        }
        description="Short, practical pieces on getting clean cutouts and shipping catalog images faster."
      />

      <Section className="pt-4">
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <article key={post.title} className="glass-card flex flex-col p-7">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-medium text-primary">
                  {post.tag}
                </span>
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.read}</span>
              </div>
              <h2 className="mt-4 text-xl font-semibold">{post.title}</h2>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
