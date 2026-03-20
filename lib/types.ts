export interface SupplierInputs {
  dureeMois: number;
  premierLoyerHT: number;
  mensualiteHT: number;
  vr: number;
}

export interface ClientCycleInputs {
  dureeMois: number;
  loyerFiHT: number;
  entretienMensuelHT: number;
  vo: number;
}

export interface Expense {
  id: string;
  evenement: string;
  cout: number;
  mois: number;
}

export interface SimulationInputs {
  supplier: SupplierInputs;
  client1: ClientCycleInputs;
  client2: ClientCycleInputs;
  expenses: Expense[];
}

export interface CashFlowRow {
  mois: number;
  cashOut: number;
  cashIn: number;
  balance: number;
}

export interface CycleSummary {
  cashOut: number;
  cashIn: number;
  beneficeBrut: number;
  interpretation: string;
  beneficeNet: number;
  depensesTotal: number;
}

export interface SimulationResult {
  cycle1: CycleSummary;
  cycle2: CycleSummary;
  cashFlow1: CashFlowRow[];
  cashFlow2: CashFlowRow[];
  bfr: number;
}
