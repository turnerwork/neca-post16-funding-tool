import { CATEGORIES, WEIGHTING_STEP } from "../constants";
import type { CategoryKey, Weightings } from "../types";

interface WeightingFormProps {
  weightings: Weightings;
  totalPercent: number;
  isValid: boolean;
  onChange: (key: CategoryKey, value: number) => void;
  onReset: () => void;
}

export function WeightingForm({
  weightings,
  totalPercent,
  isValid,
  onChange,
  onReset,
}: WeightingFormProps) {
  return (
    <section className="rounded-2xl border border-neca-black/10 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-neca-black">Category weightings</h2>
          <p className="mt-1 text-sm text-neca-black/65">
            Set the percentage weighting for each indicator. All four must total
            100%.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="shrink-0 rounded-lg border border-neca-blue/30 px-3 py-1.5 text-xs font-semibold text-neca-blue transition hover:bg-neca-blue/5"
        >
          Reset to 25% each
        </button>
      </div>

      <div className="mt-6 space-y-5">
        {CATEGORIES.map((category) => {
          const value = weightings[category.key];
          return (
            <div key={category.key}>
              <div className="mb-2 flex items-start justify-between gap-3">
                <label
                  htmlFor={`weight-${category.key}`}
                  className="whitespace-pre-line text-sm font-semibold leading-snug text-neca-black"
                >
                  {category.label}
                </label>
                <div className="flex items-center gap-1">
                  <input
                    id={`weight-${category.key}`}
                    type="number"
                    min={0}
                    max={100}
                    step={WEIGHTING_STEP}
                    value={value}
                    onChange={(e) =>
                      onChange(category.key, Number(e.target.value) || 0)
                    }
                    className="w-[4.25rem] rounded-lg border border-neca-black/15 bg-neca-white px-2 py-1 text-right text-sm font-bold text-neca-black focus:border-neca-red focus:outline-none focus:ring-2 focus:ring-neca-red/20"
                    aria-label={`${category.label.replace("\n", " ")} weighting percent`}
                  />
                  <span className="text-sm font-semibold text-neca-black/60">%</span>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={WEIGHTING_STEP}
                value={value}
                onChange={(e) => onChange(category.key, Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-neca-teal/20 accent-neca-red"
                aria-hidden
              />
              <p className="mt-1 text-xs text-neca-black/50">{category.description}</p>
            </div>
          );
        })}
      </div>

      <div
        className={`mt-6 rounded-xl border px-4 py-3 ${
          isValid
            ? "border-neca-green/30 bg-neca-green/5"
            : "border-neca-red/40 bg-neca-red/5"
        }`}
      >
        <p className="text-sm font-semibold text-neca-black">
          Total weighting:{" "}
          <span className={isValid ? "text-neca-green" : "text-neca-red"}>
            {totalPercent.toFixed(1)}%
          </span>
        </p>
        {!isValid && (
          <p className="mt-1 text-sm text-neca-red" role="alert">
            Weightings must add up to exactly 100% before allocations can be
            calculated. Adjust the sliders or values above.
          </p>
        )}
      </div>
    </section>
  );
}
