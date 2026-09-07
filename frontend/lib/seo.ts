// Metadata + schema.org helpers.
//
// Two jobs:
//   1. `pageMetadata()` builds a page's <head> from one short description, so
//      every route gets a canonical URL and a complete Open Graph/Twitter card
//      without each page re-typing the same twelve fields (and eventually
//      getting one of them wrong).
//   2. The `*Schema` builders emit JSON-LD. That is the part search engines read
//      to understand *what* this site is — a hotel in Sikar with rooms, a
//      restaurant and a wedding venue — rather than just a bag of words.
//
// Anything still a placeholder in lib/site.ts is omitted here rather than
// published; see PHONE_IS_PLACEHOLDER.

import type { Metadata } from "next";

import { allFaqs } from "@/lib/faq";
import {
  ADDRESS_SCHEMA,
  AMENITIES,
  EMAIL,
  GEO,
  MAPS_URL,
  PHONE,
  PHONE_IS_PLACEHOLDER,
  POSTAL_CODE,
  PRICE_RANGE,
  ROOM_TYPES,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SHORT_NAME,
  SITE_URL,
  SOCIALS,
} from "@/lib/site";

/** Absolute URL for a site-relative path. Canonicals and JSON-LD `@id`s must be absolute. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

type PageMetaInput = {
  title: string;
  description: string;
  /** Site-relative, leading slash. Becomes the canonical and og:url. */
  path: string;
  /** Route-specific share image. Defaults to the site-wide app/opengraph-image.jpg. */
  image?: string;
  /** Set for pages that must never appear in search results (admin, booking flows). */
  noIndex?: boolean;
};

/**
 * Build a page's metadata. `title` is the bare page name — the root layout's
 * title template appends the brand, so pass "Weddings", not
 * "Weddings | Kalyanam Hotel & Resort".
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      // og:title has no template applied to it, so it has to carry the brand itself.
      title: `${title} | ${SITE_NAME}`,
      description,
      locale: "en_IN",
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      ...(image ? { images: [image] } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: false, nocache: true } } : {}),
  };
}

// ---------------------------------------------------------------------------
// JSON-LD
// ---------------------------------------------------------------------------

// Stable @id values so the graph nodes can reference each other instead of
// repeating the organisation on every page.
export const ORG_ID = `${SITE_URL}/#hotel`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const socialProfiles = Object.values(SOCIALS).filter(
  // The defaults are bare "https://instagram.com/" placeholders — a sameAs
  // pointing at a network's homepage is worse than no sameAs at all.
  (u) => /^https?:\/\/[^/]+\/.+/.test(u)
);

/**
 * The property itself, as a schema.org `Hotel` (a LocalBusiness subtype, so it
 * is eligible for the local/knowledge-panel treatment).
 */
export function hotelSchema() {
  return {
    "@type": "Hotel",
    "@id": ORG_ID,
    name: SITE_NAME,
    alternateName: SITE_SHORT_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    logo: absoluteUrl("/logo.png"),
    image: [absoluteUrl("/opengraph-image.jpg"), absoluteUrl("/hero.jpg")],
    email: EMAIL,
    ...(PHONE_IS_PLACEHOLDER ? {} : { telephone: PHONE }),
    address: {
      "@type": "PostalAddress",
      ...ADDRESS_SCHEMA,
      ...(POSTAL_CODE ? { postalCode: POSTAL_CODE } : {}),
    },
    ...(GEO ? { geo: { "@type": "GeoCoordinates", ...GEO } } : {}),
    hasMap: MAPS_URL,
    ...(PRICE_RANGE ? { priceRange: PRICE_RANGE } : {}),
    currenciesAccepted: "INR",
    amenityFeature: AMENITIES.map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    })),
    makesOffer: ROOM_TYPES.map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "HotelRoom", name },
      url: absoluteUrl("/accommodations"),
    })),
    subOrganization: {
      "@type": "Restaurant",
      name: "Kaara Rooftop Restaurant",
      // As advertised on the homepage Kaara section.
      servesCuisine: ["Indian", "Chinese", "Continental"],
      url: absoluteUrl("/kaara"),
    },
    ...(socialProfiles.length ? { sameAs: socialProfiles } : {}),
  };
}

/** The site as a whole. `WebSite` is what enables the sitelinks search box. */
export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: "en-IN",
    publisher: { "@id": ORG_ID },
  };
}

/** Breadcrumb trail. Google renders this in place of the raw URL in results. */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

/** The homepage FAQ, straight from lib/faq.ts — eligible for FAQ rich results. */
export function faqSchema() {
  return {
    "@type": "FAQPage",
    mainEntity: allFaqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

/**
 * Wrap nodes in a single `@graph`. One <script> per page beats several — the
 * nodes can then cross-reference by @id instead of duplicating the hotel.
 */
export function jsonLdGraph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
