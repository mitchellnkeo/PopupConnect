export type VendorPackage = {
  id: string;
  name: string;
  price: number;
  description: string;
  /** Extra bullet points shown in the package detail popout */
  highlights?: string[];
};

export type VendorProfile = {
  id: string;
  slug: string;
  title: string;
  city: string;
  distance: string;
  categoryIds: string[];
  imageSrc?: string;
  heroImageSrc?: string;
  tags: string[];
  about: string;
  whatsIncluded: string[];
  idealFor: string;
  startingPrice: number;
  deposit: number;
  leadTime: string;
  minPartySize: number;
  responseTime: string;
  verified: string[];
  contact: {
    website: string;
    instagram: string;
    tiktok: string;
    email: string;
    phone: string;
  };
  highlights: {
    bookingsThisYear: number;
    localPartnerships: number;
    repeatClients: number;
    avgRating: number;
  };
  packages: VendorPackage[];
  gallery: string[];
  mapX: number;
  mapY: number;
  lat: number;
  lng: number;
};

export const vendors: VendorProfile[] = [
  {
    id: "aki-matcha",
    slug: "akis-mobile-matcha-bar",
    title: "Aki's Mobile Matcha Bar",
    city: "Honolulu, HI",
    distance: "0.3 miles away",
    categoryIds: ["matcha-bar"],
    imageSrc: "/images/vendors/aki-matcha.png",
    heroImageSrc: "/images/vendors/aki-hero.png",
    tags: ["private events", "hand-crafted", "Mobile bar", "Made-to-order", "Young adult friendly"],
    about:
      "Bring a one-of-a-kind mobile matcha bar to your next event with Aki Oshiro, a nationally recognized tea ceremony master with over a decade of expertise in matcha-based beverages.",
    whatsIncluded: [
      "Full mobile bar setup and breakdown",
      "Made-to-order matcha drinks for every guest",
      "Ceremonial-grade matcha sourced directly from Japan",
      "Signature drink menu featuring traditional bowls, lattes, and seasonal specials",
      "Brief cultural storytelling and guest interaction throughout the event",
    ],
    idealFor:
      "Weddings, bridal & baby showers, corporate events, pop-ups, farmers markets, wellness retreats, birthday parties, and more.",
    startingPrice: 120,
    deposit: 50,
    leadTime: "2 days",
    minPartySize: 10,
    responseTime: "2 hours",
    verified: [
      "Food safety handlers certificate",
      "Health and safety certificate",
      "Seattle food and beverage certificate",
      "Background checked",
      "Drug free workplace",
    ],
    contact: {
      website: "AkiMobileMatchaBar.com",
      instagram: "AkiMobileMatchaBar",
      tiktok: "AkiMobileMatchaBar",
      email: "AkiMobileMatcha@gmail.com",
      phone: "(123) 456-7890",
    },
    highlights: { bookingsThisYear: 275, localPartnerships: 15, repeatClients: 68, avgRating: 4.9 },
    packages: [
      {
        id: "premium",
        name: "Premium Matcha Bar Package",
        price: 360,
        description: "Full mobile bar with ceremonial matcha service for up to 20 guests.",
        highlights: [
          "Ceremonial-grade matcha sourced from Japan",
          "Made-to-order drinks for up to 20 guests",
          "Full mobile bar setup and breakdown",
          "Cultural storytelling throughout the event",
        ],
      },
      {
        id: "standard",
        name: "Standard Matcha Bar Package",
        price: 240,
        description: "Mobile bar setup with classic matcha drinks for up to 15 guests.",
        highlights: [
          "Classic matcha drink menu",
          "Service for up to 15 guests",
          "Mobile bar setup included",
        ],
      },
    ],
    gallery: [
      "/images/vendors/aki-matcha.png",
      "/images/vendors/aki-hero.png",
      "/images/vendors/green-cup.png",
    ],
    mapX: 42,
    mapY: 48,
    lat: 21.3099,
    lng: -157.8583,
  },
  {
    id: "whiskd",
    slug: "whiskd",
    title: "Whisk'd",
    city: "Honolulu, HI",
    distance: "0.5 miles away",
    categoryIds: ["matcha-bar"],
    imageSrc: "/images/vendors/whiskd.png",
    tags: ["matcha", "mobile bar", "events"],
    about: "Artisan matcha experiences crafted for intimate gatherings and pop-up events.",
    whatsIncluded: ["Mobile bar setup", "Custom drink menu", "On-site service"],
    idealFor: "Private parties, corporate mixers, and wellness events.",
    startingPrice: 100,
    deposit: 40,
    leadTime: "3 days",
    minPartySize: 8,
    responseTime: "4 hours",
    verified: ["Background checked"],
    contact: {
      website: "whiskd.co",
      instagram: "whiskdmatcha",
      tiktok: "whiskdmatcha",
      email: "hello@whiskd.co",
      phone: "(123) 456-7891",
    },
    highlights: { bookingsThisYear: 142, localPartnerships: 8, repeatClients: 41, avgRating: 4.7 },
    packages: [
      { id: "classic", name: "Classic Package", price: 280, description: "Matcha bar for up to 18 guests." },
    ],
    gallery: ["/images/vendors/whiskd.png"],
    mapX: 55,
    mapY: 52,
    lat: 21.3049,
    lng: -157.8523,
  },
  {
    id: "green-cup",
    slug: "the-green-cup",
    title: "The Green Cup",
    city: "Honolulu, HI",
    distance: "0.8 miles away",
    categoryIds: ["matcha-bar"],
    imageSrc: "/images/vendors/green-cup.png",
    tags: ["organic", "matcha", "catering"],
    about: "Organic matcha catering with a focus on sustainable sourcing and zero-waste service.",
    whatsIncluded: ["Eco-friendly bar setup", "Organic matcha drinks", "Compostable cups"],
    idealFor: "Eco-conscious events, farmers markets, and outdoor festivals.",
    startingPrice: 95,
    deposit: 35,
    leadTime: "4 days",
    minPartySize: 12,
    responseTime: "6 hours",
    verified: ["Health and safety certificate"],
    contact: {
      website: "thegreencup.com",
      instagram: "thegreencup",
      tiktok: "thegreencup",
      email: "book@thegreencup.com",
      phone: "(123) 456-7892",
    },
    highlights: { bookingsThisYear: 98, localPartnerships: 6, repeatClients: 29, avgRating: 4.6 },
    packages: [
      { id: "eco", name: "Eco Package", price: 220, description: "Sustainable matcha service for up to 16 guests." },
    ],
    gallery: ["/images/vendors/green-cup.png"],
    mapX: 38,
    mapY: 60,
    lat: 21.3019,
    lng: -157.8643,
  },
  {
    id: "jade-cup",
    slug: "jade-cup-matcha",
    title: "Jade Cup Matcha",
    city: "Honolulu, HI",
    distance: "1.1 miles away",
    categoryIds: ["matcha-bar"],
    tags: ["ceremonial", "matcha"],
    about: "Traditional Japanese tea ceremony experiences adapted for modern events.",
    whatsIncluded: ["Ceremony demonstration", "Matcha tasting", "Cultural presentation"],
    idealFor: "Corporate retreats, cultural celebrations, and intimate gatherings.",
    startingPrice: 150,
    deposit: 60,
    leadTime: "5 days",
    minPartySize: 6,
    responseTime: "3 hours",
    verified: ["Food safety handlers certificate", "Background checked"],
    contact: {
      website: "jadecupmatcha.com",
      instagram: "jadecupmatcha",
      tiktok: "jadecupmatcha",
      email: "info@jadecupmatcha.com",
      phone: "(123) 456-7893",
    },
    highlights: { bookingsThisYear: 67, localPartnerships: 4, repeatClients: 22, avgRating: 4.8 },
    packages: [
      { id: "ceremony", name: "Ceremony Package", price: 400, description: "Full ceremony experience for up to 12 guests." },
    ],
    gallery: ["/images/vendors/green-cup.png"],
    mapX: 62,
    mapY: 44,
    lat: 21.3129,
    lng: -157.8483,
  },
  {
    id: "ocha-matcha",
    slug: "ocha-matcha",
    title: "Ocha Matcha",
    city: "Honolulu, HI",
    distance: "1.4 miles away",
    categoryIds: ["matcha-bar"],
    tags: ["matcha", "latte bar"],
    about: "Trendy matcha latte bar perfect for social events and brand activations.",
    whatsIncluded: ["Latte bar setup", "Seasonal menu", "Branded cups available"],
    idealFor: "Brand activations, launch parties, and social gatherings.",
    startingPrice: 110,
    deposit: 45,
    leadTime: "3 days",
    minPartySize: 15,
    responseTime: "5 hours",
    verified: ["Background checked"],
    contact: {
      website: "ochamatcha.com",
      instagram: "ochamatcha",
      tiktok: "ochamatcha",
      email: "events@ochamatcha.com",
      phone: "(123) 456-7894",
    },
    highlights: { bookingsThisYear: 113, localPartnerships: 9, repeatClients: 35, avgRating: 4.5 },
    packages: [
      { id: "latte", name: "Latte Bar Package", price: 300, description: "Matcha latte bar for up to 25 guests." },
    ],
    gallery: ["/images/vendors/whiskd.png"],
    mapX: 48,
    mapY: 65,
    lat: 21.3079,
    lng: -157.8693,
  },
  {
    id: "mist-bar",
    slug: "the-mist-bar",
    title: "The Mist Bar",
    city: "Honolulu, HI",
    distance: "1.8 miles away",
    categoryIds: ["matcha-bar"],
    tags: ["matcha", "cocktails"],
    about: "Matcha-infused craft beverages with a modern cocktail bar twist.",
    whatsIncluded: ["Full bar setup", "Matcha cocktails", "Bartender service"],
    idealFor: "Evening events, weddings, and upscale private parties.",
    startingPrice: 180,
    deposit: 75,
    leadTime: "7 days",
    minPartySize: 20,
    responseTime: "8 hours",
    verified: ["Health and safety certificate", "Background checked"],
    contact: {
      website: "themistbar.com",
      instagram: "themistbar",
      tiktok: "themistbar",
      email: "book@themistbar.com",
      phone: "(123) 456-7895",
    },
    highlights: { bookingsThisYear: 54, localPartnerships: 3, repeatClients: 18, avgRating: 4.9 },
    packages: [
      { id: "evening", name: "Evening Package", price: 480, description: "Premium evening bar service for up to 30 guests." },
    ],
    gallery: ["/images/vendors/aki-hero.png"],
    mapX: 70,
    mapY: 55,
    lat: 21.3159,
    lng: -157.8553,
  },
];

export function getVendorById(id: string): VendorProfile | undefined {
  return vendors.find((v) => v.id === id || v.slug === id);
}
