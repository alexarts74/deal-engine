"use client";

import type { SupplierInputs, ClientCycleInputs } from "@/lib/types";

function NumberField({
  label,
  value,
  onChange,
  disabled,
  suffix,
  prefix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  suffix?: string;
  prefix?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {prefix}
          </span>
        )}
        <input
          type="number"
          step="any"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={`w-full rounded-lg border border-border bg-background py-2 text-sm tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:ring-2 focus:ring-accent disabled:opacity-40 ${prefix ? "pl-8 pr-3" : "px-3"} ${suffix ? "pr-16" : ""}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

function Card({
  title,
  children,
  dimmed,
  variant,
}: {
  title: string;
  children: React.ReactNode;
  dimmed?: boolean;
  variant?: "outflow" | "inflow";
}) {
  const borderLeft =
    variant === "outflow"
      ? "border-l-4 border-l-negative"
      : variant === "inflow"
        ? "border-l-4 border-l-positive"
        : "";

  return (
    <div
      className={`rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md ${borderLeft} ${dimmed ? "opacity-50" : ""}`}
    >
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

export function InputSection({
  supplier,
  client1,
  client2,
  onSupplierChange,
  onClient1Change,
  onClient2Change,
}: {
  supplier: SupplierInputs;
  client1: ClientCycleInputs;
  client2: ClientCycleInputs;
  onSupplierChange: (s: SupplierInputs) => void;
  onClient1Change: (c: ClientCycleInputs) => void;
  onClient2Change: (c: ClientCycleInputs) => void;
}) {
  const disabled2 = client2.dureeMois === 0;

  return (
    <div className="grid gap-4">
      <Card title="Fournisseur (Financement)" variant="outflow">
        <NumberField
          label="Durée"
          value={supplier.dureeMois}
          onChange={(v) => onSupplierChange({ ...supplier, dureeMois: v })}
          suffix="mois"
        />
        <NumberField
          label="1er Loyer HT"
          value={supplier.premierLoyerHT}
          onChange={(v) =>
            onSupplierChange({ ...supplier, premierLoyerHT: v })
          }
          suffix="€ HT"
        />
        <NumberField
          label="Mensualité HT"
          value={supplier.mensualiteHT}
          onChange={(v) => onSupplierChange({ ...supplier, mensualiteHT: v })}
          suffix="€ HT/mois"
        />
        <NumberField
          label="Valeur Résiduelle (VR)"
          value={supplier.vr}
          onChange={(v) => onSupplierChange({ ...supplier, vr: v })}
          suffix="€ HT"
        />
      </Card>

      <Card title="Client — 1er Cycle" variant="inflow">
        <NumberField
          label="Durée"
          value={client1.dureeMois}
          onChange={(v) => onClient1Change({ ...client1, dureeMois: v })}
          suffix="mois"
        />
        <NumberField
          label="Loyer Fi HT"
          value={client1.loyerFiHT}
          onChange={(v) => onClient1Change({ ...client1, loyerFiHT: v })}
          suffix="€ HT/mois"
        />
        <NumberField
          label="Entretien mensuel HT"
          value={client1.entretienMensuelHT}
          onChange={(v) =>
            onClient1Change({ ...client1, entretienMensuelHT: v })
          }
          suffix="€ HT/mois"
        />
        <NumberField
          label="Valeur de revente (VO)"
          value={client1.vo}
          onChange={(v) => onClient1Change({ ...client1, vo: v })}
          suffix="€ HT"
        />
      </Card>

      <Card title="Client — 2ème Cycle" dimmed={disabled2} variant="inflow">
        <div className="sm:col-span-2">
          <NumberField
            label="Durée — 0 pour désactiver"
            value={client2.dureeMois}
            onChange={(v) => onClient2Change({ ...client2, dureeMois: v })}
            suffix="mois"
          />
        </div>
        <NumberField
          label="Loyer Fi HT"
          value={client2.loyerFiHT}
          onChange={(v) => onClient2Change({ ...client2, loyerFiHT: v })}
          disabled={disabled2}
          suffix="€ HT/mois"
        />
        <NumberField
          label="Entretien mensuel HT"
          value={client2.entretienMensuelHT}
          onChange={(v) =>
            onClient2Change({ ...client2, entretienMensuelHT: v })
          }
          disabled={disabled2}
          suffix="€ HT/mois"
        />
        <NumberField
          label="Valeur de revente (VO)"
          value={client2.vo}
          onChange={(v) => onClient2Change({ ...client2, vo: v })}
          disabled={disabled2}
          suffix="€ HT"
        />
      </Card>
    </div>
  );
}
