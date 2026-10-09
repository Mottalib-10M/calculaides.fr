import { apl, type Zone } from '../engine/logement';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'L’APL de votre chambre', 'Housing aid for your room'),
  cta: T(l, 'Simulateur APL complet', 'Full housing aid calculator'),
  inputs: [
    { id: 'lo', label: T(l, 'Loyer ou redevance de la chambre', 'Room rent or fee'), def: 380, unit: '€', max: 3000 },
    { id: 'z', label: T(l, 'Zone du logement', 'Housing zone'), def: 2, options: ['1', '2', '3'].map((v) => ({ value: v, label: T(l, `Zone ${v}`, `Zone ${v}`) })) },
    { id: 'r', label: T(l, 'Revenus nets imposables sur 12 mois', 'Taxable net income over 12 months'), def: 6000, unit: '€', max: 100000 },
  ],
  run: ({ lo, z, r }: Record<string, number>) => {
    const base = { zone: (z || 2) as Zone, couple: false, enfants: 0, loyer: lo, revenusAnnuels: r };
    const c = apl({ ...base, logement: 'chambre' });
    const s = apl(base);
    return { head: [T(l, 'APL estimée pour la chambre', 'Estimated aid for the room'), eur(c.aide, l)],
      rows: [[T(l, 'Plafond chambre (90 %)', 'Room ceiling (90%)'), eur(c.plafond, l, 2)], [T(l, 'Plafond d’un logement entier', 'Whole-home ceiling'), eur(s.plafond, l, 2)], [T(l, 'Participation selon vos ressources', 'Income-based contribution'), eur(c.pp, l)]] as [string, string][],
      note: T(l, 'Foyers et résidences conventionnés : calcul officiel propre, notre résultat n’est qu’un ordre de grandeur.', 'Approved hostels and residences have their own official method: this result is only a ballpark.') };
  },
});
