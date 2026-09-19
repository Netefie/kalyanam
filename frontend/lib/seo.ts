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
// Where a value can be edited in the admin panel, the admin panel wins: the
// contact block, the socials, the check-in times and the entire room catalogue
// are read off the backend, and lib/site.ts only supplies what nobody can edit
// (geo, amenity list, canonical origin). Anything still a placeholder there is
// omitted rather than published; see PHONE_IS_PLACEHOLDER.

import type { Metadata } from "next";

import type { RatePlan, Room, SiteSettings } from "@/lib/api";
import { allFaqs } from "@/lib/faq";
import {
  ADDRESS_SCHEMA,
  AMENITIES,
  EMAIL,
  GEO,
  KAARA_MENU_URL,
  MAPS_URL,
  PHONE,
  PHONE_IS_PLACEHOLDER,
  POSTAL_CODE,
  PRICE_RANGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SHORT_NAME,
  SITE_URL,
} from "@/lib/site";

/** Absolute URL for a site-relative path. Canonicals and JSON-LD `@id`s must be absolute. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** The public landing page for a room type. One place, so links and JSON-LD agree. */
export function roomPath(slug: string): string {
  return `/accommodations/${slug}`;
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
  /**
   * Admin-managed settings. Supplied so a hotel renamed in /admin/settings
   * rebrands the share cards too — without it they'd keep saying whatever
   * lib/site.ts was hardcoded to at build time.
   */
  settings?: SiteSettings;
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
  settings,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const siteName = settings?.hotelName || SITE_NAME;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName,
      // og:title has no template applied to it, so it has to carry the brand itself.
      title: `${title} | ${siteName}`,
      description,
      locale: "en_IN",
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
      ...(image ? { images: [image] } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: false, nocache: true } } : {}),
  };
}

// ---------------------------------------------------------------------------
// Room pricing helpers
//
// These mirror backend/src/services/ratePlans.js. The backend is authoritative
// for anything a guest is actually charged (see lib/pricing.ts on why the
// browser never re-derives a total) — what's derived here is only the "from"
// rate that gets advertised in metadata and structured data.
// ---------------------------------------------------------------------------

/** The sell rate for a plan: its offer price when set, otherwise its rack rate. */
function planRate(plan: RatePlan): number {
  return plan.offerPrice ?? plan.price;
}

function activePlans(room: Room): RatePlan[] {
  return (room.ratePlans ?? []).filter((plan) => plan.active !== false);
}

/**
 * The cheapest nightly rate a room can be booked at — the "from ₹X" figure.
 * Falls back to the room's own price when it has no rate plans configured,
 * which is the same fallback the backend applies.
 */
export function roomFromRate(room: Room): number {
  const rates = activePlans(room).map(planRate).filter((n) => n > 0);
  if (rates.length) return Math.min(...rates);
  return room.offerPrice ?? room.price ?? 0;
}

/** ₹ figure without decimals, Indian digit grouping. Matches lib/pricing.ts. */
function inr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

/**
 * schema.org `priceRange` for the property, derived from what the rooms
 * actually sell for. lib/site.ts's PRICE_RANGE stays the manual override — if
 * someone sets it, it wins, because a hand-set band can account for suites and
 * packages the room catalogue doesn't list.
 */
export function priceRangeFrom(rooms: Room[]): string {
  if (PRICE_RANGE) return PRICE_RANGE;

  const rates = rooms.map(roomFromRate).filter((n) => n > 0);
  if (!rates.length) return "";

  const low = Math.min(...rates);
  const high = Math.max(...rates);
  return low === high ? inr(low) : `${inr(low)}–${inr(high)}`;
}

/**
 * "320 sq.ft" -> a QuantitativeValue. The admin field is free text, so this
 * only emits when there is a number to emit; a unit it doesn't recognise is
 * dropped rather than guessed at (a room listed in m² reported as ft² is worse
 * than no floorSize at all).
 */
function floorSize(size: string) {
  const match = /(\d[\d,.]*)\s*(sq\.?\s*(?:ft|feet|f)|ft2|sqft|sq\.?\s*m|m2|sqm)/i.exec(size);
  if (!match) return null;

  const value = Number(match[1].replace(/,/g, ""));
  if (!Number.isFinite(value) || value <= 0) return null;

  // UN/CEFACT codes: FTK = square foot, MTK = square metre.
  const unitCode = /m/i.test(match[2]) && !/f/i.test(match[2]) ? "MTK" : "FTK";

  return { "@type": "QuantitativeValue", value, unitCode };
}

