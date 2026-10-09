import { apl } from '../engine/logement';
import { P } from '../engine/params';
import { T, eur, pct, num, type L } from './_kit';
/** Zone 1 : loyer réel souvent très au-dessus du plafond, dégressivité propre à la zone. */
export default (l: L) => ({
  title: T(l, 'Votre loyer en zone 1 face au plafond', 'Your zone 1 rent against the ceiling'),
  cta: T(l, 'Simulateur APL complet', 'Full housing aid calculator'),
  inputs: [
    { id: 'l', label: T(l, 'Loyer réel hors charges', 'Actual rent excluding charges'), def: 1250, unit: '€', max: 4000 },
    { id: 'c', label: T(l, 'Foyer', 'Household'), def: 0, options: [T(l, 'Personne seule', 'Single person'), T(l, 'Couple sans enfant', 'Couple, no children'), T(l, '1 enfant à charge', '1 dependent child'), T(l, '2 enfants à charge', '2 dependent children'), T(l, '3 enfants à charge', '3 dependent children')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'r', label: T(l, 'Revenus nets imposables sur 12 mois', 'Taxable net income over 12 months'), def: 10000, unit: '€', max: 100000 },
  ],
  run: ({ l: loyer, c, r: rev }: Record<string, number>) => {
    const couple = c === 1, enfants = Math.max(0, (c || 0) - 1);
    const x = apl({ zone: 1, couple, enfants, loyer, revenusAnnuels: rev });
    const [kd, ks] = P.apl.degressivite['1'];
    return {
      head: [T(l, 'APL estimée par mois', 'Estimated aid per month'), eur(x.aide, l)] as [string, string],
      rows: [
        [T(l, 'Loyer plafond zone 1', 'Zone 1 rent ceiling'), eur(x.plafond, l)],
        [T(l, `Baisse au-delà de (${num(kd, l, 1)} × plafond)`, `Taper starts above (${num(kd, l, 1)} × ceiling)`), eur(x.plafond * kd, l)],
        [T(l, `Aide nulle à partir de (${num(ks, l, 0)} × plafond)`, `Aid stops from (${num(ks, l, 0)} × ceiling)`), eur(x.plafond * ks, l)],
        [T(l, 'Réduction pour loyer élevé', 'High-rent reduction'), pct(x.degressivite, l, 0)],
      ] as [string, string][],
      note: T(l, 'Estimation au barème du 1er octobre 2026 ; seule la CAF calcule le droit.', 'Estimate on the 1 October 2026 scale; only the CAF sets the entitlement.'),
    };
  },
});
