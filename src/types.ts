export type CategoryKey = "pop2028" | "imd" | "neet" | "ehcp";

export interface LocalAuthority {
  name: string;
  pop2028: number;
  imd: number;
  neet: number;
  ehcp: number;
}

export interface CategoryMeta {
  key: CategoryKey;
  label: string;
  description: string;
}

export type Weightings = Record<CategoryKey, number>;

export interface AllocationResult {
  name: string;
  shareScore: number;
  /** Exact allocation (sums to the full pot before display rounding). */
  funding: number;
  /** Nearest-pound value shown in the chart and legend. */
  displayFunding: number;
  percentOfPot: number;
}
