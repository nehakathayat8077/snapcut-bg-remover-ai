import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-10 pt-16 text-center md:pt-24">
      {eyebrow && (
        <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
          {eyebrow}
        </span>
      )}
      <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">{title}</h1>
      {description && (
        <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
          {description}
        </p>
      )}
      {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
    </section>
  );
}

export function Section({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("mx-auto w-full max-w-6xl px-4 py-14", className)}>{children}</section>
  );
}

export function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-muted-foreground">{description}</p>}
    </div>
  );
}
