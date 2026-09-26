import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock3,
  Download,
  FileSearch,
  ImageDown,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";
import { cn } from "@/lib/utils";
import logo from "@/assets/snapcut-logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SnapCut AI — One-Click AI Background Remover" },
      {
        name: "description",
        content:
          "Remove image backgrounds in under five seconds with SnapCut AI. Transparent PNGs, batch uploads, a developer API and automatic 24-hour deletion.",
      },
      { property: "og:title", content: "SnapCut AI — One-Click AI Background Remover" },
      {
        property: "og:description",
        content:
          "Drop an image, get a clean transparent cutout in seconds. Free to start, API ready.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const steps = [
  {
    icon: Upload,
    title: "Drop your image",
    body: "JPG, PNG or WEBP up to 10 MB and 5000 × 5000 pixels. Drag a folder for batch work.",
  },
  {
    icon: Sparkles,
    title: "AI cuts it out",
    body: "Edges, hair and soft shadows are detected automatically. Typical job finishes in under 5 seconds.",
  },
  {
    icon: ImageDown,
    title: "Download the PNG",
    body: "Full-resolution transparent PNG, ready for your storefront, deck or ad creative.",
  },
];

const highlights = [
  { icon: Zap, label: "< 5s", detail: "average processing time" },
  { icon: Clock3, label: "24h", detail: "automatic file deletion" },
  { icon: ShieldCheck, label: "99.5%", detail: "monthly uptime target" },
];

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const WEBHOOK_URL =
  "https://nehakathayat8077.app.n8n.cloud/webhook/remove-background";

