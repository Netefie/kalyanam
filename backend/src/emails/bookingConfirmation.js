// Themed booking-confirmation email. Table layout + inline styles for broad
// email-client support (Gmail/Outlook/Apple Mail). Palette mirrors the site:
// gold #B68D40, cream #FCF8F2, serif headings, warm neutrals.

function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function fmtMoney(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

function detailRow(label, value) {
  return `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #F0E9DC;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8a8172;text-transform:uppercase;letter-spacing:.06em;">${label}</td>
      <td style="padding:12px 0;border-bottom:1px solid #F0E9DC;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#2d2318;text-align:right;font-weight:600;">${value}</td>
    </tr>`;
}

export function bookingConfirmationEmail(booking) {
  const guestName =
    `${booking.guest?.firstName || ""} ${booking.guest?.lastName || ""}`.trim() ||
    "Guest";
  const guestCount =
    booking.adults + (booking.children ? ` adult(s), ${booking.children} child(ren)` : " adult(s)");

  const subject = `Booking Confirmed — ${booking.bookingCode} · Kalyanam Hotel & Resort`;

  const text = [
    `Dear ${guestName},`,
    ``,
    `Thank you for choosing Kalyanam Hotel & Resort. Your reservation is confirmed.`,
    ``,
    `Booking Reference: ${booking.bookingCode}`,
    `Room: ${booking.roomName}`,
    `Check-in: ${fmtDate(booking.checkIn)} (from 2:00 PM)`,
    `Check-out: ${fmtDate(booking.checkOut)} (by 11:00 AM)`,
    `Nights: ${booking.nights}`,
    `Guests: ${guestCount}`,
    `Rooms: ${booking.rooms}`,
    `Total Amount: ${fmtMoney(booking.amount)}`,
    ``,
    `Our team will be in touch shortly to finalise the details.`,
    ``,
    `Warm regards,`,
    `The Kalyanam Team`,
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#FCF8F2;">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;">Your Kalyanam reservation ${booking.bookingCode} is confirmed.</span>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FCF8F2;padding:32px 12px;">
    <tr>
      <td align="center">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff;border:1px solid #EFE5DA;border-radius:14px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#B68D40" style="background:linear-gradient(135deg,#CDA55A,#B68D40,#956124);padding:38px 24px;">
              <div style="font-family:Georgia,'Cormorant Garamond',serif;font-size:34px;letter-spacing:6px;color:#ffffff;font-weight:bold;">KALYANAM</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:4px;color:#F6ECD8;margin-top:6px;text-transform:uppercase;">Hotel &amp; Resort</div>
            </td>
          </tr>

          <!-- Confirmation badge -->
          <tr>
            <td align="center" style="padding:34px 40px 6px;">
              <div style="font-family:Georgia,'Cormorant Garamond',serif;font-size:30px;color:#2d2318;">Booking Confirmed</div>
              <div style="width:56px;height:2px;background:#B68D40;margin:16px auto 0;"></div>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:22px 40px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#5b5245;">
              Dear <strong style="color:#2d2318;">${guestName}</strong>,<br /><br />
              Thank you for choosing Kalyanam Hotel &amp; Resort. We're delighted to confirm your reservation. Here are your booking details:
            </td>
          </tr>

          <!-- Reference -->
          <tr>
            <td style="padding:24px 40px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAF5EB;border:1px solid #ECDFC6;border-radius:10px;">
                <tr>
                  <td align="center" style="padding:16px;font-family:Arial,Helvetica,sans-serif;">
                    <div style="font-size:12px;letter-spacing:.1em;color:#8a8172;text-transform:uppercase;">Booking Reference</div>
                    <div style="font-size:24px;font-weight:bold;color:#B68D40;letter-spacing:1px;margin-top:4px;">${booking.bookingCode}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Details -->
          <tr>
            <td style="padding:14px 40px 6px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${detailRow("Room", booking.roomName)}
                ${detailRow("Check-in", `${fmtDate(booking.checkIn)} <span style="color:#a99f8c;font-weight:400;">· from 2:00 PM</span>`)}
                ${detailRow("Check-out", `${fmtDate(booking.checkOut)} <span style="color:#a99f8c;font-weight:400;">· by 11:00 AM</span>`)}
                ${detailRow("Nights", String(booking.nights))}
                ${detailRow("Guests", String(guestCount))}
                ${detailRow("Rooms", String(booking.rooms))}
              </table>
            </td>
          </tr>

          <!-- Total -->
          <tr>
            <td style="padding:18px 40px 6px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#2d2318;border-radius:10px;">
                <tr>
                  <td style="padding:18px 22px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#e9e1d2;">Total Amount</td>
                  <td align="right" style="padding:18px 22px;font-family:Georgia,serif;font-size:24px;color:#E7C77E;font-weight:bold;">${fmtMoney(booking.amount)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Note -->
          <tr>
            <td style="padding:20px 40px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#5b5245;">
              Our team will be in touch shortly to finalise the details of your stay. If you have any special requests, simply reply to this email.
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding:24px 40px 34px;font-family:Georgia,'Cormorant Garamond',serif;font-size:18px;color:#2d2318;">
              Warm regards,<br />
              <span style="color:#B68D40;">The Kalyanam Team</span>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" bgcolor="#FAF5EB" style="padding:22px 40px;border-top:1px solid #ECDFC6;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.7;color:#9a9080;">
              Kalyanam Hotel &amp; Resort · Jaipur Road, Sikar, Rajasthan, India<br />
              This is an automated confirmation for booking ${booking.bookingCode}.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}
