import type { CategoryMeta, CategoryKey } from "./types";

export const TOTAL_FUNDING_POT = 8_100_000;

/** Category weighting slider and input increment (percent). */
export const WEIGHTING_STEP = 2.5;

export function snapWeighting(value: number): number {
  const clamped = Math.min(100, Math.max(0, value));
  return Math.round(clamped / WEIGHTING_STEP) * WEIGHTING_STEP;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    key: "pop2028",
    label: "16–17 population\n(average 2027-2030 projection)",
    description: "16-17 pop - avg 2027-30 forecast",
  },
  {
    key: "imd",
    label: "IMD 20% most deprived LSOAs 16–17 population",
    description: "IMD 20% most deprived LSOAs 16-17 population",
  },
  {
    key: "neet",
    label: "NEET 16–17",
    description: "NEET 16-17",
  },
  {
    key: "ehcp",
    label: "EHCPs 16–17",
    description: "EHCPs 16-17",
  },
];

export const DEFAULT_WEIGHTINGS: Record<CategoryKey, number> = {
  pop2028: 25,
  imd: 25,
  neet: 25,
  ehcp: 25,
};

export const CSV_COLUMN_MAP: Record<string, CategoryKey | null> = {
  "local authority": null,
  "16-17 pop - avg 2027-30 forecast": "pop2028",
  "imd 20% deprived 16-17 population": "imd",
  "neet 16-17": "neet",
  "ehcps 16-17": "ehcp",
  "level 1-2 enrolment": null,
  "sen 16-17": null,
};
