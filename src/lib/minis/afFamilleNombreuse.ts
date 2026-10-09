import { allocationsFamiliales, baseAf } from '../engine/famille';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Famille de quatre enfants et plus', 'Families of four children or more'),
  cta: T(l, 'Simulateur des allocations familiales', 'Family allowance calculator'),
  inputs: [
    { id: 'e', label: T(l, 'Enfants de moins de 20 ans', 'Children under 20'), def: 4, options: [4, 5, 6, 7, 8].map((x) => ({ value: String(x), label: String(x) })) },
    { id: 'r', label: T(l, 'Revenu net catégoriel 2024 du foyer', 'Household 2024 net income (revenu net catégoriel)'), def: 70000, unit: '€', max: 500000 },
  ],
  run: ({ e, r }: Record<string, number>) => {
    const n = e || 4;
    const a = allocationsFamiliales({ enfants: n, majorables: 0, revenus: r });
    return { head: [T(l, `Allocations familiales, ${n} enfants`, `Family allowance, ${n} children`), eur(a.total, l, 2)],
      rows: [[T(l, 'Plafond du montant plein', 'Full-rate income ceiling'), eur(a.plafonds[0], l)], [T(l, 'Plafond de la 2e tranche', '2nd band ceiling'), eur(a.plafonds[1], l)], [T(l, 'Ajout par enfant au-delà du 3e', 'Added per child beyond the third'), eur(baseAf(4, a.tranche) - baseAf(3, a.tranche), l, 2)], [T(l, 'Sur douze mois', 'Over twelve months'), eur(a.total * 12, l)]] as [string, string][],
      note: T(l, 'Hors majorations pour âge et forfait des 20 ans, que le simulateur complet ajoute.', 'Before age supplements and the age-20 flat payment, which the full calculator adds.') };
  },
});
