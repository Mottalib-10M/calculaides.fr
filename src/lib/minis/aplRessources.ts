import { apl, type Zone } from '../engine/logement';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Vos ressources vues par la CAF', 'Your income as the CAF sees it'),
  cta: T(l, 'Simulateur APL complet', 'Full housing aid calculator'),
  inputs: [
    { id: 'r', label: T(l, 'Revenus nets imposables des 12 derniers mois', 'Taxable net income, last 12 months'), def: 14000, unit: '€', max: 100000 },
    { id: 'z', label: T(l, 'Zone du logement', 'Housing zone'), def: 1, options: [1, 2, 3].map((z) => ({ value: String(z), label: `Zone ${z}` })) },
  ],
  run: ({ r: rev, z }: Record<string, number>) => {
    const base = { zone: (z || 1) as Zone, couple: false, enfants: 0, loyer: 500 };
    const a = apl({ ...base, revenusAnnuels: rev });
    const b = apl({ ...base, revenusAnnuels: rev + 1000 });
    return {
      head: [T(l, 'Ressources retenues R', 'Income counted (R)'), eur(a.r, l)],
      rows: [
        [T(l, 'APL estimée par mois', 'Estimated aid per month'), eur(a.aide, l)],
        [T(l, 'Avec 1 000 € de revenus en plus', 'With €1,000 more income'), eur(b.aide, l)],
        [T(l, 'Perte mensuelle', 'Monthly loss'), eur(a.aide - b.aide, l, 2)],
      ] as [string, string][],
      note: T(l, 'Personne seule, loyer de 500 € hors charges. R = revenus moins 10 %, arrondis à la centaine supérieure.', 'Single person, €500 rent excluding charges. R = income minus 10%, rounded up to the next hundred.'),
    };
  },
});
