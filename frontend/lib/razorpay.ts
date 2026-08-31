// Thin wrapper around Razorpay's Checkout.js so components never touch
// `window.Razorpay` directly. Two responsibilities:
//   1. loadCheckoutScript() — injects the SDK exactly once, cached as a
//      promise so concurrent/duplicate calls share the same load.
//   2. openCheckout() — opens the modal and resolves/rejects based on what
//      actually happened (paid / user closed it / Razorpay reported a
//      failure), so callers can show the right message for each.

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

// Minimal shape of what Razorpay Checkout needs + hands back — narrow, typed
// surface instead of `any` sprinkled through the booking flow.
export interface RazorpayOrderOptions {
  keyId: string;
  amount: number; // paise
  currency: string;
  orderId: string;
  name: string;
  description: string;
  prefill: { name: string; email: string; contact: string };
  theme?: { color?: string };
}

export interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayFailureResponse {
  error: {
    code: string;
    description: string;
    source?: string;
    step?: string;
    reason?: string;
  };
}

interface RazorpayInstance {
  open(): void;
  on(event: "payment.failed", handler: (response: RazorpayFailureResponse) => void): void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

let scriptPromise: Promise<void> | null = null;

// Loads checkout.js once per page, however many components ask for it.
export function loadCheckoutScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay Checkout can only load in the browser"));
  }
  if (window.Razorpay) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CHECKOUT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Razorpay Checkout")));
      return;
    }

    const script = document.createElement("script");
    script.src = CHECKOUT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null; // allow a retry rather than caching a permanent failure
      reject(new Error("Failed to load Razorpay Checkout"));
    };
    document.body.appendChild(script);
  });

  return scriptPromise;
}

export class PaymentDismissedError extends Error {
  constructor() {
    super("Payment was cancelled");
    this.name = "PaymentDismissedError";
  }
}

export class PaymentFailedError extends Error {
  code?: string;
  reason?: string;
  constructor(message: string, code?: string, reason?: string) {
    super(message);
    this.name = "PaymentFailedError";
    this.code = code;
    this.reason = reason;
  }
}

// Opens Razorpay Checkout and settles once the guest either pays, dismisses
// the modal, or Razorpay reports a failed attempt. The caller is responsible
// for calling api.payments.verify() with the success response — this
// function only drives the widget.
export async function openCheckout(options: RazorpayOrderOptions): Promise<RazorpaySuccessResponse> {
  await loadCheckoutScript();
  if (!window.Razorpay) throw new Error("Razorpay Checkout failed to initialise");

  return new Promise((resolve, reject) => {
    let settled = false;

    const rzp = new window.Razorpay!({
      key: options.keyId,
      amount: options.amount,
      currency: options.currency,
      order_id: options.orderId,
      name: options.name,
      description: options.description,
      prefill: options.prefill,
      theme: options.theme || { color: "#B68D40" },
      handler: (response: RazorpaySuccessResponse) => {
        settled = true;
        resolve(response);
      },
      modal: {
        // Fires when the guest closes the modal without paying — distinct
        // from a failed payment so the UI can offer a plain "try again"
        // instead of alarming failure copy.
        ondismiss: () => {
          if (!settled) {
            settled = true;
            reject(new PaymentDismissedError());
          }
        },
      },
    });

    rzp.on("payment.failed", (response) => {
      settled = true;
      reject(
        new PaymentFailedError(
          response.error?.description || "Payment failed",
          response.error?.code,
          response.error?.reason
        )
      );
    });

    rzp.open();
  });
}
