import { prepare, type PrepareMode } from '../engine/famille';
import { T, eur, type L } from './_kit';
/** Quotité de travail conservée : 0 = arrêt total, jusqu'à 50 % = taux « mi-temps », de 50 à 80 % = taux partiel (fiche F32485). */
export default (l: L) => ({
  title: T(l, 'PreParE selon votre temps de travail', 'PreParE by working time'),
  cta: T(l, 'Simulateur PreParE complet', 'Full parental leave benefit calculator'),
  inputs: [
    { id: 'q', label: T(l, 'Temps de travail conservé', 'Working time kept'), def: 60, unit: '%', max: 100 },
    { id: 'e', label: T(l, 'Enfants à charge', 'Dependent children'), def: 2, options: [1, 2, 3].map((x) => ({ value: String(x), label: x === 3 ? T(l, '3 ou plus', '3 or more') : String(x) })) },
  ],
  run: ({ q, e }: Record<string, number>) => {
    const quot = Math.max(0, Math.min(100, q || 0));
    const mode: PrepareMode | null = quot === 0 ? 'plein' : quot <= 50 ? 'mi-temps' : quot <= 80 ? 'partiel' : null;
    const r = mode ? prepare({ mode, enfants: e || 2, couple: true }) : { mensuel: 0, dureeMois: 0, total: 0 };
    const plein = prepare({ mode: 'plein', enfants: e || 2, couple: true });
    const tranche = mode === 'plein' ? T(l, 'arrêt total', 'full stop') : mode === 'mi-temps' ? T(l, '50 % ou moins', '50% or less') : mode === 'partiel' ? T(l, 'de 50 à 80 %', '50 to 80%') : T(l, 'au-delà de 80 % : pas de PreParE', 'over 80%: no PreParE');
    return {
      head: [T(l, 'PreParE par mois', 'PreParE per month'), eur(r.mensuel, l, 2)] as [string, string],
      rows: [
        [T(l, 'Tranche', 'Band'), tranche],
        [T(l, 'Durée maximale par parent (couple)', 'Maximum length per parent (couple)'), T(l, `${r.dureeMois} mois`, `${r.dureeMois} months`)],
        [T(l, 'Total sur la durée', 'Total over the period'), eur(r.total, l)],
        [T(l, 'Écart avec l’arrêt total, par mois', 'Gap with a full stop, per month'), eur(plein.mensuel - r.mensuel, l, 2)],
      ] as [string, string][],
      note: T(l, 'Durée avant déduction des mois d’indemnités postnatales. Estimation, la CAF calcule le droit.', 'Length before deducting months of post-natal benefit. Estimate only; the CAF decides.'),
    };
  },
});
