import { ars } from '../engine/famille';
import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
/** Plafond de rémunération d'un enfant à charge apprenti : 55 % du Smic pour 169 heures (fiche F16947). */
const plafondApprenti = () => Math.round(P.smic.horaire_brut * 169 * 0.55 * 100) / 100;
export default (l: L) => ({
  title: T(l, 'ARS d’un jeune de 16 à 18 ans', 'Allowance for a teenager aged 16 to 18'),
  cta: T(l, 'Simulateur ARS complet', 'Full back-to-school allowance calculator'),
  inputs: [
    { id: 's', label: T(l, 'Situation à la rentrée', 'Situation at the start of the school year'), def: 0, options: [T(l, 'Lycéen ou inscrit au Cned', 'Secondary pupil or Cned enrolment'), T(l, 'Apprenti', 'Apprentice'), T(l, 'Sans formation', 'Not in education or training')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'p', label: T(l, 'Salaire net mensuel du jeune', 'Teenager’s monthly net pay'), def: 900, unit: '€', max: 5000 },
    { id: 'r', label: T(l, 'Revenu net catégoriel 2024 du foyer', 'Household net taxable income for 2024'), def: 26000, unit: '€', max: 300000 },
  ],
  run: ({ s, p, r }: Record<string, number>) => {
    const pl = plafondApprenti();
    const exclu = s === 2 || (s === 1 && p > pl);
    const x = ars({ c6_10: 0, c11_14: 0, c15_18: exclu ? 0 : 1, enfants: 1, revenus: r });
    return {
      head: [T(l, 'ARS estimée pour ce jeune', 'Estimated allowance for this teenager'), eur(x.total, l, 2)] as [string, string],
      rows: [
        [T(l, 'Plafond de salaire d’un apprenti', 'Apprentice pay ceiling'), T(l, `${eur(pl, l, 2)} net par mois`, `${eur(pl, l, 2)} net a month`)],
        [T(l, 'Plafond de ressources du foyer (1 enfant)', 'Household income ceiling (1 child)'), eur(x.plafond, l)],
        [T(l, 'Démarche', 'What to do'), s === 2 ? T(l, 'aucune ARS sans scolarité', 'no allowance without schooling') : T(l, 'déclarer la situation sur le site de la CAF', 'declare the situation on the CAF website')],
      ] as [string, string][],
      note: T(l, 'Foyer d’un seul enfant à charge. Le plafond de salaire est celui de la fiche F16947 de service-public (55 % du Smic).', 'Household with one dependent child. The pay ceiling is the one in service-public sheet F16947 (55% of the minimum wage).'),
    };
  },
});
