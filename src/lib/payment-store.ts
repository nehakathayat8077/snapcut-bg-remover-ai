export type PaymentStatus = "paid" | "pending" | "failed";

export type PaymentTransaction = {
  id: string;
  userId: string;
  planKey: "pro-monthly" | "credit-packs" | "free";
  planName: string;
  creditsAwarded: number;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentDate: string;
  orderId: string;
  paymentId: string;
  receipt?: string;
};

export type ProcessedImageRecord = {
  id: string;
  userId: string;
  fileName: string;
  status: "completed" | "failed" | "processing";
  createdAt: string;
  outputUrl?: string;
  processingMs?: number;
};

export type DashboardSummary = {
  currentPlan: string;
  creditsAvailable: number;
  totalSpent: number;
  purchaseCount: number;
  paymentHistory: PaymentTransaction[];
};

export type ImageSummary = {
  totalProcessed: number;
  processedThisMonth: number;
  averageProcessingMs: number | null;
  recentImages: ProcessedImageRecord[];
};

const PAYMENT_STORAGE_KEY = "snapcut-user-payment-history-v1";
const IMAGE_STORAGE_KEY = "snapcut-user-image-history-v1";

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getCurrentUserId(): string {
  return "demo-user";
}

export function readPaymentHistory(): PaymentTransaction[] {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const raw = storage.getItem(PAYMENT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PaymentTransaction[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveVerifiedPayment(input: {
  planKey: "pro-monthly" | "credit-packs" | "free";
  planName: string;
  amount: number;
  currency: string;
  orderId: string;
  paymentId: string;
  receipt?: string;
  creditsAwarded?: number;
}): PaymentTransaction | null {
  const storage = getStorage();
  if (!storage) return null;

  const history = readPaymentHistory();
  const duplicate = history.some(
    (transaction) => transaction.paymentId === input.paymentId || transaction.orderId === input.orderId,
  );

  if (duplicate) {
    return history.find(
      (transaction) => transaction.paymentId === input.paymentId || transaction.orderId === input.orderId,
    ) ?? null;
  }

  const transaction: PaymentTransaction = {
    id: input.paymentId || input.orderId || crypto.randomUUID(),
    userId: getCurrentUserId(),
    planKey: input.planKey,
    planName: input.planName,
    creditsAwarded: input.creditsAwarded ?? 0,
    amount: input.amount,
    currency: input.currency,
    status: "paid",
    paymentDate: new Date().toISOString(),
    orderId: input.orderId,
    paymentId: input.paymentId,
    receipt: input.receipt,
  };

  const nextHistory = [transaction, ...history].slice(0, 50);
  storage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(nextHistory));
  return transaction;
}

export function readProcessedImages(): ProcessedImageRecord[] {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const raw = storage.getItem(IMAGE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ProcessedImageRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveProcessedImage(input: {
  fileName: string;
  status: "completed" | "failed" | "processing";
  outputUrl?: string;
  processingMs?: number;
}): ProcessedImageRecord | null {
  const storage = getStorage();
  if (!storage) return null;

  const history = readProcessedImages();
  const record: ProcessedImageRecord = {
    id: crypto.randomUUID(),
    userId: getCurrentUserId(),
    fileName: input.fileName || "untitled-image",
    status: input.status,
    createdAt: new Date().toISOString(),
    outputUrl: input.outputUrl,
    processingMs: input.processingMs,
  };

  const nextHistory = [record, ...history].slice(0, 25);
  storage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(nextHistory));
  return record;
}

export function getDashboardSummary(): DashboardSummary {
  const paymentHistory = readPaymentHistory().filter((payment) => payment.status === "paid");

  const creditsAvailable = paymentHistory.reduce((sum, payment) => sum + payment.creditsAwarded, 0);
  const totalSpent = paymentHistory.reduce((sum, payment) => sum + payment.amount, 0);
  const currentPlan =
    paymentHistory.find((payment) => payment.planKey === "pro-monthly")?.planName ??
    (paymentHistory.length > 0 ? paymentHistory[0].planName : "Free");

  return {
    currentPlan,
    creditsAvailable,
    totalSpent,
    purchaseCount: paymentHistory.length,
    paymentHistory,
  };
}

export function getImageSummary(): ImageSummary {
  const recentImages = readProcessedImages();
  const totalProcessed = recentImages.filter((item) => item.status === "completed").length;
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const processedThisMonth = recentImages.filter((item) => {
    if (item.status !== "completed") return false;
    const created = new Date(item.createdAt);
    return created >= monthStart;
  }).length;

  const completedItems = recentImages.filter((item) => item.status === "completed" && typeof item.processingMs === "number");
  const averageProcessingMs =
    completedItems.length > 0
      ? completedItems.reduce((sum, item) => sum + (item.processingMs ?? 0), 0) / completedItems.length
      : null;

  return {
    totalProcessed,
    processedThisMonth,
    averageProcessingMs,
    recentImages: recentImages.slice(0, 6),
  };
}
