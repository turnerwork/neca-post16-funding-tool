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
    label: "16–17 population (2028 forecast)",
    description: "16-17 pop - 2028 forecast",
  },
  {
    key: "imd",
    label: "IMD 20% deprived 16–17 population",
    description: "IMD 20% deprived 16-17 population",
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
  {
    key: "level12",
    label: "Level 1–2 enrolment",
    description: "Level 1-2 enrolment",
  },
];

export const DEFAULT_WEIGHTINGS: Record<CategoryKey, number> = {
  pop2028: 20,
  imd: 20,
  neet: 20,
  ehcp: 20,
  level12: 20,
};

export const CSV_COLUMN_MAP: Record<string, CategoryKey | null> = {
  "local authority": null,
  "16-17 pop - 2028 forecast": "pop2028",
  "imd 20% deprived 16-17 population": "imd",
  "neet 16-17": "neet",
  "ehcps 16-17": "ehcp",
  "level 1-2 enrolment": "level12",
  "sen 16-17": null,
};
