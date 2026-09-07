// Welcome email for a genuine new signup from the "exclusive offers" popup
// (controllers/subscriberController.js#createSubscriber via
// services/notifications.js#onSubscriberCreated). Only fires on an actual
// insert — see notifications.js for why a re-submitted email doesn't
// re-trigger this (the endpoint upserts by email).
import { titleBlock, textRow, button, signatureRow, escapeHtml } from "../components.js";
import { renderEmail } from "../render.js";
import { siteLink } from "./helpers.js";
import { sampleSubscriber } from "./sampleData.js";

export function build({ subscriber }) {
  const name = subscriber.name?.trim() || "there";
  const subject = "Welcome to Kalyanam — Exclusive Offers Await";

  const blocks = [
    titleBlock("Welcome to Kalyanam"),
    textRow(
      `Dear <strong style="color:#2d2318;">${escapeHtml(name)}</strong>,<br /><br />
      Thank you for subscribing. You're now on the list for exclusive rates, seasonal packages, and first access to offers at Kalyanam Hotel &amp; Resort — sent straight to this inbox, nowhere else.`
    ),
    textRow("In the meantime, take a look at our rooms, suites, and experiences."),
    button({ label: "Explore Kalyanam", href: siteLink("/") }),
    signatureRow(),
  ];

  return renderEmail({
    subject,
    preview: "You're subscribed to exclusive offers from Kalyanam Hotel & Resort.",
    blocks,
  });
}

export default {
  key: "subscriber-welcome",
  label: "Subscriber Welcome",
  description: "Sent to a guest right after they subscribe via the offers popup.",
  audience: "guest",
  build,
  sample: () => ({ subscriber: sampleSubscriber() }),
};
