export type UpcomingPopup = {
  id: string;
  dateLabel: string;
  title: string;
  detail: string;
  place: string;
  vendorId: string;
};

export const upcomingPopups: UpcomingPopup[] = [
  {
    id: "clay-coffee",
    dateLabel: "OCT 17",
    title: "Clay, coffee & conversation",
    detail: "Workshop · 10am–1pm",
    place: "Salt Yard Studio · Kakaʻako",
    vendorId: "salt-yard",
  },
  {
    id: "golden-hour",
    dateLabel: "OCT 17",
    title: "Golden-hour mixer",
    detail: "Vendor showcase · 4–9pm",
    place: "The Lānai Loft · Kakaʻako",
    vendorId: "lanai-loft",
  },
  {
    id: "courtyard-market",
    dateLabel: "OCT 24",
    title: "The courtyard makers market",
    detail: "Independent makers · 11am–4pm",
    place: "Moana Courtyard · Waikīkī",
    vendorId: "moana-courtyard",
  },
];
