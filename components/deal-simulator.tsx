"use client";

import { useState, useMemo } from "react";
import type { SimulationInputs, Expense } from "@/lib/types";
import { calculateDeal } from "@/lib/deal-calculator";
import { InputSection } from "./input-section";
import { ExpenseTracker } from "./expense-tracker";
import { CashFlowTable } from "./cash-flow-table";
import { SummaryPanel } from "./summary-panel";

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

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Evera Deal Engine
        </h1>
        <p className="mt-1 text-sm text-foreground/60">
          Simulateur de rentabilité de deals de location
        </p>
      </header>

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

        {/* Right column: results */}
        <div className="grid gap-6 self-start">
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
