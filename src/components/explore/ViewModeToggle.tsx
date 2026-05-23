import { IconList, IconMap } from "./icons";

export type ViewMode = "map" | "list";

type ViewModeToggleProps = {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
};

export function ViewModeToggle({ mode, onChange }: ViewModeToggleProps) {
  return (
    <div
      className="inline-flex rounded-full border border-neutral-200 bg-neutral-50 p-1"
      role="group"
      aria-label="Results view"
    >
      <button
        type="button"
        onClick={() => onChange("map")}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
          mode === "map" ? "bg-white text-midnight shadow-sm" : "text-neutral-600 hover:text-midnight"
        }`}
      >
        <IconMap className="size-4" />
        show map
      </button>
      <button
        type="button"
        onClick={() => onChange("list")}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
          mode === "list" ? "bg-white text-midnight shadow-sm" : "text-neutral-600 hover:text-midnight"
        }`}
      >
        <IconList className="size-4" />
        show list
      </button>
    </div>
  );
}
