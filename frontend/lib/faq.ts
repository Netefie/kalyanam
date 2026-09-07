// The FAQ content, lifted out of components/home/Faq.tsx so it has exactly one
// home. The accordion renders it, and app/page.tsx feeds the same objects to a
// schema.org FAQPage block — if those two ever read from separate copies, the
// structured data starts describing questions the page doesn't answer, which is
// precisely what Google penalises.

export type FaqItem = { question: string; answer: string };

export const categories = [
  "Stay",
  "Experiences",
  "Dining",
  "Reservations",
  "Events",
  "Offers",
  "Brand",
];

export const faqData: Record<string, FaqItem[]> = {
  Stay: [
    {
      question:
        "What sets a stay at Kalyanam Hotel apart from other luxury hotels?",
      answer:
        "Kalyanam Hotel combines luxurious accommodation, exceptional hospitality, rooftop dining, elegant wedding venues, premium amenities and personalized guest experiences to make every stay memorable.",
    },
    {
      question:
        "Is Kalyanam Hotel a good option for families travelling together?",
      answer:
        "Yes. We offer spacious family rooms, multiple dining options, banquet facilities and comfortable spaces for guests of all ages.",
    },
    {
      question:
        "What makes Kalyanam Hotel perfect for romantic getaways?",
      answer:
        "Our premium suites, rooftop restaurant, private dining experiences and luxury interiors create the perfect atmosphere for couples.",
    },
    {
      question:
        "Does Kalyanam Hotel provide room service?",
      answer:
        "Yes. 24×7 room service is available for all guests during their stay.",
    },
    {
      question:
        "What facilities are available inside the hotel?",
      answer:
        "Luxury rooms, rooftop restaurant, banquet hall, wedding venue, parking, conference spaces, free Wi-Fi and premium hospitality services.",
    },
  ],

  Experiences: [
    {
      question: "What experiences does Kalyanam Hotel offer?",
      answer:
        "Wedding celebrations, corporate events, rooftop dining, staycations and family gatherings.",
    },
  ],

  Dining: [
    {
      question: "Do you have a rooftop restaurant?",
      answer:
        "Yes. Kaara Rooftop Restaurant offers fine dining with panoramic city views and carefully curated menus.",
    },
  ],

  Reservations: [
    {
      question: "How can I book a room?",
      answer:
        "You can reserve directly through our website or contact our reservations team.",
    },
  ],

  Events: [
    {
      question: "Do you host weddings and events?",
      answer:
        "Yes. We specialize in luxury weddings, receptions, engagement ceremonies, corporate meetings and private celebrations.",
    },
  ],

  Offers: [
    {
      question: "Do you provide seasonal offers?",
      answer:
        "Yes. Exclusive packages and seasonal promotions are available throughout the year.",
    },
  ],

  Brand: [
    {
      question: "Why choose Kalyanam Hotel?",
      answer:
        "Our focus is on luxury hospitality, elegant spaces and personalized service for every guest.",
    },
  ],
};

/** Every Q&A on the page, flattened — the order the FAQPage JSON-LD lists them in. */
export const allFaqs: FaqItem[] = categories.flatMap((c) => faqData[c] ?? []);
