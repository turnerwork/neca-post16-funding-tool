import Papa from "papaparse";
import { CSV_COLUMN_MAP } from "../constants";
import type { CategoryKey, LocalAuthority } from "../types";

function parseRow(row: Record<string, string>): LocalAuthority | null {
  const entries = Object.entries(row);
  if (entries.length === 0) return null;

  let name = "";
  const values = {} as Record<CategoryKey, number>;

  for (const [rawHeader, rawValue] of entries) {
    const header = rawHeader.trim().toLowerCase();
    const mapped = CSV_COLUMN_MAP[header];

    if (mapped === null && header === "local authority") {
      name = rawValue.trim();
      continue;
    }

    if (mapped) {
      const parsed = Number(String(rawValue).replace(/,/g, "").trim());
      if (!Number.isFinite(parsed)) return null;
      values[mapped] = parsed;
    }
  }

  if (!name) return null;

  return {
    name,
    pop2028: values.pop2028 ?? 0,
    popGrowth: values.popGrowth ?? 0,
    imd: values.imd ?? 0,
    neet: values.neet ?? 0,
    ehcp: values.ehcp ?? 0,
  };
}

export async function loadLocalAuthorities(csvUrl: string): Promise<LocalAuthority[]> {
  const response = await fetch(csvUrl);
  if (!response.ok) {
    throw new Error(`Failed to load data (${response.status})`);
  }

  const text = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const authorities = results.data
          .map(parseRow)
          .filter((row): row is LocalAuthority => row !== null);

        if (authorities.length === 0) {
          reject(new Error("No local authority rows found in CSV."));
          return;
        }

        resolve(authorities);
      },
      error: (error: Error) => reject(error),
    });
  });
}
