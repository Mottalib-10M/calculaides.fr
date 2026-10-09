import { apl, seuilSortieApl, type Zone } from '../engine/logement';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Salarié seul : votre APL et le salaire qui l’arrête', 'Single employee: your aid and the pay that ends it'),
  cta: T(l, 'Simulateur APL complet', 'Full housing aid calculator'),
  inputs: [
    { id: 's', label: T(l, 'Salaire net imposable sur 12 mois', 'Taxable net pay over 12 months'), def: 15000, unit: '€', max: 60000 },
    { id: 'z', label: T(l, 'Zone du logement', 'Housing zone'), def: 2, options: [1, 2, 3].map((z) => ({ value: String(z), label: `Zone ${z}` })) },
    { id: 'l', label: T(l, 'Loyer hors charges', 'Rent excluding charges'), def: 500, unit: '€', max: 3000 },
  ],
  run: ({ s, z, l: loyer }: Record<string, number>) => {
    const base = { zone: (z || 2) as Zone, couple: false, enfants: 0, loyer };
    const a = apl({ ...base, revenusAnnuels: s });
    const seuil = seuilSortieApl(base);
    return {
      head: [T(l, 'APL estimée par mois', 'Estimated aid per month'), eur(a.aide, l)],
      rows: [
        [T(l, 'Salaire annuel où l’aide s’arrête', 'Yearly pay where aid stops'), eur(seuil, l)],
        [T(l, 'Marge avant l’arrêt', 'Headroom before it stops'), eur(Math.max(0, seuil - s), l)],
        [T(l, 'Loyer retenu (plafond)', 'Rent counted (ceiling)'), eur(a.loyerRetenu, l, 2)],
      ] as [string, string][],
      note: T(l, 'Personne seule, sans enfant, non étudiante. Le net imposable figure sur le bulletin de paie.', 'Single person, no children, not a student. Taxable net pay is shown on your payslip.'),
    };
  },
});
