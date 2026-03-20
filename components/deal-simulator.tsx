"use client";

import { useState, useMemo } from "react";
import type { SimulationInputs, Expense } from "@/lib/types";
import { calculateDeal } from "@/lib/deal-calculator";
import { InputSection } from "./input-section";
import { ExpenseTracker } from "./expense-tracker";
import { CashFlowTable } from "./cash-flow-table";
import { SummaryPanel } from "./summary-panel";

const fmtEur = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

const defaultInputs: SimulationInputs = {
  supplier: {
    dureeMois: 48,
    premierLoyerHT: 2218.09,
    mensualiteHT: 274.55,
    vr: 739.36,
  },
  client1: {
    dureeMois: 48,
    loyerFiHT: 307.5,
    entretienMensuelHT: 0,
    vo: 13145,
  },
  client2: {
    dureeMois: 0,
    loyerFiHT: 460,
    entretienMensuelHT: 65,
    vo: 18500,
  },
  expenses: [],
};

export function DealSimulator() {
  const [supplier, setSupplier] = useState(defaultInputs.supplier);
  const [client1, setClient1] = useState(defaultInputs.client1);
  const [client2, setClient2] = useState(defaultInputs.client2);
  const [expenses, setExpenses] = useState<Expense[]>(defaultInputs.expenses);

  const result = useMemo(
    () => calculateDeal({ supplier, client1, client2, expenses }),
    [supplier, client1, client2, expenses],
  );

  const netBenefit = result.cycle1.beneficeNet;
  const netColor = netBenefit >= 0 ? "text-positive" : "text-negative";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Branded header */}
      <header className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-lg font-bold text-white">
          E
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Deal Engine
          </h1>
          <p className="text-sm text-muted-foreground">
            Simulateur de rentabilité de deals de location
          </p>
        </div>
      </header>

      {/* Mobile compact summary */}
      <div className="mb-6 rounded-xl border border-border bg-card p-4 shadow-sm lg:hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Bénéfice Net — 1er Cycle
          </span>
          <span className={`text-xl font-bold tabular-nums ${netColor}`}>
            {fmtEur.format(netBenefit)}
          </span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        {/* Left column: inputs */}
        <div className="grid gap-6 self-start">
          <InputSection
            supplier={supplier}
            client1={client1}
            client2={client2}
            onSupplierChange={setSupplier}
            onClient1Change={setClient1}
            onClient2Change={setClient2}
          />
          <ExpenseTracker expenses={expenses} onChange={setExpenses} />
        </div>

        {/* Right column: results — sticky on desktop */}
        <div className="grid gap-6 self-start lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
          <SummaryPanel result={result} />
          <CashFlowTable rows={result.cashFlow1} title="Cash Flow — 1er Cycle" />
          {result.cashFlow2.length > 0 && (
            <CashFlowTable
              rows={result.cashFlow2}
              title="Cash Flow — 2ème Cycle"
            />
          )}
        </div>
      </div>
    </div>
  );
}