function extractResultUrl(data: unknown): string | null {
  if (typeof data === "string") {
    const trimmed = data.trim().replace(/^`+|`+$/g, "");
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    try {
      return extractResultUrl(JSON.parse(trimmed));
    } catch {
      return null;
    }
  }

  if (Array.isArray(data) && data.length > 0) {
    return extractResultUrl(data[0]);
  }

  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;
  const direct = [record.url, record.processedUrl, record.imageUrl, record.secure_url];
  for (const value of direct) {
    if (typeof value === "string") {
      const trimmed = value.trim().replace(/^`+|`+$/g, "");
      if (/^https?:\/\//i.test(trimmed)) return trimmed;
    }
  }

  for (const nestedKey of ["data", "result", "body", "json", "output"]) {
    const nested = record[nestedKey];
    if (nested && typeof nested === "object") {
      const found = extractResultUrl(nested);
      if (found) return found;
    }
  }

  return null;
}

function toDisplayImageUrl(url: string) {
  // Avoid mixed-content blocking when the app is served over HTTPS.
  if (url.startsWith("http://res.cloudinary.com/")) {
    return `https://${url.slice("http://".length)}`;
  }
  return url;
}

function Index() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processError, setProcessError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | null) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      alert("Please select a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Max size is 10 MB.");
      return;
    }
    setOriginalFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
      setFileName(file.name);
      setProcessedUrl(null);
      setProcessError(null);
      setDownloadError(null);
      setIsDownloading(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleClear = useCallback(() => {
    setOriginalFile(null);
    setPreviewUrl(null);
    setFileName(null);
    setProcessedUrl(null);
    setProcessError(null);
    setDownloadError(null);
    setIsDownloading(false);
    setIsProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!originalFile || !previewUrl) return;
    setIsProcessing(true);
    setProcessedUrl(null);
    setProcessError(null);
    setDownloadError(null);
    try {
      const formData = new FormData();
      formData.append("your_input_image", originalFile, fileName ?? "snapcut-image");

      const targetUrl = new URL(WEBHOOK_URL);
      targetUrl.searchParams.set("filename", fileName ?? "snapcut-image");

      const response = await fetch(targetUrl.toString(), {
        method: "POST",
        body: formData,
      });

      const rawText = await response.text();

      if (!response.ok) {
        let message = `Request failed (${response.status} ${response.statusText}).`;
        try {
          const parsed = JSON.parse(rawText) as { message?: unknown };
          if (typeof parsed.message === "string" && parsed.message.trim()) {
            message = parsed.message;
          }
        } catch {
          /* keep generic HTTP message — never dump raw JSON to the UI */
        }
        setProcessError(message);
        return;
      }

      if (!rawText || rawText.length === 0) {
        setProcessError("The server returned an empty response.");
        return;
      }

      let data: unknown = null;
      try {
        data = JSON.parse(rawText);
      } catch {
        setProcessError("The server response was not valid JSON.");
        return;
      }

      const resultUrl = extractResultUrl(data);
      if (!resultUrl) {
        setProcessError("The response did not include an image URL.");
        return;
      }

      setProcessedUrl(toDisplayImageUrl(resultUrl));
    } catch (err) {
      console.error("Remove background webhook failed:", err);
      setProcessError(
        err instanceof Error
          ? `Could not process the image: ${err.message}`
          : "Could not process the image. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  }, [originalFile, previewUrl, fileName]);

  const saveBlob = useCallback((blob: Blob, filename: string) => {
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!processedUrl) return;
    const baseName = (fileName ?? "snapcut-image").replace(/\.[^.]+$/, "");
    const filename = `${baseName}-no-bg.png`;
    setIsDownloading(true);
    setDownloadError(null);
    try {
      const response = await fetch(processedUrl);
      if (!response.ok) {
        throw new Error(`Download failed (${response.status}).`);
      }
      const blob = await response.blob();
      saveBlob(blob, filename);
    } catch (err) {
      try {
        const img = document.querySelector<HTMLImageElement>('img[alt="Background removed"]');
        if (!img?.naturalWidth) throw err;
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw err;
        ctx.drawImage(img, 0, 0);
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/png"),
        );
        if (!blob) throw err;
        saveBlob(blob, filename);
      } catch {
        setDownloadError("Could not download the image. Please try again.");
      }
    } finally {
      setIsDownloading(false);
    }
  }, [processedUrl, fileName, saveBlob]);

  const handleProcessAnother = useCallback(() => {
    handleClear();
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  }, [handleClear]);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            handleFile(file);
            e.preventDefault();
            break;
          }
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [handleFile]);

  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-4 pb-8 pt-16 md:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
              <Sparkles className="size-3.5" /> AI background removal
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.08] md:text-6xl">
              Remove any background in <span className="gradient-text">one click</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg lg:mx-0">
              SnapCut AI turns product photos, portraits and packshots into clean transparent PNGs
              in seconds. No editor to learn, nothing stored longer than a day.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Button variant="hero" size="xl" asChild>
                <Link to="/pricing">
                  Start free — 5 images a day <ArrowRight />
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/features">See how it works</Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 text-center lg:mx-0 lg:text-left">
              {highlights.map((item) => (
                <div key={item.label}>
                  <dt className="sr-only">{item.detail}</dt>
                  <dd>
                    <span className="font-display text-2xl font-bold text-foreground">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">{item.detail}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="glass-card glow-ring p-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-secondary/50 p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Before</p>
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview before"
                    className="mt-3 aspect-square w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="mt-3 aspect-square rounded-lg bg-[image:var(--gradient-brand)] opacity-80" />
                )}
              </div>
              <div className="rounded-xl border border-border bg-secondary/50 p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">After</p>
                {processedUrl ? (
                  <img
                    src={processedUrl}
                    alt="Background removed"
                    crossOrigin="anonymous"
                    className="checker-surface mt-3 aspect-square w-full rounded-lg object-contain"
                    onError={() => {
                      setProcessedUrl(null);
                      setProcessError("The result image could not be loaded.");
                    }}
                  />
                ) : isProcessing ? (
                  <div className="checker-surface mt-3 flex aspect-square items-center justify-center rounded-lg border border-border">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                      <p className="text-xs text-muted-foreground">Cutting it out…</p>
                    </div>
                  </div>
                ) : processError ? (
                  <div className="checker-surface mt-3 flex aspect-square items-center justify-center rounded-lg border border-border px-3 text-center">
                    <p className="text-xs text-destructive">{processError}</p>
                  </div>
                ) : (
                  <div className="checker-surface mt-3 aspect-square rounded-lg border border-border" />
                )}
              </div>
            </div>

            <div
              ref={dropRef}
              className={cn(
                "mt-4 relative rounded-xl border-2 border-dashed bg-primary/5 p-4 transition-all duration-200",
                isDragging
                  ? "border-primary bg-primary/15 scale-[1.01] shadow-lg"
                  : "border-primary/40",
              )}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.currentTarget === e.target) setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
                const files = e.dataTransfer.files;
                if (files && files.length > 0) {
                  handleFile(files[0]);
                }
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) handleFile(files[0]);
                }}
              />

              {previewUrl ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-border">
                      <img src={previewUrl} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {fileName ?? "Image ready to process"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Press <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px]">Ctrl</kbd>{" "}
                        +{" "}
                        <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px]">V</kbd> to
                        replace · Max 10 MB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClear}
                      disabled={isProcessing}
                      className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-foreground disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Clear image</span>
                    </Button>
                  </div>

                  {!processedUrl ? (
                    <Button
                      type="button"
                      size="default"
                      variant="hero"
                      onClick={handleGenerate}
                      disabled={isProcessing}
                      className="w-full gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <Sparkles className="h-4 w-4 animate-pulse" />
                          AI is removing the background…
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Generate Image
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          type="button"
                          size="default"
                          variant="hero"
                          onClick={handleDownload}
                          disabled={isDownloading}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          {isDownloading ? "Downloading…" : "Download PNG"}
                        </Button>
                        <Button
                          type="button"
                          size="default"
                          variant="secondary"
                          onClick={handleProcessAnother}
                          disabled={isDownloading}
                          className="gap-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Process Another
                        </Button>
                      </div>
                      {downloadError ? (
                        <p className="text-center text-xs text-destructive">{downloadError}</p>
                      ) : null}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    {isDragging ? (
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary ring-2 ring-primary/40">
                        <Upload className="h-5 w-5 animate-bounce" />
                      </div>
                    ) : (
                      <img src={logo.url} alt="" className="h-10 w-10 rounded-lg" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {isDragging ? "Release to upload your image" : "Drop an image to begin"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        JPG · PNG · WEBP — up to 10 MB, deleted after 24 hours
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={handleBrowseClick}
                      className="gap-2"
                    >
                      <FileSearch className="h-4 w-4" />
                      Browse files
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      or paste with{" "}
                      <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                        Ctrl
                      </kbd>{" "}
                      +{" "}
                      <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                        V
                      </kbd>
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Section>
        <SectionHeading
          title="Three steps, no learning curve"
          description="Built for people who need the cutout, not another photo editor."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((step, i) => (
            <article key={step.title} className="glass-card p-7">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <step.icon className="size-5" />
                </span>
                <span className="font-display text-sm text-muted-foreground">Step {i + 1}</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <div className="glass-card glow-ring px-8 py-14 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Your next cutout is <span className="gradient-text">five seconds away</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Start on the free plan, upgrade when your catalog grows, or plug SnapCut straight into
            your pipeline with the API.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="hero" size="xl" asChild>
              <Link to="/pricing">Get started free</Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/api-docs">Explore the API</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
