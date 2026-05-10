import type { VendorItem } from "../../data/mockVendors";
import { VendorCard } from "./VendorCard";

type VendorSectionProps = {
  title: string;
  items: VendorItem[];
};

export function VendorSection({ title, items }: VendorSectionProps) {
  return (
    <section className="mb-14">
      <h2 className="mb-5 font-semibold text-midnight text-xl lowercase tracking-tight">{title}</h2>
      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
        {items.map((item) => (
          <VendorCard
            key={item.id}
            title={item.title}
            city={item.city}
            distanceMiles={item.distanceMiles}
            isNew={item.isNew}
          />
        ))}
      </div>
    </section>
  );
}
