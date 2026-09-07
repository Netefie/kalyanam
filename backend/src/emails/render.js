// Wraps an array of components.js blocks into a complete email — subject,
// full HTML (with the brand shell) and a derived plaintext body. Every
// template funnels through this so there is exactly one place that knows
// what the outer <html>/<body>/header/footer looks like, in either of the
// two audiences (guest brand chrome, or the flatter internal-alert shell).
import { theme } from "./theme.js";
import { staffHeader, escapeHtml } from "./components.js";

/**
 * @param {object} opts
 * @param {string} opts.subject
 * @param {string} [opts.preview] - hidden inbox-preview snippet (HTML only).
 * @param {Array<{html: string, text: string}>} opts.blocks
 * @param {"guest"|"staff"} [opts.audience]
 * @param {string} [opts.footerNote] - replaces the default footer line.
 * @returns {{subject: string, html: string, text: string}}
 */
export function renderEmail({ subject, preview, blocks, audience = "guest", footerNote }) {
  const bodyRows = blocks.map((b) => b.html).join("\n");
  const text = blocks
    .map((b) => b.text)
    .filter(Boolean)
    .join("\n\n");

  const html =
    audience === "staff"
      ? renderStaffShell({ subject, preview, bodyRows, footerNote })
      : renderGuestShell({ subject, preview, bodyRows, footerNote });

  return { subject, html, text };
}

function renderGuestShell({ subject, preview, bodyRows, footerNote }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${theme.cream};">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preview || "")}</span>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${theme.cream};padding:32px 12px;">
    <tr>
      <td align="center">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:${theme.white};border:1px solid ${theme.border};border-radius:14px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center" bgcolor="${theme.gold}" style="background:linear-gradient(135deg,${theme.goldLight},${theme.gold},${theme.goldDark});padding:38px 24px;">
              <div style="font-family:${theme.fontSerif};font-size:34px;letter-spacing:6px;color:${theme.white};font-weight:bold;">KALYANAM</div>
              <div style="font-family:${theme.fontSans};font-size:11px;letter-spacing:4px;color:#F6ECD8;margin-top:6px;text-transform:uppercase;">Hotel &amp; Resort</div>
            </td>
          </tr>

          ${bodyRows}

          <!-- Footer -->
          <tr>
            <td align="center" bgcolor="${theme.creamCard}" style="padding:22px 40px;border-top:1px solid ${theme.borderSoft};font-family:${theme.fontSans};font-size:12px;line-height:1.7;color:${theme.mutedLight};">
              Kalyanam Hotel &amp; Resort &middot; Jaipur Road, Sikar, Rajasthan, India<br />
              ${footerNote || "This is an automated email."}
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

function renderStaffShell({ subject, preview, bodyRows, footerNote }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#EFEAE0;">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preview || "")}</span>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EFEAE0;padding:28px 12px;">
    <tr>
      <td align="center">

        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:100%;background:${theme.white};border:1px solid ${theme.border};border-radius:10px;overflow:hidden;">

          ${staffHeader()}

          ${bodyRows}

          <tr>
            <td align="center" style="padding:16px 32px;border-top:1px solid ${theme.divider};font-family:${theme.fontSans};font-size:11px;color:${theme.mutedLight};">
              ${footerNote || "Automated internal notification &middot; Kalyanam admin system."}
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}
