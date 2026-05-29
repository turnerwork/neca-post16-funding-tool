import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TOTAL_FUNDING_POT } from "../constants";
import type { AllocationResult } from "../types";
import { formatCurrency, formatPercent } from "../utils/allocation";

const AUTHORITY_COLOURS: Record<string, string> = {
  "County Durham": "#e4003b",
  Gateshead: "#33a38c",
  "Newcastle upon Tyne": "#00478a",
  "North Tyneside": "#8f3e8d",
  Northumberland: "#f25c29",
  "South Tyneside": "#005837",
  Sunderland: "#ed1163",
};

function getAuthorityColour(name: string): string {
  return AUTHORITY_COLOURS[name] ?? "#231f20";
}

interface ChartRow {
  name: string;
  shortName: string;
  funding: number;
  percentOfPot: number;
}

function shortenLaName(name: string): string {
  const labels: Record<string, string> = {
    "County Durham": "Durham",
    "Newcastle upon Tyne": "Newcastle",
    "North Tyneside": "N. Tyneside",
    "South Tyneside": "S. Tyneside",
  };
  return labels[name] ?? name;
}

interface AllocationChartProps {
  results: AllocationResult[];
  disabled: boolean;
  isStale?: boolean;
}

function LegendItem({ row }: { row: ChartRow }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-neca-white px-3 py-2 text-sm">
      <span
        className="inline-block h-3 w-3 shrink-0 rounded-sm"
        style={{ backgroundColor: getAuthorityColour(row.name) }}
        aria-hidden
      />
      <span className="font-medium text-neca-black">{row.name}</span>
      <span className="ml-auto font-semibold text-neca-blue">
        {formatCurrency(row.funding)}
      </span>
    </div>
  );
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ChartRow }[];
}) {
  if (!active || !payload?.[0]) return null;
  const row = payload[0].payload;
  return (
    <div className="rounded-lg border border-neca-black/10 bg-white px-3 py-2 shadow-lg">
      <p className="text-sm font-bold text-neca-black">{row.name}</p>
      <p className="text-sm text-neca-blue">{formatCurrency(row.funding)}</p>
      <p className="text-xs text-neca-black/60">
        {formatPercent(row.percentOfPot)} of allocation
      </p>
    </div>
  );
}

export function AllocationChart({
  results,
  disabled,
  isStale = false,
}: AllocationChartProps) {
  const chartData: ChartRow[] = results.map((row) => ({
    name: row.name,
    shortName: shortenLaName(row.name),
    funding: row.funding,
    percentOfPot: row.percentOfPot,
  }));

  const leftLegend = chartData.slice(0, 4);
  const rightLegend = chartData.slice(4);

  const maxFunding = chartData[0]?.funding ?? 0;
  /** Slight headroom on the axis; labels sit inside the bars. */
  const axisMax = maxFunding > 0 ? maxFunding * 1.06 : 1;

  if (disabled) {
    return (
      <section className="flex min-h-[360px] flex-col rounded-2xl border border-neca-black/10 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-neca-black">Allocation by local authority</h2>
        <div className="mt-8 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-neca-black/15 bg-neca-white px-6 text-center">
          <p className="text-base font-semibold text-neca-black/70">
            Chart unavailable
          </p>
          <p className="mt-2 max-w-sm text-sm text-neca-black/55">
            Set category weightings that total 100% to view ranked funding
            allocations for all seven local authorities.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-w-0 rounded-2xl border border-neca-black/10 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-neca-black">
          Allocation by local authority
        </h2>
        <p className="mt-1 text-sm text-neca-black/65">
          Ranked largest to smallest. Labels show funding amount and share of the
          overall £8.1m allocation.
        </p>
      </div>

      <div className="relative h-[380px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
            barCategoryGap="6%"
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#231f2015" />
            <XAxis
              type="number"
              domain={[0, axisMax]}
              tickFormatter={(v) => `£${(v / 1_000_000).toFixed(1)}m`}
              tick={{ fill: "#231f20", fontSize: 12 }}
              axisLine={{ stroke: "#231f2030" }}
            />
            <YAxis
              type="category"
              dataKey="shortName"
              width={100}
              tick={{ fill: "#231f20", fontSize: 12, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#00478a10" }} />
            <Bar dataKey="funding" radius={[0, 6, 6, 0]} maxBarSize={36}>
              {chartData.map((row) => (
                <Cell
                  key={`cell-${row.name}`}
                  fill={getAuthorityColour(row.name)}
                  fillOpacity={isStale ? 0.45 : 1}
                />
              ))}
              <LabelList
                dataKey="funding"
                content={(props) => {
                  const { x, y, width, height, value, index } = props;
                  const row = chartData[index ?? 0];
                  if (
                    row == null ||
                    value == null ||
                    x == null ||
                    y == null ||
                    height == null ||
                    width == null
                  ) {
                    return null;
                  }

                  const barW = Number(width);
                  if (barW < 48) return null;

                  const label = `${formatCurrency(Number(value))} (${formatPercent(row.percentOfPot)})`;
                  const centerY = Number(y) + Number(height) / 2;
                  const labelX = Number(x) + barW - 10;

                  return (
                    <text
                      x={labelX}
                      y={centerY}
                      textAnchor="end"
                      dominantBaseline="middle"
                      fill={isStale ? "#d9d9d9" : "#f8f8f8"}
                      fontSize={11}
                      fontWeight={500}
                      style={{ textShadow: "0 1px 2px rgba(35, 31, 32, 0.5)" }}
                    >
                      {label}
                    </text>
                  );
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {isStale && (
          <div className="pointer-events-none absolute inset-0 flex items-start justify-end p-2">
            <span className="rounded-md border border-neca-black/15 bg-white/85 px-2 py-1 text-xs font-semibold text-neca-black/70">
              Showing previous valid chart (total must be 100% to update)
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          {leftLegend.map((row) => (
            <LegendItem key={row.name} row={row} />
          ))}
        </div>
        <div className="grid grid-rows-4 gap-2">
          {rightLegend.map((row) => (
            <LegendItem key={row.name} row={row} />
          ))}
          <div className="flex items-center gap-2 border-t border-neca-black bg-white px-3 pt-2 pb-2 text-sm">
            <span className="font-bold text-neca-black">Total</span>
            <span className="ml-auto font-bold text-neca-black">
              {formatCurrency(TOTAL_FUNDING_POT)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
