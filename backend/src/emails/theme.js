// Brand tokens shared by every transactional email. Single source for the
// gold/cream/ink palette so a color never gets hand-typed as a raw hex
// value anywhere else in emails/ — change the brand here and every
// template (guest + staff) picks it up.
export const theme = {
  // Core palette
  gold: "#B68D40",
  goldLight: "#CDA55A",
  goldDark: "#956124",
  goldPale: "#E7C77E",

  cream: "#FCF8F2",
  creamCard: "#FAF5EB",
  border: "#EFE5DA",
  borderSoft: "#ECDFC6",
  divider: "#F0E9DC",

  ink: "#2d2318",
  body: "#5b5245",
  muted: "#8a8172",
  mutedLight: "#9a9080",
  mutedFaint: "#a99f8c",

  white: "#ffffff",

  // Status accents — used by alertBox() and status-flavored blocks
  // (payment failed, refund, cancellation) instead of one gold-only palette.
  danger: "#B91C1C",
  dangerBg: "#FDF0EF",
  dangerBorder: "#F3D6D3",

  success: "#1E7A4C",
  successBg: "#EEF7F1",
  successBorder: "#CFE8D9",

  warning: "#9A6B1E",
  warningBg: "#FDF5E6",
  warningBorder: "#F0DFB8",

  info: "#3B5F8A",
  infoBg: "#EEF2F8",
  infoBorder: "#D3DEEC",

  // Internal staff-alert shell — deliberately darker/flatter than the
  // guest-facing gold chrome so an internal notification never reads as a
  // guest-facing brand email if forwarded.
  staffHeaderBg: "#1F1B14",
  staffAccent: "#E7C77E",

  fontSerif: "Georgia,'Cormorant Garamond',serif",
  fontSans: "Arial,Helvetica,sans-serif",
};

// Resolves an alertBox/status "tone" name to its accent/bg/border triad.
export function toneColors(tone = "gold") {
  switch (tone) {
    case "danger":
      return { accent: theme.danger, bg: theme.dangerBg, border: theme.dangerBorder };
    case "success":
      return { accent: theme.success, bg: theme.successBg, border: theme.successBorder };
    case "warning":
      return { accent: theme.warning, bg: theme.warningBg, border: theme.warningBorder };
    case "info":
      return { accent: theme.info, bg: theme.infoBg, border: theme.infoBorder };
    default:
      return { accent: theme.gold, bg: theme.creamCard, border: theme.borderSoft };
  }
}
