"use client";

import type { SimulationResult } from "@/lib/types";

const fmtEur = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

function DealHealthBar({
  cashIn,
  cashOut,
}: {
  cashIn: number;
  cashOut: number;
}) {
  const absCashOut = Math.abs(cashOut);
  const total = cashIn + absCashOut;
  const ratio = total > 0 ? (cashIn / total) * 100 : 0;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Cash Out</span>
        <span>{Math.round(ratio)}% Cash In</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-negative/20">
        <div
          className="h-full rounded-full bg-positive transition-all duration-500 ease-out"
          style={{ width: `${ratio}%` }}
        />
      </div>
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
      <div className="rounded-xl border border-border bg-card p-5 opacity-40 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Cycle désactivé (durée = 0)
        </p>
      </div>
    );
  }

  const netColor = summary.beneficeNet >= 0 ? "text-positive" : "text-negative";
  const isWinning = summary.beneficeBrut >= 0;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>

      {/* Hero metric */}
      <div className="text-center">
        <p className={`text-3xl font-bold tabular-nums ${netColor}`}>
          {fmtEur.format(summary.beneficeNet)}
        </p>
        <p className="text-sm text-muted-foreground">Bénéfice Net</p>
      </div>

      {/* Health bar */}
      <DealHealthBar cashIn={summary.cashIn} cashOut={summary.cashOut} />

      {/* Interpretation badge */}
      <div
        className={`rounded-lg px-4 py-2 text-center text-sm font-medium ${
          isWinning
            ? "bg-positive/10 text-positive"
            : "bg-negative/10 text-negative"
        }`}
      >
        {summary.interpretation}
      </div>

      {/* Compact stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-muted/50 px-2 py-2">
          <p className="text-xs text-muted-foreground">Cash Out</p>
          <p className="text-sm font-semibold tabular-nums text-negative">
            {fmtEur.format(summary.cashOut)}
          </p>
        </div>
        <div className="rounded-lg bg-muted/50 px-2 py-2">
          <p className="text-xs text-muted-foreground">Cash In</p>
          <p className="text-sm font-semibold tabular-nums text-positive">
            {fmtEur.format(summary.cashIn)}
          </p>
        </div>
        <div className="rounded-lg bg-muted/50 px-2 py-2">
          <p className="text-xs text-muted-foreground">Brut</p>
          <p
            className={`text-sm font-semibold tabular-nums ${summary.beneficeBrut >= 0 ? "text-positive" : "text-negative"}`}
          >
            {fmtEur.format(summary.beneficeBrut)}
          </p>
        </div>
      </div>

      {summary.depensesTotal > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Dépenses imputées : {fmtEur.format(summary.depensesTotal)}
        </p>
      )}
    </div>
  );
}

export function SummaryPanel({ result }: { result: SimulationResult }) {
  const cycle2Active = result.cycle2.interpretation !== "-";

  return (
    <div className="grid gap-6">
      <CycleBlock title="1er Cycle" summary={result.cycle1} active={true} />

      {cycle2Active && (
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium text-muted-foreground">
            2ème Cycle
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
      )}

      <CycleBlock
        title="2ème Cycle"
        summary={result.cycle2}
        active={cycle2Active}
      />

      <div className="rounded-xl border border-border bg-muted p-4 shadow-sm">
        <p className="text-xs font-medium text-muted-foreground">
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
