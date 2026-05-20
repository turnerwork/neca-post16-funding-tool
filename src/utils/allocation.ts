import { TOTAL_FUNDING_POT } from "../constants";
import type {
  AllocationResult,
  CategoryKey,
  LocalAuthority,
  Weightings,
} from "../types";

const CATEGORY_KEYS: CategoryKey[] = ["pop2028", "imd", "neet", "ehcp"];

function categoryTotals(data: LocalAuthority[]): Record<CategoryKey, number> {
  const totals = {} as Record<CategoryKey, number>;
  for (const key of CATEGORY_KEYS) {
    totals[key] = data.reduce((sum, la) => sum + la[key], 0);
  }
  return totals;
}

export function calculateAllocations(
  data: LocalAuthority[],
  weightings: Weightings,
): AllocationResult[] {
  const totals = categoryTotals(data);

  const withScores = data.map((la) => {
    const shareScore = CATEGORY_KEYS.reduce((score, key) => {
      const regionalTotal = totals[key];
      const laShare = regionalTotal > 0 ? la[key] / regionalTotal : 0;
      return score + laShare * (weightings[key] / 100);
    }, 0);

    return { name: la.name, shareScore };
  });

  const totalShareScore = withScores.reduce((sum, row) => sum + row.shareScore, 0);

  const results: AllocationResult[] = withScores.map((row) => {
    const funding =
      totalShareScore > 0
        ? (row.shareScore / totalShareScore) * TOTAL_FUNDING_POT
        : 0;
    return {
      name: row.name,
      shareScore: row.shareScore,
      funding,
      percentOfPot: (funding / TOTAL_FUNDING_POT) * 100,
    };
  });

  return results.sort((a, b) => b.funding - a.funding);
}

export function sumWeightings(weightings: Weightings): number {
  return CATEGORY_KEYS.reduce((sum, key) => sum + weightings[key], 0);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}