// ---------------------------------------------------------------------------
// JSON-LD
// ---------------------------------------------------------------------------

// Stable @id values so the graph nodes can reference each other instead of
// repeating the organisation on every page.
export const ORG_ID = `${SITE_URL}/#hotel`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const RESTAURANT_ID = `${SITE_URL}/kaara#restaurant`;

/** A room type's stable node id, so the hotel's offers can point at it. */
function roomId(slug: string): string {
  return `${absoluteUrl(roomPath(slug))}#room`;
}

// A sameAs pointing at a network's homepage is worse than no sameAs at all,
// and an unset handle comes back from the API as "" — so both are dropped.
// Only what an admin actually saved is published: the lib/site.ts SOCIALS
// placeholders are deliberately NOT a fallback here.
const socialProfiles = (settings?: SiteSettings) =>
  Object.values(settings?.socials ?? {}).filter(
    (u): u is string => typeof u === "string" && /^https?:\/\/[^/]+\/.+/.test(u)
  );

/**
 * Contact details, admin-first. A field the admin has filled in is published as
 * given; the lib/site.ts constant is the fallback only while it isn't a known
 * placeholder. A phone number in JSON-LD is what Google shows in the local
 * knowledge panel and what "call" buttons dial, so a wrong one is expensive.
 */
function contactOf(settings?: SiteSettings) {
  return {
    telephone: settings?.phone?.trim() || (PHONE_IS_PLACEHOLDER ? "" : PHONE),
    email: settings?.email?.trim() || EMAIL,
  };
}

/** "14:00" -> "14:00:00". schema.org check-in/out times want a full ISO time. */
function isoTime(value?: string): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec((value ?? "").trim());
  if (!match) return "";
  return `${match[1].padStart(2, "0")}:${match[2]}:00`;
}

/**
 * The offers the hotel makes, one per room type, built from the live
 * catalogue. This replaced a hardcoded two-item ROOM_TYPES list that carried no
 * prices and went stale the moment an admin added a room.
 */
function hotelOffers(rooms: Room[], currency: string) {
  return rooms.map((room) => {
    const rate = roomFromRate(room);

    return {
      "@type": "Offer",
      name: room.name,
      url: absoluteUrl(roomPath(room.slug)),
      ...(rate > 0
        ? {
            price: rate,
            priceCurrency: currency,
            // Marks the figure as a *nightly* rate rather than a total, which
            // is the difference between "₹3,500" reading as cheap or absurd.
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: rate,
              priceCurrency: currency,
              unitCode: "DAY",
              unitText: "per night",
            },
          }
        : {}),
      // Points at the room's own node instead of restating it — the full
      // HotelRoom lives on the room's page, this is just the link.
      itemOffered: { "@id": roomId(room.slug) },
    };
  });
}

/**
 * The property itself, as a schema.org `Hotel` (a LocalBusiness subtype, so it
 * is eligible for the local/knowledge-panel treatment).
 *
 * `settings` supplies everything an admin can edit; `rooms` supplies the
 * catalogue-derived facts (what it offers, what it costs, how many rooms it
 * has). Both are optional so a caller with neither still gets a valid node.
 */
