export type CategoryKey =
  | "pop2028"
  | "imd"
  | "neet"
  | "ehcp"
  | "level12";

export interface LocalAuthority {
  name: string;
  pop2028: number;
  imd: number;
  neet: number;
  ehcp: number;
  level12: number;
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
