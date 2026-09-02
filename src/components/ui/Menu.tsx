import { useEffect, useId, useRef, useState, type ReactNode } from "react";

type MenuProps = {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  "aria-label"?: string;
};

export function Menu({ trigger, children, align = "right", "aria-label": ariaLabel }: MenuProps) {
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative inline-block">
      <div
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen((current) => !current);
          }
        }}
      >
        {trigger}
      </div>
      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={ariaLabel}
          className={[
            "absolute z-50 mt-2 min-w-44 overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 shadow-lg",
            align === "right" ? "right-0" : "left-0",
          ].join(" ")}
        >
          <div onClick={() => setOpen(false)}>{children}</div>
        </div>
      ) : null}
    </div>
  );
}

type MenuItemProps = {
  children: ReactNode;
  onClick?: () => void;
};

export function MenuItem({ children, onClick }: MenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="block w-full px-4 py-2.5 text-left text-midnight text-sm transition hover:bg-starlight/60"
    >
      {children}
    </button>
  );
}
