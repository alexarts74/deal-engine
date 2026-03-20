"use client";

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

export function CashFlowTable({
  rows,
  title,
}: {
  rows: CashFlowRow[];
  title: string;
}) {
  if (rows.length === 0) return null;

  return (
    <div className="rounded-xl border border-foreground/10 bg-card">
      <h3 className="border-b border-foreground/10 px-5 py-3 text-base font-semibold">
        {title}
      </h3>
      <div className="max-h-96 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card">
            <tr className="border-b border-foreground/10 text-left text-xs font-medium text-foreground/60">
              <th className="px-5 py-2">Mois</th>
              <th className="px-5 py-2 text-right">Cash Out</th>
              <th className="px-5 py-2 text-right">Cash In</th>
              <th className="px-5 py-2 text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.mois}
                className="border-b border-foreground/5 tabular-nums"
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
