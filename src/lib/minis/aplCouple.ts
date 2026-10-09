import { apl, seuilSortieApl, type Zone } from '../engine/logement';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'L’APL de votre couple', 'Your couple’s housing aid'),
  cta: T(l, 'Simulateur APL complet', 'Full housing aid calculator'),
  inputs: [
    { id: 'r', label: T(l, 'Revenus nets imposables du couple sur 12 mois', 'Couple’s taxable net income over 12 months'), def: 14000, unit: '€', max: 150000 },
    { id: 'lo', label: T(l, 'Loyer hors charges', 'Rent excluding charges'), def: 650, unit: '€', max: 4000 },
    { id: 'z', label: T(l, 'Zone du logement', 'Housing zone'), def: 2, options: ['1', '2', '3'].map((v) => ({ value: v, label: T(l, `Zone ${v}`, `Zone ${v}`) })) },
  ],
  run: ({ r, lo, z }: Record<string, number>) => {
    const base = { zone: (z || 2) as Zone, couple: true, enfants: 0, loyer: lo };
    const a = apl({ ...base, revenusAnnuels: r });
    return { head: [T(l, 'APL estimée du couple', 'Estimated couple aid'), eur(a.aide, l)],
      rows: [[T(l, 'Loyer plafond couple', 'Couple rent ceiling'), eur(a.plafond, l, 2)], [T(l, 'Participation du couple', 'Couple’s own contribution'), eur(a.pp, l)], [T(l, 'Revenus annuels où l’aide s’arrête', 'Yearly income where aid stops'), eur(seuilSortieApl(base), l)]] as [string, string][],
      note: T(l, 'Couple sans enfant : marié, pacsé ou concubin, mêmes règles.', 'Couple without children: married, Pacs or cohabiting, same rules.') };
  },
});