export function hotelSchema(settings?: SiteSettings, rooms: Room[] = []) {
  const name = settings?.hotelName || SITE_NAME;
  const { telephone, email } = contactOf(settings);
  const postalCode = settings?.postalCode || POSTAL_CODE;
  const profiles = socialProfiles(settings);
  const currency = settings?.currency || "INR";

  // The stored address is free text; its first line is the street.
  const street =
    settings?.address.split(/\r?\n|,/)[0]?.trim() || ADDRESS_SCHEMA.streetAddress;

  const checkinTime = isoTime(settings?.checkInTime);
  const checkoutTime = isoTime(settings?.checkOutTime);
  const priceRange = priceRangeFrom(rooms);

  // Physical room count across every published type. Only meaningful once the
  // admin has set totalRooms on at least one room.
  const numberOfRooms = rooms.reduce((sum, room) => sum + (room.totalRooms || 0), 0);

  return {
    "@type": "Hotel",
    "@id": ORG_ID,
    name,
    alternateName: SITE_SHORT_NAME,
    description: settings?.tagline || SITE_DESCRIPTION,
    url: SITE_URL,
    logo: absoluteUrl("/logo.png"),
    image: [absoluteUrl("/opengraph-image.jpg"), absoluteUrl("/hero.jpg")],
    ...(email ? { email } : {}),
    // Withheld while unset — see contactOf().
    ...(telephone ? { telephone } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: street,
      addressLocality: settings?.city || ADDRESS_SCHEMA.addressLocality,
      addressRegion: settings?.state || ADDRESS_SCHEMA.addressRegion,
      addressCountry: settings?.country || ADDRESS_SCHEMA.addressCountry,
      ...(postalCode ? { postalCode } : {}),
    },
    // Admin-set pin first, lib/site.ts's constant only as a fallback. Omitted
    // entirely when neither is set: a wrong pin drops the property in the
    // wrong place on Google Maps, which is worse than no pin at all.
    ...(typeof settings?.latitude === "number" &&
    typeof settings?.longitude === "number"
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: settings.latitude,
            longitude: settings.longitude,
          },
        }
      : GEO
        ? { geo: { "@type": "GeoCoordinates", ...GEO } }
        : {}),
    ...(settings?.mapsUrl || MAPS_URL
      ? { hasMap: settings?.mapsUrl || MAPS_URL }
      : {}),
    ...(priceRange ? { priceRange } : {}),
    currenciesAccepted: currency,
    ...(checkinTime ? { checkinTime } : {}),
    ...(checkoutTime ? { checkoutTime } : {}),
    ...(numberOfRooms > 0 ? { numberOfRooms } : {}),
    amenityFeature: AMENITIES.map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity,
      value: true,
    })),
    ...(rooms.length
      ? {
          makesOffer: hotelOffers(rooms, currency),
          // containsPlace is the "this hotel has these rooms" edge; makesOffer
          // above is the "and here is what they cost" one. Google reads both.
          containsPlace: rooms.map((room) => ({ "@id": roomId(room.slug) })),
        }
      : {}),
    subOrganization: { "@id": RESTAURANT_ID },
    ...(profiles.length ? { sameAs: profiles } : {}),
  };
}

/**
 * One room type. Multi-typed as `HotelRoom` *and* `Product` on purpose:
 * HotelRoom is what tells a search engine this is lodging, but `offers` and
 * `aggregateRating` are Product/Offer properties — a bare HotelRoom (a Place
 * subtype) can carry neither, which is how room prices end up invisible.
 */
