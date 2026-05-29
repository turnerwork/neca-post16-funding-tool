import { TOTAL_FUNDING_POT } from "../constants";
import type {
  AllocationResult,
  CategoryKey,
  LocalAuthority,
  Weightings,
} from "../types";

const CATEGORY_KEYS: CategoryKey[] = [
  "pop2028",
  "popGrowth",
  "imd",
  "neet",
  "ehcp",
];

function categoryTotals(data: LocalAuthority[]): Record<CategoryKey, number> {
  const totals = {} as Record<CategoryKey, number>;
  for (const key of CATEGORY_KEYS) {
    totals[key] = data.reduce((sum, la) => sum + la[key], 0);
  }
  return totals;
}

/** Round to whole pounds so displayed amounts always sum exactly to the pot. */
function roundToExactPot(
  rows: { name: string; shareScore: number; rawFunding: number }[],
): AllocationResult[] {
  if (rows.length === 0) return [];

  const rounded = rows.map((row) => {
    const floored = Math.floor(row.rawFunding);
    return {
      name: row.name,
      shareScore: row.shareScore,
      funding: floored,
      remainder: row.rawFunding - floored,
    };
  });

  let shortfall = TOTAL_FUNDING_POT - rounded.reduce((sum, row) => sum + row.funding, 0);
  const byRemainder = [...rounded].sort((a, b) => b.remainder - a.remainder);

  for (let i = 0; i < shortfall; i++) {
    byRemainder[i].funding += 1;
  }

  return rounded
    .map((row) => ({
      name: row.name,
      shareScore: row.shareScore,
      funding: row.funding,
      percentOfPot: (row.funding / TOTAL_FUNDING_POT) * 100,
    }))
    .sort((a, b) => b.funding - a.funding);
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

  const rawRows = withScores.map((row) => ({
    name: row.name,
    shareScore: row.shareScore,
    rawFunding:
      totalShareScore > 0
        ? (row.shareScore / totalShareScore) * TOTAL_FUNDING_POT
        : 0,
  }));

  return roundToExactPot(rawRows);
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
