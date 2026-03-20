"use client";

import type { SimulationResult } from "@/lib/types";

const fmtEur = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: "positive" | "negative" | "neutral";
}) {
  const colorClass =
    color === "positive"
      ? "text-positive"
      : color === "negative"
        ? "text-negative"
        : "";

  return (
    <div className="rounded-xl border border-foreground/10 bg-card p-4">
      <p className="text-xs font-medium text-foreground/60">{label}</p>
      <p className={`mt-1 text-xl font-bold tabular-nums ${colorClass}`}>
        {value}
      </p>
    </div>
  );
}

function CycleBlock({
  title,
  summary,
  active,
}: {
  title: string;
  summary: SimulationResult["cycle1"];
  active: boolean;
}) {
  if (!active) {
    return (
      <div className="rounded-xl border border-foreground/10 bg-card p-5 opacity-40">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-foreground/50">
          Cycle désactivé (durée = 0)
        </p>
      </div>
    );
  }

  const profitColor = summary.beneficeBrut >= 0 ? "positive" : "negative";
  const netColor = summary.beneficeNet >= 0 ? "positive" : "negative";

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Cash Out Total"
          value={fmtEur.format(summary.cashOut)}
          color="negative"
        />
        <StatCard
          label="Cash In Total"
          value={fmtEur.format(summary.cashIn)}
          color="positive"
        />
        <StatCard
          label="Bénéfice Brut"
          value={fmtEur.format(summary.beneficeBrut)}
          color={profitColor}
        />
        <StatCard
          label="Bénéfice Net"
          value={fmtEur.format(summary.beneficeNet)}
          color={netColor}
        />
      </div>
      {summary.depensesTotal > 0 && (
        <p className="text-sm text-foreground/60">
          Dépenses imputées : {fmtEur.format(summary.depensesTotal)}
        </p>
      )}
      <div
        className={`rounded-lg px-4 py-2 text-sm font-medium ${
          summary.beneficeBrut >= 0
            ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
            : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
        }`}
      >
        {summary.interpretation}
      </div>
    </div>
  );
}

export function SummaryPanel({ result }: { result: SimulationResult }) {
  return (
    <div className="grid gap-6">
      <CycleBlock
        title="1er Cycle"
        summary={result.cycle1}
        active={true}
      />
      <CycleBlock
        title="2ème Cycle"
        summary={result.cycle2}
        active={result.cycle2.interpretation !== "-"}
      />
      <div className="rounded-xl border border-foreground/10 bg-card p-4">
        <p className="text-xs font-medium text-foreground/60">
          Besoin en Fonds de Roulement (BFR)
        </p>
        <p
          className={`mt-1 text-xl font-bold tabular-nums ${result.bfr >= 0 ? "text-positive" : "text-negative"}`}
        >
          {fmtEur.format(result.bfr)}
        </p>
      </div>
    </div>
  );
}
