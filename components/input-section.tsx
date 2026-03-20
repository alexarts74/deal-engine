"use client";

import type { SupplierInputs, ClientCycleInputs } from "@/lib/types";

function NumberField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-foreground/70">{label}</span>
      <input
        type="number"
        step="any"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="rounded-lg border border-foreground/10 bg-background px-3 py-2 text-sm tabular-nums outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40"
      />
    </label>
  );
}

function Card({
  title,
  children,
  dimmed,
}: {
  title: string;
  children: React.ReactNode;
  dimmed?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-foreground/10 bg-card p-5 transition-opacity ${dimmed ? "opacity-50" : ""}`}
    >
      <h3 className="mb-4 text-base font-semibold">{title}</h3>
      <div className="grid gap-3">{children}</div>
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
      <Card title="Fournisseur (Financement)">
        <NumberField
          label="Durée (mois)"
          value={supplier.dureeMois}
          onChange={(v) => onSupplierChange({ ...supplier, dureeMois: v })}
        />
        <NumberField
          label="1er Loyer HT"
          value={supplier.premierLoyerHT}
          onChange={(v) => onSupplierChange({ ...supplier, premierLoyerHT: v })}
        />
        <NumberField
          label="Mensualité HT"
          value={supplier.mensualiteHT}
          onChange={(v) => onSupplierChange({ ...supplier, mensualiteHT: v })}
        />
        <NumberField
          label="Valeur Résiduelle (VR)"
          value={supplier.vr}
          onChange={(v) => onSupplierChange({ ...supplier, vr: v })}
        />
      </Card>

      <Card title="Client — 1er Cycle">
        <NumberField
          label="Durée (mois)"
          value={client1.dureeMois}
          onChange={(v) => onClient1Change({ ...client1, dureeMois: v })}
        />
        <NumberField
          label="Loyer Fi HT"
          value={client1.loyerFiHT}
          onChange={(v) => onClient1Change({ ...client1, loyerFiHT: v })}
        />
        <NumberField
          label="Entretien mensuel HT"
          value={client1.entretienMensuelHT}
          onChange={(v) =>
            onClient1Change({ ...client1, entretienMensuelHT: v })
          }
        />
        <NumberField
          label="Valeur de revente (VO)"
          value={client1.vo}
          onChange={(v) => onClient1Change({ ...client1, vo: v })}
        />
      </Card>

      <Card title="Client — 2ème Cycle" dimmed={disabled2}>
        <NumberField
          label="Durée (mois) — 0 pour désactiver"
          value={client2.dureeMois}
          onChange={(v) => onClient2Change({ ...client2, dureeMois: v })}
        />
        <NumberField
          label="Loyer Fi HT"
          value={client2.loyerFiHT}
          onChange={(v) => onClient2Change({ ...client2, loyerFiHT: v })}
          disabled={disabled2}
        />
        <NumberField
          label="Entretien mensuel HT"
          value={client2.entretienMensuelHT}
          onChange={(v) =>
            onClient2Change({ ...client2, entretienMensuelHT: v })
          }
          disabled={disabled2}
        />
        <NumberField
          label="Valeur de revente (VO)"
          value={client2.vo}
          onChange={(v) => onClient2Change({ ...client2, vo: v })}
          disabled={disabled2}
        />
      </Card>
    </div>
  );
}
