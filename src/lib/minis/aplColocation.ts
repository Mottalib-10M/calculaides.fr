import { apl, type Zone } from '../engine/logement';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Votre APL de colocataire', 'Your housing aid as a flatmate'),
  cta: T(l, 'Simulateur APL complet', 'Full housing aid calculator'),
  inputs: [
    { id: 'z', label: T(l, 'Zone du logement', 'Housing zone'), def: 2, options: [T(l, 'Zone 1', 'Zone 1'), T(l, 'Zone 2', 'Zone 2'), T(l, 'Zone 3', 'Zone 3')].map((x, i) => ({ value: String(i + 1), label: x })) },
    { id: 'p', label: T(l, 'Votre part de loyer hors charges', 'Your rent share excluding charges'), def: 400, unit: '€', max: 3000 },
    { id: 'r', label: T(l, 'Vos revenus nets imposables sur 12 mois', 'Your taxable net income over 12 months'), def: 9000, unit: '€', max: 100000 },
  ],
  run: ({ z, p, r }: Record<string, number>) => {
    const base = { zone: (z || 2) as Zone, couple: false, enfants: 0, loyer: p, revenusAnnuels: r };
    const c = apl({ ...base, logement: 'colocation' });
    const s = apl(base);
    return { head: [T(l, 'APL estimée en colocation', 'Estimated flat-share aid'), eur(c.aide, l)],
      rows: [[T(l, 'Plafond de colocation retenu', 'Flat-share ceiling used'), eur(c.plafond, l, 2)], [T(l, 'Forfait charges colocataire', 'Flatmate charges allowance'), eur(c.charges, l, 2)], [T(l, 'Même loyer dans un logement loué seul', 'Same rent, home rented alone'), eur(s.aide, l)]] as [string, string][],
      note: T(l, 'Colocataire seul, sur sa propre part : les revenus des autres occupants ne comptent pas.', 'Single flatmate, on their own share: other occupants’ income does not count.') };
  },
});
