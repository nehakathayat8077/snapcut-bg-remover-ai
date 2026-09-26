import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHero, Section } from "@/components/site/Section";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — SnapCut AI" },
      {
        name: "description",
        content:
          "Questions about plans, bulk pricing or the API? Send the SnapCut AI team a message and we'll reply within one business day.",
      },
      { property: "og:title", content: "Contact — SnapCut AI" },
      {
        property: "og:description",
        content: "Reach the SnapCut AI team about pricing, API access or support.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  message: z.string().trim().min(10, "Tell us a little more (10+ characters)").max(1000),
});

function ContactPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const result = schema.safeParse(data);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    toast.success("Message sent", {
      description: "We'll get back to you within one business day.",
    });
    form.reset();
    setSubmitting(false);
  }

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Talk to <span className="gradient-text">SnapCut AI</span>
          </>
        }
        description="Support, bulk pricing, API onboarding or partnerships — one form for all of it."
      />

      <Section className="pt-4">
        <form onSubmit={handleSubmit} noValidate className="glass-card mx-auto max-w-xl p-8">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Priya Sharma" maxLength={100} />
              {errors['name'] && <p className="text-sm text-destructive">{errors['name']}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                maxLength={255}
              />
              {errors['email'] && <p className="text-sm text-destructive">{errors['email']}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                rows={5}
                placeholder="How can we help?"
                maxLength={1000}
              />
              {errors['message'] && <p className="text-sm text-destructive">{errors['message']}</p>}
            </div>
            <Button type="submit" variant="hero" size="xl" className="w-full" disabled={submitting}>
              Send message
            </Button>
          </div>
        </form>
      </Section>
    </>
  );
}
