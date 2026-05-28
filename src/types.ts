export type CategoryKey = "pop2028" | "popGrowth" | "imd" | "neet" | "ehcp";

export interface LocalAuthority {
  name: string;
  pop2028: number;
  popGrowth: number;
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
  funding: number;
  percentOfPot: number;
}