export function roomSchema(room: Room, settings?: SiteSettings) {
  const url = absoluteUrl(roomPath(room.slug));
  const currency = settings?.currency || "INR";
  const plans = activePlans(room);
  const size = floorSize(room.size);

  const images = [room.image, ...(room.images ?? [])]
    .filter(Boolean)
    .map((src) => (src.startsWith("http") ? src : absoluteUrl(src)));

  const offers = plans.map((plan) => {
    const rate = planRate(plan);

    return {
      "@type": "Offer",
      name: plan.name,
      url,
      price: rate,
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      // Rate plans are priced per night, same as hotelOffers above.
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: rate,
        priceCurrency: currency,
        unitCode: "DAY",
        unitText: "per night",
      },
      // What the guest can actually get back, straight off the plan's own
      // flags rather than a site-wide assumption.
      ...(plan.refundable
        ? {
            hasMerchantReturnPolicy: {
              "@type": "MerchantReturnPolicy",
              applicableCountry: settings?.country || ADDRESS_SCHEMA.addressCountry,
              returnPolicyCategory:
                "https://schema.org/MerchantReturnFiniteReturnWindow",
              merchantReturnDays: Math.max(
                1,
                Math.ceil((settings?.cancellationWindowHours ?? 24) / 24)
              ),
            },
          }
        : {}),
    };
  });

  return {
    "@type": ["HotelRoom", "Product"],
    "@id": roomId(room.slug),
    name: room.name,
    url,
    ...(room.description ? { description: room.description } : {}),
    ...(images.length ? { image: images } : {}),
    // Ties the room back to the property rather than leaving it a free-floating
    // product with no location.
    containedInPlace: { "@id": ORG_ID },
    ...(room.maxGuests
      ? {
          occupancy: {
            "@type": "QuantitativeValue",
            maxValue: room.maxGuests,
            unitCode: "C62", // "one" — i.e. a count of people
          },
        }
      : {}),
    ...(room.bed
      ? { bed: { "@type": "BedDetails", typeOfBed: room.bed, numberOfBeds: 1 } }
      : {}),
    ...(size ? { floorSize: size } : {}),
    ...(room.amenities?.length
      ? {
          amenityFeature: room.amenities.map((amenity) => ({
            "@type": "LocationFeatureSpecification",
            name: amenity,
            value: true,
          })),
        }
      : {}),
    ...(offers.length
      ? {
          // AggregateOffer rather than a bare array: it gives the "from ₹X"
          // figure a home, which is what a result snippet shows.
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: currency,
            lowPrice: Math.min(...offers.map((o) => o.price)),
            highPrice: Math.max(...offers.map((o) => o.price)),
            offerCount: offers.length,
            offers,
          },
        }
      : {}),
    // Only when there is a real rating behind it AND the page renders it —
    // app/accommodations/[slug]/page.tsx shows the same figures. An
    // aggregateRating the page doesn't display is a manual-action risk, which
    // is why this is gated on reviews > 0 rather than emitted with a default.
    ...(room.rating > 0 && room.reviews > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: room.rating,
            reviewCount: room.reviews,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

/**
 * Kaara, as its own `Restaurant` node rather than an inline blob on the hotel.
 * Giving it a stable @id is what lets /kaara claim it as the page's main entity
 * while the hotel merely references it.
 */
export function restaurantSchema(settings?: SiteSettings) {
  const { telephone } = contactOf(settings);
  const profiles = socialProfiles(settings);

  return {
    "@type": "Restaurant",
    "@id": RESTAURANT_ID,
    name: "Kaara Rooftop Restaurant",
    url: absoluteUrl("/kaara"),
    // As advertised on the homepage Kaara section.
    servesCuisine: ["Indian", "Chinese", "Continental"],
    ...(KAARA_MENU_URL ? { hasMenu: KAARA_MENU_URL } : {}),
    ...(telephone ? { telephone } : {}),
    image: [absoluteUrl("/opengraph-image.jpg")],
    address: {
      "@type": "PostalAddress",
      addressLocality: settings?.city || ADDRESS_SCHEMA.addressLocality,
      addressRegion: settings?.state || ADDRESS_SCHEMA.addressRegion,
      addressCountry: settings?.country || ADDRESS_SCHEMA.addressCountry,
      ...(settings?.postalCode || POSTAL_CODE
        ? { postalCode: settings?.postalCode || POSTAL_CODE }
        : {}),
    },
    containedInPlace: { "@id": ORG_ID },
    ...(profiles.length ? { sameAs: profiles } : {}),
  };
}

/**
 * The banquet hall / wedding lawns as an `EventVenue`. "wedding venue Sikar"
 * and "banquet hall near me" are venue queries, not hotel queries — without
 * this the pages have nothing but prose to match against.
 */
export function eventVenueSchema({
  name,
  path,
  description,
  maxCapacity,
}: {
  name: string;
  path: string;
  description: string;
  maxCapacity?: number;
}, settings?: SiteSettings) {
  const { telephone } = contactOf(settings);

  return {
    "@type": "EventVenue",
    "@id": `${absoluteUrl(path)}#venue`,
    name,
    url: absoluteUrl(path),
    description,
    image: [absoluteUrl("/opengraph-image.jpg")],
    ...(telephone ? { telephone } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: settings?.city || ADDRESS_SCHEMA.addressLocality,
      addressRegion: settings?.state || ADDRESS_SCHEMA.addressRegion,
      addressCountry: settings?.country || ADDRESS_SCHEMA.addressCountry,
    },
    ...(maxCapacity
      ? { maximumAttendeeCapacity: maxCapacity }
      : {}),
    containedInPlace: { "@id": ORG_ID },
  };
}

/** The site as a whole. `WebSite` is what enables the sitelinks search box. */
export function websiteSchema(settings?: SiteSettings) {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: settings?.hotelName || SITE_NAME,
    description: settings?.tagline || SITE_DESCRIPTION,
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

/**
 * The room catalogue as an ordered list, for the pages that render every room
 * (the homepage section and /accommodations). It is what tells a crawler these
 * links are a set of alternatives rather than unrelated navigation.
 */
export function roomListSchema(rooms: Room[], path: string) {
  return {
    "@type": "ItemList",
    "@id": `${absoluteUrl(path)}#rooms`,
    name: "Room types",
    numberOfItems: rooms.length,
    itemListElement: rooms.map((room, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: room.name,
      url: absoluteUrl(roomPath(room.slug)),
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
