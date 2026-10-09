import { loyerPlafond, type Zone } from '../engine/logement';
import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
/** Loyer plafond, loyer retenu et seuils de dégressivité pour une zone et un foyer. */
export default (l: L) => ({
  title: T(l, 'Votre loyer plafond et vos seuils', 'Your rent ceiling and thresholds'),
  cta: T(l, 'Simulateur APL complet', 'Full housing aid calculator'),
  inputs: [
    { id: 'z', label: T(l, 'Zone', 'Zone'), def: 2, options: ['1', '2', '3'].map((x) => ({ value: x, label: `Zone ${x}` })) },
    { id: 'c', label: T(l, 'Foyer', 'Household'), def: 0, options: [T(l, 'Personne seule', 'Single person'), T(l, 'Couple sans enfant', 'Couple, no children'), T(l, '1 personne à charge', '1 dependant'), T(l, '2 personnes à charge', '2 dependants'), T(l, '3 personnes à charge', '3 dependants'), T(l, '4 personnes à charge', '4 dependants')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'l', label: T(l, 'Loyer réel hors charges', 'Actual rent excluding charges'), def: 600, unit: '€', max: 5000 },
  ],
  run: ({ z, c, l: loyer }: Record<string, number>) => {
    const zone = (z || 2) as Zone;
    const pl = loyerPlafond(zone, c === 1, Math.max(0, (c || 0) - 1));
    const [kd, ks] = P.apl.degressivite[String(zone) as '1' | '2' | '3'];
    const etat = loyer >= pl * ks ? T(l, 'aide supprimée', 'aid removed') : loyer > pl * kd ? T(l, 'aide réduite', 'aid reduced') : loyer > pl ? T(l, 'plafond atteint', 'ceiling reached') : T(l, 'loyer pris en entier', 'rent counted in full');
    return {
      head: [T(l, 'Loyer plafond mensuel', 'Monthly rent ceiling'), eur(pl, l, 2)] as [string, string],
      rows: [
        [T(l, 'Loyer retenu', 'Rent counted'), `${eur(Math.min(loyer, pl), l, 2)} (${etat})`],
        [T(l, 'L’aide baisse au-delà de', 'Aid tapers above'), eur(pl * kd, l)],
        [T(l, 'L’aide est supprimée à partir de', 'Aid removed from'), eur(pl * ks, l)],
      ] as [string, string][],
      note: T(l, 'Logement entier, barème du 1er octobre 2026. Colocation : plafond × 75 % ; chambre : × 90 %.', 'Whole home, scale of 1 October 2026. Flat-share: ceiling × 75%; room: × 90%.'),
    };
  },
});
