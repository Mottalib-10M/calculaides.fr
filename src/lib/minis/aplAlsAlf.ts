import { apl, type Zone } from '../engine/logement';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'APL, ALF ou ALS : laquelle et combien ?', 'APL, ALF or ALS: which one, and how much?'),
  cta: T(l, 'Simulateur APL complet', 'Full housing aid calculator'),
  inputs: [
    { id: 'c', label: T(l, 'Logement conventionné', 'Approved (conventionné) home'), def: 0, options: [T(l, 'Non ou je ne sais pas', 'No, or not sure'), T(l, 'Oui (souvent un HLM)', 'Yes (often social housing)')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 's', label: T(l, 'Situation', 'Household'), def: 1, options: [T(l, 'Seul, sans enfant', 'Single, no children'), T(l, 'Pacsé ou en concubinage, sans enfant', 'Pacs or cohabiting, no children'), T(l, 'Marié, sans enfant', 'Married, no children'), T(l, 'Avec un enfant à charge', 'With one dependent child')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'r', label: T(l, 'Revenus nets imposables du foyer sur 12 mois', 'Household taxable net income, 12 months'), def: 14000, unit: '€', max: 100000 },
  ],
  run: ({ c, s, r }: Record<string, number>) => {
    const couple = s === 1 || s === 2;
    const enfants = s === 3 ? 1 : 0;
    const x = apl({ zone: 2 as Zone, couple, enfants, loyer: 550, revenusAnnuels: r });
    const nom = c === 1 ? 'APL' : s >= 2 ? 'ALF' : 'ALS';
    return {
      head: [T(l, `Aide versée : ${nom}`, `Aid paid: ${nom}`), eur(x.aide, l)],
      rows: [
        [T(l, 'Même montant sous les deux autres noms', 'Same amount under the other two names'), eur(x.aide, l)],
        [T(l, 'Loyer plafond retenu', 'Rent ceiling used'), eur(x.plafond, l, 2)],
        [T(l, 'Raison du nom', 'Why this name'), c === 1 ? T(l, 'logement conventionné', 'approved home') : s >= 2 ? T(l, 'situation familiale', 'family situation') : T(l, 'ni APL ni ALF', 'neither APL nor ALF')],
      ] as [string, string][],
      note: T(l, 'Exemple en zone 2, loyer de 550 € hors charges. Les trois aides suivent le même barème.', 'Example in zone 2, €550 rent excluding charges. All three follow the same scale.'),
    };
  },
});
