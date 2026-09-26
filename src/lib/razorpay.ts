export type RazorpayOrderRequest = {
  plan: string;
  amount: number;
  currency?: string;
  receipt?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export type RazorpayOrderResponse = {
  id: string;
  amount: number;
  currency: string;
  receipt?: string;
  status: "created" | "pending" | string;
  key?: string;
};

export type RazorpayPaymentData = {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  [key: string]: unknown;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
      close: () => void;
    };
  }
}

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  handler?: (response: RazorpayPaymentData) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
};

const ENV_PUBLIC_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined;

export async function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (window.Razorpay) return true;

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function createRazorpayOrder(request: RazorpayOrderRequest): Promise<RazorpayOrderResponse> {
  const response = await fetch("/api/payments/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Unable to create Razorpay order.");
  }

  return (await response.json()) as RazorpayOrderResponse;
}

export async function verifyRazorpayPayment(payment: RazorpayPaymentData): Promise<{ ok: boolean }> {
  const response = await fetch("/api/payments/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payment),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Payment verification failed.");
  }

  return (await response.json()) as { ok: boolean };
}

export function getRazorpayPublicKey(): string | undefined {
  return ENV_PUBLIC_KEY;
}

export async function openRazorpayCheckout(options: {
  amount: number;
  currency?: string;
  name: string;
  description: string;
  orderId?: string;
  plan?: string;
  email?: string;
  contact?: string;
  onSuccess?: (response: RazorpayPaymentData) => void;
  onFailure?: (error: Error) => void;
  onDismiss?: () => void;
}): Promise<void> {
  const key = getRazorpayPublicKey();

  if (!key) {
    throw new Error("VITE_RAZORPAY_KEY_ID is not configured.");
  }

  const ready = await loadRazorpayScript();
  if (!ready || !window.Razorpay) {
    throw new Error("Razorpay checkout script could not be loaded.");
  }

  const razorpay = new window.Razorpay({
    key,
    amount: options.amount,
    currency: options.currency ?? "INR",
    name: options.name,
    description: options.description,
    order_id: options.orderId,
    prefill: {
      name: options.name,
      email: options.email,
      contact: options.contact,
    },
    theme: { color: "#14b8a6" },
    modal: {
      ondismiss: () => {
        options.onDismiss?.();
      },
    },
    handler: (response: RazorpayPaymentData) => {
      options.onSuccess?.(response);
    },
  });

  razorpay.open();
}

export function getRazorpayConfigHint(): string {
  return "Frontend stores only the public key, never the secret. Keep RAZORPAY_KEY_SECRET, WEBHOOK_SECRET, and all verification logic on the backend.";
}
