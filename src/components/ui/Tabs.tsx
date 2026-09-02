type TabItem = {
  id: string;
  label: string;
};

type TabsProps = {
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
  grow?: boolean;
  "aria-label"?: string;
};

export function Tabs({ tabs, value, onChange, grow = true, "aria-label": ariaLabel }: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`flex gap-1 rounded-xl bg-neutral-100 p-1 ${grow ? "" : "w-max"}`}
    >
      {tabs.map((tab) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            id={`tab-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={[
              grow ? "flex-1" : "shrink-0 whitespace-nowrap",
              "rounded-lg px-3 py-2 font-medium text-sm transition",
              selected
                ? "bg-white text-midnight shadow-sm"
                : "text-neutral-600 hover:text-midnight",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
