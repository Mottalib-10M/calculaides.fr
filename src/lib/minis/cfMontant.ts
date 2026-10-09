import { complementFamilial } from '../engine/famille';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Complément familial : base ou majoré ?', 'Family supplement: base or higher rate?'),
  cta: T(l, 'Simulateur des allocations familiales', 'Family allowance calculator'),
  inputs: [
    { id: 'n', label: T(l, 'Enfants de 3 à moins de 21 ans', 'Children aged 3 to under 21'), def: 3, options: [3, 4, 5, 6].map((x) => ({ value: String(x), label: String(x) })) },
    { id: 's', label: T(l, 'Situation', 'Situation'), def: 0, options: [T(l, 'Couple, un revenu', 'Couple, one income'), T(l, 'Couple, deux revenus', 'Couple, two incomes'), T(l, 'Parent isolé', 'Single parent')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'r', label: T(l, 'Revenu net catégoriel 2024', '2024 net income (revenu net catégoriel)'), def: 35000, unit: '€', max: 300000 },
  ],
  run: ({ n, s, r }: Record<string, number>) => {
    const c = complementFamilial({ enfants3a21: n || 3, deuxRevenus: s > 0, revenus: r });
    return { head: [T(l, 'Complément familial par mois', 'Family supplement per month'), eur(c.cf, l, 2)],
      rows: [[T(l, 'Plafond du montant majoré', 'Higher-rate ceiling'), eur(c.plafondMajore, l)], [T(l, 'Plafond du montant de base', 'Base-rate ceiling'), eur(c.plafond, l)], [T(l, 'Sur douze mois', 'Over twelve months'), eur(c.cf * 12, l)]] as [string, string][],
      note: T(l, 'Un parent isolé a les plafonds d’un couple à deux revenus. Il faut au moins trois enfants âgés de 3 ans et plus.', 'A single parent gets the two-income couple ceilings. At least three children aged 3 or over are required.') };
  },
});
