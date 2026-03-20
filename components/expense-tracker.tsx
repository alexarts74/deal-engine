"use client";

import type { Expense } from "@/lib/types";

export function ExpenseTracker({
  expenses,
  onChange,
}: {
  expenses: Expense[];
  onChange: (expenses: Expense[]) => void;
}) {
  function addExpense() {
    onChange([
      ...expenses,
      { id: crypto.randomUUID(), evenement: "", cout: 0, mois: 1 },
    ]);
  }

  function removeExpense(id: string) {
    onChange(expenses.filter((e) => e.id !== id));
  }

  function updateExpense(
    id: string,
    field: keyof Expense,
    value: string | number,
  ) {
    onChange(
      expenses.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Dépenses
        </h3>
        <button
          onClick={addExpense}
          className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-light transition-colors"
        >
          + Ajouter
        </button>
      </div>

      {expenses.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-8 text-muted-foreground">
          <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xl font-semibold">
            +
          </span>
          <p className="text-sm">Aucune dépense ajoutée</p>
          <p className="text-xs">Cliquez sur &quot;Ajouter&quot; pour commencer</p>
        </div>
      )}

      <div className="grid gap-2">
        {expenses.map((exp) => (
          <div
            key={exp.id}
            className="animate-slide-in grid items-end gap-2 rounded-lg border border-border bg-background p-3 sm:grid-cols-[1fr_8rem_5rem_auto]"
          >
            <label className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Événement</span>
              <input
                type="text"
                value={exp.evenement}
                onChange={(e) =>
                  updateExpense(exp.id, "evenement", e.target.value)
                }
                className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-accent"
                placeholder="Ex: Pneus"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Coût (€)</span>
              <input
                type="number"
                step="any"
                value={exp.cout}
                onChange={(e) =>
                  updateExpense(
                    exp.id,
                    "cout",
                    parseFloat(e.target.value) || 0,
                  )
                }
                className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:ring-2 focus:ring-accent"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Mois</span>
              <input
                type="number"
                value={exp.mois}
                onChange={(e) =>
                  updateExpense(
                    exp.id,
                    "mois",
                    parseInt(e.target.value) || 1,
                  )
                }
                className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:ring-2 focus:ring-accent"
              />
            </label>
            <button
              onClick={() => removeExpense(exp.id)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-sm text-negative transition-colors hover:bg-negative/10"
              title="Supprimer"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
