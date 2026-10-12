/** Shared primary button interaction — darker hover per design review. */
export const primaryInteraction =
  "transition hover:bg-primary-hover active:bg-primary-hover/90";

export const btnPrimary = `rounded px-5 py-2.5 font-normal text-[19px] text-white ${primaryInteraction} bg-primary min-h-11`;

export const btnPrimaryFull = `w-full ${btnPrimary}`;

export const btnPrimarySm = `rounded bg-primary px-5 py-2.5 font-normal text-sm text-white ${primaryInteraction}`;

export const btnPrimaryPill = `rounded bg-primary px-5 py-2 text-sm font-medium text-white shadow-sm ${primaryInteraction}`;

export const btnSecondaryOutline =
  "rounded border-2 border-primary bg-white px-5 py-2.5 font-semibold text-primary transition hover:bg-starlight/50";

export const btnTertiary =
  "inline-flex min-h-10 items-center gap-2.5 rounded px-3 py-[5.5px] text-[19px] text-primary transition hover:bg-teal-100";
