import { rsa } from '../engine/minima';
import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'RSA d’une personne seule', 'RSA for a single person'),
  cta: T(l, 'Simulateur RSA complet', 'Full RSA calculator'),
  inputs: [
    { id: 'r', label: T(l, 'Ressources du mois (salaire, chômage…)', 'Monthly income (wages, benefits…)'), def: 0, unit: '€', max: 3000 },
    { id: 'g', label: T(l, 'Logement', 'Housing'), def: 1, options: [T(l, 'Loyer payé, sans aide au logement', 'Rent paid, no housing aid'), T(l, 'Aide au logement, hébergé gratuitement ou propriétaire', 'Housing aid, free lodging or owner')].map((x, i) => ({ value: String(i), label: x })) },
  ],
  run: ({ r, g }: Record<string, number>) => {
    const x = rsa({ couple: false, enfants: 0, revenus: r, forfaitLogement: g === 1 });
    return { head: [T(l, 'RSA estimé par mois', 'Estimated RSA per month'), eur(x.rsa, l, 2)],
      rows: [[T(l, 'Montant forfaitaire', 'Flat-rate amount'), eur(x.forfaitaire, l, 2)], [T(l, 'Forfait logement déduit', 'Housing deduction'), eur(x.fl, l, 2)], [T(l, 'Ressources déduites', 'Income deducted'), eur(x.ressources, l, 2)]] as [string, string][],
      note: T(l, `Adulte de 25 ans ou plus, sans enfant. Sous ${eur(P.rsa.minimum_verse, l)}, le RSA n’est pas versé.`, `Adult aged 25 or over, no children. Below ${eur(P.rsa.minimum_verse, l)}, RSA is not paid.`) };
  },
});
