import { LOGO_PATH } from "../config";
import { TOTAL_FUNDING_POT } from "../constants";
import { formatCurrency } from "../utils/allocation";

export function Header() {
  return (
    <header className="relative border-b border-neca-black/10 bg-white shadow-sm">
      <img
        src={LOGO_PATH}
        alt="North East MSA core lockup logo"
        className="absolute right-4 top-4 h-12 w-auto object-contain sm:right-6 sm:top-5 sm:h-14 lg:right-8"
      />
      <div className="mx-auto max-w-7xl px-4 py-5 pr-36 sm:px-6 sm:pr-44 lg:px-8 lg:pr-52">
        <p className="text-xs font-semibold uppercase tracking-widest text-neca-red">
          North East Mayoral Strategic Authority
        </p>
        <h1 className="mt-1 text-2xl font-extrabold text-neca-black sm:text-3xl">
          NECA post-16 funding allocation tool
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-neca-black/70">
          Explore how the {formatCurrency(TOTAL_FUNDING_POT)} post-16 sufficiency
          funding allocation is distributed across seven local authorities using
          category weightings.
        </p>
      </div>
    </header>
  );
}
