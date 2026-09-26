import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

const PAYMENT_PLANS = {
  "pro-monthly": {
    slug: "pro-monthly",
    name: "Pro Monthly",
    amount: 79900,
    currency: "INR",
    description: "SnapCut Pro Monthly",
  },
  "credit-packs": {
    slug: "credit-packs",
    name: "Credit Packs",
    amount: 49900,
    currency: "INR",
    description: "SnapCut Credit Pack",
  },
} as const;

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

function getRuntimeEnv(input: unknown): Record<string, string | undefined> {
  const runtime = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const processEnv = typeof process !== "undefined" && process.env ? process.env : {};
  const merged = { ...processEnv, ...runtime } as Record<string, unknown>;

  return Object.fromEntries(
    Object.entries(merged)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)]),
  );
}

function getEnvValue(input: unknown, key: string): string | undefined {
  return getRuntimeEnv(input)[key];
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}

async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function resolvePlan(planName: string | undefined): (typeof PAYMENT_PLANS)[keyof typeof PAYMENT_PLANS] | null {
  if (!planName) return PAYMENT_PLANS["pro-monthly"];

  const normalized = planName.trim().toLowerCase().replace(/\s+/g, "-");
  if (normalized === "pro") return PAYMENT_PLANS["pro-monthly"];
  if (normalized === "credits" || normalized === "credit") return PAYMENT_PLANS["credit-packs"];

  return PAYMENT_PLANS[normalized as keyof typeof PAYMENT_PLANS] ?? null;
}

function getAuthHeader(keyId: string, keySecret: string): string {
  const raw = `${keyId}:${keySecret}`;
  if (typeof Buffer !== "undefined") {
    return `Basic ${Buffer.from(raw).toString("base64")}`;
  }
  return `Basic ${btoa(raw)}`;
}

async function createRazorpaySignature(secret: string, payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signatureBytes = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(signatureBytes))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeEquals(left: string, right: string): boolean {
  const leftBytes = new TextEncoder().encode(left);
  const rightBytes = new TextEncoder().encode(right);

  if (leftBytes.length !== rightBytes.length) return false;

  let diff = 0;
  for (let index = 0; index < leftBytes.length; index += 1) {
    diff |= leftBytes[index] ^ rightBytes[index];
  }

  return diff === 0;
}

async function callRazorpayApi(path: string, method: string, keyId: string, keySecret: string, body?: unknown) {
  const response = await fetch(`https://api.razorpay.com/v1${path}`, {
    method,
    headers: {
      Authorization: getAuthHeader(keyId, keySecret),
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await response.text();
  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }

  if (!response.ok) {
    throw new Error(
      typeof data === "object" && data && "error" in data && data.error && typeof data.error === "object"
        ? JSON.stringify((data as { error: Record<string, unknown> }).error)
        : `Razorpay API error ${response.status}`,
    );
  }

  return data;
}

async function handleCreateOrder(request: Request, env: unknown): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse({ ok: false, message: "Method not allowed" }, 405);
  }

  const keyId = getEnvValue(env, "RAZORPAY_KEY_ID");
  const keySecret = getEnvValue(env, "RAZORPAY_KEY_SECRET");

  if (!keyId || !keySecret) {
    return jsonResponse({ ok: false, message: "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be configured on the backend." }, 500);
  }

  const payload = await readJsonBody(request);
  const selectedPlan = resolvePlan(typeof payload.plan === "string" ? payload.plan : undefined);

  if (!selectedPlan) {
    return jsonResponse({ ok: false, message: "A valid plan is required to create a Razorpay order." }, 400);
  }

  try {
    const orderPayload = {
      amount: selectedPlan.amount,
      currency: selectedPlan.currency,
      receipt: `snapcut-${selectedPlan.slug}-${Date.now()}`,
      notes: {
        plan: selectedPlan.slug,
        source: "snapcut-ai",
        mode: "test",
      },
    };

    const order = (await callRazorpayApi(
      "/orders",
      "POST",
      keyId,
      keySecret,
      orderPayload,
    )) as {
      id?: string;
      amount?: number;
      currency?: string;
      receipt?: string;
      status?: string;
    };

    return jsonResponse({
      ok: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      key: keyId,
      plan: selectedPlan.slug,
    });
  } catch (error) {
    console.error("create-order error", error);
    return jsonResponse(
      {
        ok: false,
        message: "Could not create a Razorpay order at this time.",
      },
      500,
    );
  }
}

async function handleVerifyPayment(request: Request, env: unknown): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse({ ok: false, message: "Method not allowed" }, 405);
  }

  const keyId = getEnvValue(env, "RAZORPAY_KEY_ID");
  const keySecret = getEnvValue(env, "RAZORPAY_KEY_SECRET");

  if (!keyId || !keySecret) {
    return jsonResponse({ ok: false, message: "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be configured on the backend." }, 500);
  }

  const payload = await readJsonBody(request);
  const razorpayOrderId = typeof payload.razorpay_order_id === "string" ? payload.razorpay_order_id : "";
  const razorpayPaymentId = typeof payload.razorpay_payment_id === "string" ? payload.razorpay_payment_id : "";
  const razorpaySignature = typeof payload.razorpay_signature === "string" ? payload.razorpay_signature : "";

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return jsonResponse({ ok: false, status: "failed", message: "Missing Razorpay payment details." }, 400);
  }

  try {
    const generatedSignature = await createRazorpaySignature(keySecret, `${razorpayOrderId}|${razorpayPaymentId}`);
    const signatureValid = constantTimeEquals(generatedSignature, razorpaySignature);

    if (!signatureValid) {
      return jsonResponse({ ok: false, status: "failed", message: "Razorpay signature verification failed." }, 400);
    }

    const paymentDetails = (await callRazorpayApi(
      `/payments/${razorpayPaymentId}`,
      "GET",
      keyId,
      keySecret,
    )) as {
      id?: string;
      amount?: number;
      currency?: string;
      status?: string;
      captured?: boolean;
      order_id?: string;
      description?: string;
    };

    const orderDetails = (await callRazorpayApi(
      `/orders/${razorpayOrderId}`,
      "GET",
      keyId,
      keySecret,
    )) as {
      amount?: number;
      currency?: string;
      notes?: Record<string, unknown>;
      status?: string;
    };

    const expectedAmount = Number(orderDetails.amount ?? 0);
    const actualAmount = Number(paymentDetails.amount ?? 0);
    const sameAmount = expectedAmount > 0 && actualAmount === expectedAmount;
    const paymentCaptured = paymentDetails.captured === true || paymentDetails.status === "captured";

    if (!sameAmount) {
      return jsonResponse({ ok: false, status: "failed", message: "Amount mismatch in Razorpay verification." }, 400);
    }

    if (paymentCaptured) {
      return jsonResponse({ ok: true, status: "paid", message: "Payment verified." });
    }

    if (paymentDetails.status === "pending" || paymentDetails.status === "created") {
      return jsonResponse({ ok: true, status: "pending", message: "Payment is still pending verification." });
    }

    return jsonResponse({ ok: false, status: "failed", message: "Payment was not completed." }, 400);
  } catch (error) {
    console.error("verify-payment error", error);
    return jsonResponse({ ok: false, status: "failed", message: "Payment verification could not complete." }, 500);
  }
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);

      if (url.pathname === "/api/payments/create-order") {
        return await handleCreateOrder(request, env);
      }

      if (url.pathname === "/api/payments/verify") {
        return await handleVerifyPayment(request, env);
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
