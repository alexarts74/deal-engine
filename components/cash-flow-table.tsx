"use client";

import { useState } from "react";
import type { CashFlowRow } from "@/lib/types";

const fmtEur = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

function colorClass(value: number) {
  if (value > 0) return "text-positive";
  if (value < 0) return "text-negative";
  return "";
}

const VISIBLE_ROWS = 3;

export function CashFlowTable({
  rows,
  title,
}: {
  rows: CashFlowRow[];
  title: string;
}) {
  const [expanded, setExpanded] = useState(false);

  if (rows.length === 0) return null;

  // Compute cumulative balance
  let cumul = 0;
  const rowsWithCumul = rows.map((r) => {
    cumul += r.balance;
    return { ...r, cumul };
  });

  const needsCollapse = rows.length > VISIBLE_ROWS * 2;
  const visibleRows =
    !expanded && needsCollapse
      ? [
          ...rowsWithCumul.slice(0, VISIBLE_ROWS),
          ...rowsWithCumul.slice(-VISIBLE_ROWS),
        ]
      : rowsWithCumul;

  const hiddenCount = rows.length - VISIBLE_ROWS * 2;

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between border-b border-border px-5 py-3 text-left"
      >
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
        <svg
          className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card">
            <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
              <th className="px-5 py-2">Mois</th>
              <th className="px-5 py-2 text-right">Cash Out</th>
              <th className="px-5 py-2 text-right">Cash In</th>
              <th className="px-5 py-2 text-right">Balance</th>
              <th className="px-5 py-2 text-right">Cumul</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((r, i) => (
              <tr
                key={r.mois}
                className={`border-b border-foreground/5 tabular-nums ${i % 2 === 1 ? "bg-muted/30" : ""}`}
              >
                <td className="px-5 py-1.5">{r.mois}</td>
                <td className="px-5 py-1.5 text-right text-negative">
                  {fmtEur.format(r.cashOut)}
                </td>
                <td className="px-5 py-1.5 text-right text-positive">
                  {fmtEur.format(r.cashIn)}
                </td>
                <td
                  className={`px-5 py-1.5 text-right font-medium ${colorClass(r.balance)}`}
                >
                  {fmtEur.format(r.balance)}
                </td>
                <td
                  className={`px-5 py-1.5 text-right font-medium ${colorClass(r.cumul)}`}
                >
                  {fmtEur.format(r.cumul)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {needsCollapse && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full border-t border-border px-5 py-2 text-center text-xs font-medium text-accent hover:bg-muted/50 transition-colors"
        >
          {expanded
            ? "Réduire"
            : `Afficher tout (${hiddenCount} lignes masquées)`}
        </button>
      )}
    </div>
  );
}
