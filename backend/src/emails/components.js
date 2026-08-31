// Email-safe building blocks shared by every template. Each block is a
// `{ html, text }` pair — `html` is one or more <tr> elements ready to drop
// into the shell's content table, `text` is the matching plaintext line(s).
// render.js assembles a template from an array of these, so plaintext is
// always *derived* from the same content the HTML renders, never
// hand-authored in parallel (the old failure mode: bookingConfirmation.js
// used to keep a ~25-line plaintext array that could silently drift from
// the HTML the moment either was edited).
//
// Table layout + inline styles throughout is deliberate, not legacy: it's
// what survives Gmail / Outlook / Apple Mail's inconsistent CSS support.
import { theme, toneColors } from "./theme.js";

/* ------------------------------ text safety ------------------------------ */

// Escapes any untrusted string before it's interpolated into email HTML —
// guest names, enquiry messages, subjects, anything that came from a public
// form rather than being authored by us. Every template must run
// user-supplied fields through this before handing them to a block below.
export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Derives a plaintext line from a block's HTML fragment. Blocks are built
// from a small, known set of tags (br/strong/span/p/li), so this is a
// deliberately simple converter — not a general HTML-to-text library — kept
// in sync with the tags this file actually emits.
export function htmlToText(html) {
  return String(html || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&middot;/gi, "·")
    .replace(/&mdash;/gi, "—")
    .replace(/&ndash;/gi, "–")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/gi, '"')
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

/* -------------------------------- formatting ------------------------------ */

