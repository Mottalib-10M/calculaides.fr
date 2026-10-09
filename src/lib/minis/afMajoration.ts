import { allocationsFamiliales } from '../engine/famille';
import { P } from '../engine/params';
import { T, eur, moisAnnee, moisOptions, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'À quel âge la majoration de votre enfant ?', 'When does your child’s supplement start?'),
  cta: T(l, 'Simulateur des allocations familiales', 'Family allowance calculator'),
  inputs: [
    { id: 'm', label: T(l, 'Mois de naissance', 'Month of birth'), def: 4, options: moisOptions(l) },
    { id: 'a', label: T(l, 'Année de naissance', 'Year of birth'), def: 2012, max: 2026 },
    { id: 'r', label: T(l, 'Revenu net catégoriel 2024 (famille de 3 enfants)', '2024 net income (three-child family)'), def: 60000, unit: '€', max: 500000 },
  ],
  run: ({ m, a, r }: Record<string, number>) => {
    const mois = Math.min(12, Math.max(1, m || 1)), an = a || 2012;
    const iso = `${an}-${String(mois).padStart(2, '0')}-01`;
    const age = iso < P.af.bascule_majoration ? P.af.age_majoration_ancien : P.af.age_majoration_nouveau;
    const debutAn = mois === 12 ? an + age + 1 : an + age, debutMois = mois === 12 ? 1 : mois + 1;
    const maj = allocationsFamiliales({ enfants: 3, majorables: 1, revenus: r }).majorations;
    const duree = (P.af.age_limite - age) * 12;
    return { head: [T(l, 'Majoration par mois', 'Supplement per month'), eur(maj, l, 2)],
      rows: [[T(l, 'Âge qui ouvre la majoration', 'Age that opens the supplement'), T(l, `${age} ans`, `${age}`)], [T(l, 'Premier mois de droit (estimé)', 'First month of entitlement (estimate)'), moisAnnee(`${debutAn}-${String(debutMois).padStart(2, '0')}`, l)], [T(l, 'Durée jusqu’aux 20 ans', 'Duration until age 20'), T(l, `environ ${duree} mois`, `about ${duree} months`)], [T(l, 'Cumul estimé', 'Estimated total'), eur(maj * duree, l)]] as [string, string][],
      note: T(l, 'Le montant suit la tranche de revenus d’une famille de trois enfants. Pour l’aîné d’une famille de deux enfants, pas de majoration.', 'The amount follows the income band of a three-child family. No supplement for the elder child of a two-child family.') };
  },
});
