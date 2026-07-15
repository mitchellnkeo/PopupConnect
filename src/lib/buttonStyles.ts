/** Shared primary button interaction — darker hover per design review. */
export const primaryInteraction =
  "transition hover:bg-primary-hover active:bg-primary-hover/90";

export const btnPrimary = `rounded bg-primary px-5 py-2.5 font-semibold text-white ${primaryInteraction}`;

export const btnPrimaryFull = `w-full ${btnPrimary}`;

export const btnPrimarySm = `rounded bg-primary px-5 py-2.5 font-semibold text-sm text-white ${primaryInteraction}`;

export const btnPrimaryPill = `rounded-full bg-primary px-5 py-2 text-sm font-medium text-white shadow-sm ${primaryInteraction}`;

export const btnSecondaryOutline =
  "rounded border-2 border-primary bg-white px-5 py-2.5 font-semibold text-primary transition hover:bg-starlight/50";
