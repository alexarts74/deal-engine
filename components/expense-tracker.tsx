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

  function updateExpense(id: string, field: keyof Expense, value: string | number) {
    onChange(
      expenses.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    );
  }

  return (
    <div className="rounded-xl border border-foreground/10 bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold">Dépenses</h3>
        <button
          onClick={addExpense}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Ajouter
        </button>
      </div>

      {expenses.length === 0 && (
        <p className="text-sm text-foreground/50">Aucune dépense ajoutée.</p>
      )}

      <div className="grid gap-2">
        {expenses.map((exp) => (
          <div
            key={exp.id}
            className="flex items-end gap-2 rounded-lg border border-foreground/5 bg-background p-3"
          >
            <label className="flex flex-1 flex-col gap-1">
              <span className="text-xs text-foreground/60">Événement</span>
              <input
                type="text"
                value={exp.evenement}
                onChange={(e) =>
                  updateExpense(exp.id, "evenement", e.target.value)
                }
                className="rounded border border-foreground/10 bg-background px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Pneus"
              />
            </label>
            <label className="flex w-28 flex-col gap-1">
              <span className="text-xs text-foreground/60">Coût (€)</span>
              <input
                type="number"
                step="any"
                value={exp.cout}
                onChange={(e) =>
                  updateExpense(exp.id, "cout", parseFloat(e.target.value) || 0)
                }
                className="rounded border border-foreground/10 bg-background px-2 py-1.5 text-sm tabular-nums outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <label className="flex w-20 flex-col gap-1">
              <span className="text-xs text-foreground/60">Mois</span>
              <input
                type="number"
                value={exp.mois}
                onChange={(e) =>
                  updateExpense(exp.id, "mois", parseInt(e.target.value) || 1)
                }
                className="rounded border border-foreground/10 bg-background px-2 py-1.5 text-sm tabular-nums outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <button
              onClick={() => removeExpense(exp.id)}
              className="rounded-lg px-2 py-1.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
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
