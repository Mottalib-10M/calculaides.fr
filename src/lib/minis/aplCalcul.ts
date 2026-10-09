import { apl, type Zone } from '../engine/logement';
import { P } from '../engine/params';
import { T, eur, pct, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'La formule APL appliquée à vos chiffres', 'The housing aid formula on your own figures'),
  cta: T(l, 'Simulateur APL complet', 'Full housing aid calculator'),
  inputs: [
    { id: 'z', label: T(l, 'Zone du logement', 'Housing zone'), def: 2, options: [1, 2, 3].map((z) => ({ value: String(z), label: T(l, `Zone ${z}`, `Zone ${z}`) })) },
    { id: 'l', label: T(l, 'Loyer hors charges', 'Rent excluding charges'), def: 400, unit: '€', max: 3000 },
    { id: 'r', label: T(l, 'Revenus nets imposables sur 12 mois', 'Taxable net income over 12 months'), def: 12000, unit: '€', max: 100000 },
  ],
  run: ({ z, l: loyer, r: rev }: Record<string, number>) => {
    const x = apl({ zone: (z || 2) as Zone, couple: false, enfants: 0, loyer, revenusAnnuels: rev });
    return {
      head: [T(l, 'APL estimée par mois', 'Estimated aid per month'), eur(x.aide, l)],
      rows: [
        [T(l, 'L : loyer retenu', 'L: rent taken into account'), eur(x.loyerRetenu, l, 2)],
        [T(l, 'C : forfait charges', 'C: service-charge allowance'), eur(x.charges, l, 2)],
        [T(l, 'Pp : participation personnelle', 'Pp: own contribution'), eur(x.pp, l, 2)],
        [T(l, 'Tp : taux de participation', 'Tp: contribution rate'), pct(x.tp, l, 2)],
      ] as [string, string][],
      note: T(l, `Personne seule sans enfant ; aide = L + C − Pp − minoration forfaitaire, non versée sous ${eur(P.apl.seuil_versement, l)}.`, `Single person, no children; aid = L + C − Pp − flat deduction, not paid below ${eur(P.apl.seuil_versement, l)}.`),
    };
  },
});
