import { useEffect, useMemo, useState } from "react";
import { AllocationChart } from "./components/AllocationChart";
import { Header } from "./components/Header";
import { WeightingForm } from "./components/WeightingForm";
import { CATEGORIES, DEFAULT_WEIGHTINGS, snapWeighting } from "./constants";
import type {
  AllocationResult,
  CategoryKey,
  LocalAuthority,
  Weightings,
} from "./types";
import { calculateAllocations, sumWeightings } from "./utils/allocation";
import { CSV_PATH } from "./config";
import { loadLocalAuthorities } from "./utils/parseCsv";

export default function App() {
  const [authorities, setAuthorities] = useState<LocalAuthority[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [weightings, setWeightings] = useState<Weightings>({ ...DEFAULT_WEIGHTINGS });
  const [lastCommittedAllocations, setLastCommittedAllocations] = useState<
    AllocationResult[]
  >([]);

  useEffect(() => {
    loadLocalAuthorities(CSV_PATH)
      .then(setAuthorities)
      .catch((err: unknown) => {
        setLoadError(err instanceof Error ? err.message : "Failed to load CSV data.");
      })
      .finally(() => setLoading(false));
  }, []);

  const totalPercent = useMemo(() => sumWeightings(weightings), [weightings]);
  const isValid = Math.abs(totalPercent - 100) < 0.05;

  const allocations = useMemo(() => {
    if (!isValid || authorities.length === 0) return [];
    return calculateAllocations(authorities, weightings);
  }, [authorities, weightings, isValid]);

  useEffect(() => {
    if (allocations.length > 0) {
      setLastCommittedAllocations(allocations);
    }
  }, [allocations]);

  const chartResults =
    allocations.length > 0 ? allocations : lastCommittedAllocations;
  const showingPreviousValidResult =
    !isValid && chartResults.length > 0 && authorities.length > 0;
  const categoryTotalsText = useMemo(() => {
    if (authorities.length === 0) return "";
    return CATEGORIES.map(({ key, description }) => {
      const total = authorities.reduce((sum, la) => sum + la[key], 0);
      return `${description}: ${total.toLocaleString("en-GB")}`;
    }).join(" | ");
  }, [authorities]);

  const handleWeightChange = (key: CategoryKey, value: number) => {
    setWeightings((prev) => ({ ...prev, [key]: snapWeighting(value) }));
  };

  const handleReset = () => setWeightings({ ...DEFAULT_WEIGHTINGS });

  return (
    <div className="min-h-screen bg-neca-white">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading && (
          <p className="rounded-xl bg-white p-6 text-sm text-neca-black/70 shadow-sm">
            Loading local authority data…
          </p>
        )}

        {loadError && (
          <p className="rounded-xl border border-neca-red/30 bg-neca-red/5 p-4 text-sm text-neca-red" role="alert">
            {loadError}
          </p>
        )}

        {!loading && !loadError && (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:items-start">
            <WeightingForm
              weightings={weightings}
              totalPercent={totalPercent}
              isValid={isValid}
              onChange={handleWeightChange}
              onReset={handleReset}
            />
            <AllocationChart
              results={chartResults}
              disabled={chartResults.length === 0}
              isStale={showingPreviousValidResult}
            />
          </div>
        )}

        {import.meta.env.DEV && categoryTotalsText && (
          <p className="mt-4 rounded-md border border-neca-black/10 bg-white px-3 py-2 font-mono text-[11px] text-neca-black/65">
            CSV category totals (dev only): {categoryTotalsText}
          </p>
        )}

        <footer className="mt-10 border-t border-neca-black/10 pt-6 text-xs text-neca-black/50">
          Produced by www.jamesturner.work, May 2026
        </footer>
      </main>
    </div>
  );
}