export function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function fmtDateTime(d) {
  return new Date(d).toLocaleString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function fmtMoney(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

/* --------------------------------- blocks --------------------------------- */

export function titleBlock(title) {
  return {
    html: `
    <tr>
      <td align="center" style="padding:34px 40px 6px;">
        <div style="font-family:${theme.fontSerif};font-size:30px;color:${theme.ink};">${title}</div>
        <div style="width:56px;height:2px;background:${theme.gold};margin:16px auto 0;"></div>
      </td>
    </tr>`,
    text: title,
  };
}

// `html` may contain inline markup (<strong>, <br />, <span>) — the
// plaintext line is derived automatically via htmlToText.
export function textRow(html) {
  return {
    html: `
    <tr>
      <td style="padding:20px 40px 0;font-family:${theme.fontSans};font-size:14px;line-height:1.7;color:${theme.body};">
        ${html}
      </td>
    </tr>`,
    text: htmlToText(html),
  };
}

export function referenceBlock({ label, value, accent = theme.gold }) {
  return {
    html: `
    <tr>
      <td style="padding:24px 40px 8px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${theme.creamCard};border:1px solid ${theme.borderSoft};border-radius:10px;">
          <tr>
            <td align="center" style="padding:16px;font-family:${theme.fontSans};">
              <div style="font-size:12px;letter-spacing:.1em;color:${theme.muted};text-transform:uppercase;">${label}</div>
              <div style="font-size:24px;font-weight:bold;color:${accent};letter-spacing:1px;margin-top:4px;">${value}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    text: `${label}: ${value}`,
  };
}

export function totalBlock({ label, value, bg = theme.ink, accent = theme.goldPale }) {
  return {
    html: `
    <tr>
      <td style="padding:18px 40px 6px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${bg};border-radius:10px;">
          <tr>
            <td style="padding:18px 22px;font-family:${theme.fontSans};font-size:15px;color:#e9e1d2;">${label}</td>
            <td align="right" style="padding:18px 22px;font-family:Georgia,serif;font-size:24px;color:${accent};font-weight:bold;">${value}</td>
          </tr>
        </table>
      </td>
    </tr>`,
    text: `${label}: ${value}`,
  };
}

export function signatureRow() {
  return {
    html: `
    <tr>
      <td style="padding:24px 40px 34px;font-family:${theme.fontSerif};font-size:18px;color:${theme.ink};">
        Warm regards,<br />
        <span style="color:${theme.gold};">The Kalyanam Team</span>
      </td>
    </tr>`,
    text: "Warm regards,\nThe Kalyanam Team",
  };
}

function detailRowHtml(label, value) {
  return `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid ${theme.divider};font-family:${theme.fontSans};font-size:13px;color:${theme.muted};text-transform:uppercase;letter-spacing:.06em;">${label}</td>
      <td style="padding:12px 0;border-bottom:1px solid ${theme.divider};font-family:${theme.fontSans};font-size:15px;color:${theme.ink};text-align:right;font-weight:600;">${value}</td>
    </tr>`;
}

// rows: [{ label, value, text? } | falsy]. Falsy entries are dropped, so
// callers can inline a condition (`nights ? {...} : null`) instead of
// building the array up front. Pass `text` when `value` carries markup an
// automatic strip wouldn't read cleanly; otherwise it's derived from `value`.
export function kvTable(rows) {
  const visible = rows.filter(Boolean);
  return {
    html: `
    <tr>
      <td style="padding:14px 40px 6px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${visible.map((r) => detailRowHtml(r.label, r.value)).join("")}
        </table>
      </td>
    </tr>`,
    text: visible
      .map((r) => `${htmlToText(String(r.label))}: ${r.text ?? htmlToText(String(r.value))}`)
      .join("\n"),
  };
}

// The room/dates/guests summary repeated across every booking-lifecycle
// template (confirmed, cancelled, reminder, post-stay, hold-expiring,
// payment-failed) — pulled into one block so those templates share it
// instead of five copies of the same kvTable call.
export function stayCard({ roomName, ratePlanName, checkIn, checkOut, nights, guestCount, rooms }) {
  return kvTable([
    { label: "Room", value: escapeHtml(roomName) },
    ratePlanName ? { label: "Rate Plan", value: escapeHtml(ratePlanName) } : null,
    {
      label: "Check-in",
      value: `${fmtDate(checkIn)} <span style="color:${theme.mutedFaint};font-weight:400;">&middot; from 2:00 PM</span>`,
      text: `${fmtDate(checkIn)} (from 2:00 PM)`,
    },
    {
      label: "Check-out",
      value: `${fmtDate(checkOut)} <span style="color:${theme.mutedFaint};font-weight:400;">&middot; by 11:00 AM</span>`,
      text: `${fmtDate(checkOut)} (by 11:00 AM)`,
    },
    nights != null ? { label: "Nights", value: String(nights) } : null,
    guestCount != null ? { label: "Guests", value: escapeHtml(String(guestCount)) } : null,
    rooms != null ? { label: "Rooms", value: String(rooms) } : null,
  ]);
}

// A prominent call-to-action button — "View Booking", "Browse Rooms", etc.
export function button({ label, href, tone = "gold" }) {
  const { accent } = toneColors(tone);
  return {
    html: `
    <tr>
      <td align="center" style="padding:26px 40px 6px;">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" bgcolor="${accent}" style="border-radius:8px;">
              <a href="${href}" target="_blank" style="display:inline-block;padding:14px 32px;font-family:${theme.fontSans};font-size:14px;font-weight:bold;letter-spacing:.04em;color:${theme.white};text-decoration:none;border-radius:8px;">${label}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    text: `${label}: ${href}`,
  };
}

// A callout — used for cancellation notices, hold-expiring warnings,
// payment-failure explanations. `tone` picks the accent from theme.toneColors.
export function alertBox({ tone = "info", title, body }) {
  const { accent, bg, border } = toneColors(tone);
  return {
    html: `
    <tr>
      <td style="padding:18px 40px 6px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${bg};border:1px solid ${border};border-radius:10px;">
          <tr>
            <td style="padding:16px 18px;font-family:${theme.fontSans};">
              ${
                title
                  ? `<div style="font-size:13px;font-weight:bold;color:${accent};text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px;">${title}</div>`
                  : ""
              }
              <div style="font-size:14px;line-height:1.6;color:${theme.body};">${body}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    text: [title, htmlToText(body)].filter(Boolean).join("\n"),
  };
}

export function bulletList(items) {
  const visible = items.filter(Boolean);
  return {
    html: `
    <tr>
      <td style="padding:6px 40px 0;font-family:${theme.fontSans};font-size:14px;line-height:1.8;color:${theme.body};">
        <ul style="margin:0;padding-left:20px;">
          ${visible.map((i) => `<li>${i}</li>`).join("")}
        </ul>
      </td>
    </tr>`,
    text: visible.map((i) => `- ${htmlToText(i)}`).join("\n"),
  };
}

export function divider() {
  return {
    html: `
    <tr>
      <td style="padding:6px 40px;">
        <div style="border-top:1px solid ${theme.divider};"></div>
      </td>
    </tr>`,
    text: "",
  };
}

/* -------------------------- staff-alert components ------------------------- */
// A compact, flatter shell for internal notifications — deliberately not the
// guest gold chrome, so a forwarded staff alert never reads as guest-facing
// brand mail. `render.js` selects this vs. the guest header via a template's
// `audience`.

export function staffHeader() {
  return `
    <tr>
      <td align="center" bgcolor="${theme.staffHeaderBg}" style="background:${theme.staffHeaderBg};padding:22px 24px;">
        <div style="font-family:${theme.fontSans};font-size:12px;letter-spacing:3px;color:${theme.staffAccent};font-weight:bold;text-transform:uppercase;">Kalyanam — Internal Alert</div>
      </td>
    </tr>`;
}

export function staffKv(rows) {
  return kvTable(rows);
}
