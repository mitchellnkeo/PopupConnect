import { BRAND_NAME } from "../config/brand";

export type DiscoveryAudience = "vendors" | "venues";

export const VENDORS_HOME = "/vendors";
export const VENUES_HOME = "/";

type PopularChip = {
  title: string;
  subtitle: string;
  to: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type Pathway = {
  title: string;
  body: string;
  cta: string;
  to: string;
};

export type DiscoveryHomeCopy = {
  headline: string;
  subhead: string;
  searchCta: string;
  searchCategoryId: string | null;
  popular: readonly PopularChip[];
  listingsEyebrow: string;
  listingsTitle: string;
  listingsCta: string;
  listingsTo: string;
  listingKind: "vendor" | "host";
  eventsEyebrow: string;
  eventsTitle: string;
  faq: readonly FaqItem[];
  belongSubhead: string;
  pathways: readonly Pathway[];
};

export const discoveryHomes: Record<DiscoveryAudience, DiscoveryHomeCopy> = {
  venues: {
    headline: "Find a place to gather",
    subhead: "Search venues, compare options, and book in minutes.",
    searchCta: "Search venues",
    searchCategoryId: "venues",
    popular: [
      { title: "Storefronts", subtitle: "Meet the neighbors", to: "/explore?category=venues&q=storefront" },
      { title: "Outdoor spaces", subtitle: "Gather in open air", to: "/explore?category=venues&q=garden" },
      { title: "Cafés & community", subtitle: "Make yourself at home", to: "/explore?category=venues&q=studio" },
      { title: "Large spaces", subtitle: "Endless potential", to: "/explore?category=venues&q=warehouse" },
    ],
    listingsEyebrow: "Explore",
    listingsTitle: "Spaces in your neighborhood",
    listingsCta: "Explore all venues",
    listingsTo: "/explore?category=venues",
    listingKind: "host",
    eventsEyebrow: "Checkout events around your area",
    eventsTitle: "See a space come to life",
    faq: [
      {
        question: `What can I discover on ${BRAND_NAME}?`,
        answer: "Independent vendors and artists, spaces for pop-ups, and ideas for local community events.",
      },
      {
        question: "How do I start a conversation?",
        answer: "Explore a profile and share your idea, dates, and what you need with the vendor or space owner.",
      },
      {
        question: "Can I join before I have an event planned?",
        answer: "Yes. Start with a profile, browse the community, and connect when your next idea takes shape.",
      },
    ],
    belongSubhead: "Find a space, meet your people, and make your idea real.",
    pathways: [
      {
        title: "Vendors & artists",
        body: "Show your craft, share what you offer, and find your next place to pop up.",
        cta: "Create a vendor profile",
        to: "/sign-up",
      },
      {
        title: "Space owners",
        body: "Open your doors to independent businesses and ideas that fit your space.",
        cta: "List your space",
        to: "/sign-up",
      },
    ],
  },
  vendors: {
    headline: "Find a creator to partner with",
    subhead: "Search vendors, compare options, and book in minutes.",
    searchCta: "Search vendors",
    searchCategoryId: null,
    popular: [
      { title: "Photography & media", subtitle: "Capture the special moments", to: "/explore?category=photo-booth" },
      { title: "Food & drink", subtitle: "Taste something local", to: "/explore?category=catering" },
      { title: "Flowers & plants", subtitle: "Bring ideas to bloom", to: "/explore?category=crafts&q=flowers" },
      { title: "Craft & design", subtitle: "Discover handmade goods", to: "/explore?category=crafts" },
    ],
    listingsEyebrow: "Explore",
    listingsTitle: "Makers near you",
    listingsCta: "Explore all makers",
    listingsTo: "/explore",
    listingKind: "vendor",
    eventsEyebrow: "Join the fun",
    eventsTitle: "See a vendor in action near you",
    faq: [
      {
        question: `What can I discover on ${BRAND_NAME}?`,
        answer: "Independent vendors, artists, and makers, plus ideas for local community events.",
      },
      {
        question: "How do I start a conversation?",
        answer: "Explore a maker profile and share your idea, dates, and what you need with the vendor.",
      },
      {
        question: "Can I join before I have an event planned?",
        answer: "Yes. Start with a profile, browse the community, and connect when your next idea takes shape.",
      },
    ],
    belongSubhead: "Find a maker, meet your people, and make your idea real.",
    pathways: [
      {
        title: "Vendors & artists",
        body: "Show your craft, share what you offer, and find your next place to pop up.",
        cta: "Create a vendor profile",
        to: "/sign-up",
      },
      {
        title: "Makers",
        body: "Share your craft, share what you offer, and find your next collaboration.",
        cta: "List your maker profile",
        to: "/sign-up",
      },
    ],
  },
};
