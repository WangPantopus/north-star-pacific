/**
 * Central site configuration.
 *
 * Every value can be set at build time via a Vercel/Vite environment variable
 * (the VITE_* names below), or you can simply edit the fallback string here.
 *
 * Leaving BOOKING_URL or PAYMENT_LINK empty just hides that button — the lead
 * form always works on its own, so the site is fully functional with zero setup.
 */
const env = import.meta.env as Record<string, string | undefined>;

/**
 * Where lead emails are delivered, and the address shown for "prefer email".
 * TODO: switch to a business inbox (e.g. hello@northstarpacific.com) when ready.
 */
export const CONTACT_EMAIL = env.VITE_CONTACT_EMAIL ?? "yp.wangt@gmail.com";

/**
 * Scheduling link — a Cal.com or Calendly URL.
 * Empty string = the "Book a call" button is hidden.
 */
export const BOOKING_URL = env.VITE_BOOKING_URL ?? "";

/**
 * Stripe Payment Link for the Growth Audit.
 * Empty string = the "Start your audit" payment button is hidden.
 */
export const PAYMENT_LINK = env.VITE_PAYMENT_LINK ?? "";

/** Display price for the Growth Audit (used in copy and buttons). */
export const AUDIT_PRICE = env.VITE_AUDIT_PRICE ?? "$1,500";
