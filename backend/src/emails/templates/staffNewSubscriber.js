// Internal alert on a genuine new newsletter signup
// (services/notifications.js#onSubscriberCreated). No dedicated admin page
// exists for subscribers yet, so the CTA opens the dashboard rather than a
// deep link that doesn't exist.
import { textRow, kvTable, button, escapeHtml } from "../components.js";
import { renderEmail } from "../render.js";
import { siteLink } from "./helpers.js";
import { sampleSubscriber } from "./sampleData.js";

export function build({ subscriber }) {
  const subject = `New Newsletter Subscriber — ${subscriber.email}`;

  const blocks = [
    textRow(`<strong>New subscriber via the offers popup.</strong>`),
    kvTable([
      subscriber.name ? { label: "Name", value: escapeHtml(subscriber.name) } : null,
      { label: "Email", value: escapeHtml(subscriber.email) },
      subscriber.phone ? { label: "Phone", value: escapeHtml(subscriber.phone) } : null,
      { label: "Source", value: escapeHtml(subscriber.source || "offer-popup") },
    ]),
    button({ label: "Open Admin Panel", href: siteLink("/admin/dashboard") }),
  ];

  return renderEmail({
    subject,
    preview: `New subscriber: ${subscriber.email}`,
    blocks,
    audience: "staff",
  });
}

export default {
  key: "staff-new-subscriber",
  label: "Staff: New Subscriber",
  description: "Internal alert sent on a genuine new newsletter signup.",
  audience: "staff",
  build,
  sample: () => ({ subscriber: sampleSubscriber() }),
};
