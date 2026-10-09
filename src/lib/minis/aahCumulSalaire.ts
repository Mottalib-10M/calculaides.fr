import { aah, seuilSortieAah } from '../engine/aah';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'AAH et salaire : ce qui reste', 'AAH and wages: what remains'),
  cta: T(l, 'Simulateur AAH complet', 'Full AAH calculator'),
  inputs: [{ id: 's', label: T(l, 'Salaire net mensuel (milieu ordinaire)', 'Net monthly pay (mainstream job)'), def: 800, unit: '€', max: 4000 }],
  run: ({ s }: Record<string, number>) => {
    const x = aah({ salaire: s });
    return { head: [T(l, 'AAH estimée', 'Estimated AAH'), eur(x.aah, l, 2)],
      rows: [[T(l, 'Salaire retenu après abattement', 'Pay counted after allowance'), eur(x.salaireRetenu, l, 2)], [T(l, 'Part du salaire ignorée', 'Share of pay ignored'), eur(x.abattement, l, 2)], [T(l, 'Salaire + AAH', 'Pay + AAH'), eur(s + x.aah, l, 2)]] as [string, string][],
      note: T(l, `Sans autre ressource ni enfant, l’AAH s’éteint vers ${eur(seuilSortieAah(0), l)} de salaire net.`, `With no other income and no children, AAH stops at around ${eur(seuilSortieAah(0), l)} of net pay.`) };
  },
});
