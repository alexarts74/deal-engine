import type {
  SimulationInputs,
  SimulationResult,
  CashFlowRow,
  CycleSummary,
} from "./types";

function buildCashFlow(
  supplier: SimulationInputs["supplier"],
  client: SimulationInputs["client1"],
): CashFlowRow[] {
  const totalMonths = client.dureeMois;
  if (totalMonths <= 0) return [];

  const rows: CashFlowRow[] = [];

  for (let m = 1; m <= totalMonths; m++) {
    let cashOut = 0;
    let cashIn = 0;

    // Cash Out: supplier payments (stop at supplier duration or client duration)
    if (m === 1) {
      cashOut = supplier.premierLoyerHT;
    } else if (m <= supplier.dureeMois) {
      cashOut = supplier.mensualiteHT;
    }
    // VR paid at end of supplier contract or end of client lease (whichever is first)
    if (m === Math.min(supplier.dureeMois, totalMonths)) {
      cashOut += supplier.vr;
    }

    // Cash In: client payments
    cashIn = client.loyerFiHT + client.entretienMensuelHT;
    if (m === client.dureeMois) {
      cashIn += client.vo;
    }

    rows.push({ mois: m, cashOut, cashIn, balance: cashIn - cashOut });
  }

  return rows;
}

function sumExpenses(expenses: SimulationInputs["expenses"], filter: (mois: number) => boolean): number {
  return expenses
    .filter((e) => filter(e.mois))
    .reduce((sum, e) => sum + e.cout, 0);
}

export function calculateDeal(inputs: SimulationInputs): SimulationResult {
  const { supplier, client1, client2, expenses } = inputs;

  // 1st cycle cash flow
  const cashFlow1 = buildCashFlow(supplier, client1);
  const cashOut1 = cashFlow1.reduce((s, r) => s + r.cashOut, 0);
  const cashIn1 = cashFlow1.reduce((s, r) => s + r.cashIn, 0);
  const depenses1 = sumExpenses(expenses, (m) => m <= client1.dureeMois);
  const beneficeBrut1 = cashIn1 - cashOut1;

  const cycle1: CycleSummary = {
    cashOut: cashOut1,
    cashIn: cashIn1,
    beneficeBrut: beneficeBrut1,
    interpretation:
      beneficeBrut1 < 0
        ? "Augmenter valeur client ou deuxième cycle de location"
        : "Deal gagnant",
    beneficeNet: beneficeBrut1 - depenses1,
    depensesTotal: depenses1,
  };

  // 2nd cycle
  let cycle2: CycleSummary;
  let cashFlow2: CashFlowRow[] = [];

  if (client2.dureeMois > 0) {
    // Cycle 2: no supplier payments (already settled in cycle 1)
    const zeroSupplier = { ...supplier, premierLoyerHT: 0, mensualiteHT: 0, vr: 0, dureeMois: 0 };
    cashFlow2 = buildCashFlow(zeroSupplier, client2);
    const cashOut2 = 0;
    const cashIn2 =
      client2.dureeMois * (client2.loyerFiHT + client2.entretienMensuelHT) +
      client2.vo;
    const depenses2Total = sumExpenses(expenses, (m) => m > client1.dureeMois);
    const beneficeBrut2 = cashIn2 - cashOut2;

    cycle2 = {
      cashOut: cashOut2,
      cashIn: cashIn2,
      beneficeBrut: beneficeBrut2,
      interpretation: beneficeBrut2 < 0 ? "Deal à perte" : "Deal gagnant",
      beneficeNet: beneficeBrut2 - depenses2Total,
      depensesTotal: depenses2Total,
    };
  } else {
    cycle2 = {
      cashOut: 0,
      cashIn: 0,
      beneficeBrut: 0,
      interpretation: "-",
      beneficeNet: 0,
      depensesTotal: 0,
    };
  }

  // BFR: sum of monthly balances excluding the resale month, minus expenses
  const bfrCycle1 = cashFlow1
    .filter((r) => r.mois < client1.dureeMois)
    .reduce((s, r) => s + r.balance, 0);

  const bfrCycle2 =
    client2.dureeMois > 0
      ? cashFlow2
          .filter((r) => r.mois < client2.dureeMois)
          .reduce((s, r) => s + r.balance, 0)
      : 0;

  const totalExpenses = depenses1 + (client2.dureeMois > 0
    ? sumExpenses(expenses, (m) => m > client1.dureeMois)
    : 0);

  const bfr = bfrCycle1 + bfrCycle2 - totalExpenses;

  return { cycle1, cycle2, cashFlow1, cashFlow2, bfr };
}
