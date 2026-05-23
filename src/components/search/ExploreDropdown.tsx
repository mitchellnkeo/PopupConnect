import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { exploreCategories } from "../../data/exploreCategories";
import { IconSearch } from "../discovery/icons";
import { Button } from "../ui/Button";

type ExploreDropdownProps = {
  areaLabel?: string;
  onSearch?: (query: string, categoryId: string | null) => void;
  className?: string;
};

export function ExploreDropdown({
  areaLabel = "popular in the Seattle, WA area",
  onSearch,
  className = "",
}: ExploreDropdownProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  function handleSearch() {
    if (onSearch) {
      onSearch(query, selectedCategory);
      return;
    }
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (selectedCategory) params.set("category", selectedCategory);
    const qs = params.toString();
    navigate(qs ? `/explore?${qs}` : "/explore");
  }

  return (
    <div
      className={`w-[min(100vw-2rem,400px)] rounded-2xl border border-neutral-200 bg-white p-4 shadow-lg ${className}`.trim()}
    >
      <label className="sr-only" htmlFor="explore-search">
        Search vendors
      </label>
      <div className="relative">
        <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500" />
        <input
          id="explore-search"
          type="search"
          placeholder="search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-full border border-neutral-300 bg-white py-2.5 pr-3 pl-10 text-sm text-neutral-900 outline-none ring-primary/30 placeholder:text-neutral-400 focus:ring-2"
        />
      </div>

      <p className="mt-3 text-neutral-500 text-xs lowercase">{areaLabel}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {exploreCategories.map((cat) => {
          const selected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(selected ? null : cat.id)}
              className={`rounded-full border px-3 py-1.5 text-midnight text-xs lowercase transition ${
                selected
                  ? "border-primary bg-starlight/60"
                  : "border-neutral-300 bg-white hover:bg-starlight/40"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex justify-end">
        <Button type="button" variant="primary" onClick={handleSearch}>
          search
        </Button>
      </div>
    </div>
  );
}
