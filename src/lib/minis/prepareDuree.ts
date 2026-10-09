import { prepare } from '../engine/famille';
import { T, eur, type L } from './_kit';
/** Durée par parent : la fiche F32485 réduit les 24 mois (couple, 2 enfants et plus) du nombre de mois d'indemnités postnatales. */
export default (l: L) => ({
  title: T(l, 'Combien de mois de PreParE ?', 'How many months of PreParE?'),
  cta: T(l, 'Simulateur PreParE complet', 'Full parental leave benefit calculator'),
  inputs: [
    { id: 'e', label: T(l, 'Enfants à charge', 'Dependent children'), def: 2, options: [1, 2, 3].map((x) => ({ value: String(x), label: x === 3 ? T(l, '3 ou plus', '3 or more') : String(x) })) },
    { id: 'c', label: T(l, 'Situation', 'Household'), def: 1, options: [T(l, 'Parent isolé', 'Single parent'), T(l, 'En couple', 'Couple')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'p', label: T(l, 'Mois d’indemnités postnatales', 'Months of post-natal benefit'), def: 3, max: 12 },
  ],
  run: ({ e, c, p }: Record<string, number>) => {
    const enfants = e || 2, couple = c === 1;
    const r = prepare({ mode: 'plein', enfants, couple });
    const reduit = couple && enfants >= 2 ? Math.max(0, r.dureeMois - Math.max(0, Math.floor(p || 0))) : r.dureeMois;
    return {
      head: [T(l, 'Durée maximale pour ce parent', 'Maximum length for this parent'), T(l, `${reduit} mois`, `${reduit} months`)] as [string, string],
      rows: [
        [T(l, 'Limite d’âge de l’enfant', 'Child’s age limit'), r.limite === '1' ? T(l, '1er anniversaire', 'first birthday') : T(l, '3e anniversaire du plus jeune', 'youngest child’s third birthday')],
        [T(l, 'Montant à taux plein', 'Full-rate amount'), eur(r.mensuel, l, 2)],
        [T(l, 'Total à taux plein sur la durée', 'Full-rate total over the period'), eur(r.mensuel * reduit, l)],
      ] as [string, string][],
      note: couple ? T(l, 'Durée par parent ; chacun a la sienne, dans la limite d’âge de l’enfant.', 'Length per parent; each has their own, within the child’s age limit.') : T(l, 'Parent isolé : droit jusqu’à la limite d’âge, soit au plus 12 ou 36 mois.', 'Single parent: entitlement up to the age limit, at most 12 or 36 months.'),
    };
  },
});
