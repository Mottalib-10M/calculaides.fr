import { primeActivite, seuilSortiePrime } from '../engine/minima';
import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Votre prime d’activité quand vous vivez seul', 'Your activity bonus as a single person'),
  cta: T(l, 'Simulateur de prime d’activité complet', 'Full activity bonus calculator'),
  inputs: [
    { id: 's', label: T(l, 'Salaire net moyen par mois', 'Average net monthly pay'), def: 1200, unit: '€', max: 4000 },
    { id: 'g', label: T(l, 'Logement', 'Housing'), def: 0, options: [T(l, 'Locataire sans aide au logement', 'Tenant, no housing aid'), T(l, 'APL ou hébergé gratuitement', 'Housing aid or housed for free')].map((x, i) => ({ value: String(i), label: x })) },
  ],
  run: ({ s, g }: Record<string, number>) => {
    const fl = g === 1;
    const r = primeActivite({ couple: false, enfants: 0, revenu1: s, forfaitLogement: fl });
    return { head: [T(l, 'Prime estimée par mois', 'Estimated bonus per month'), eur(r.prime, l)],
      rows: [[T(l, 'Montant forfaitaire d’une personne seule', 'Single-person flat-rate amount'), eur(r.forfaitaire, l, 2)], [T(l, 'Bonification individuelle', 'Individual top-up'), eur(r.bonif, l, 2)], [T(l, 'La prime s’arrête vers', 'The bonus stops at about'), eur(seuilSortiePrime({ couple: false, enfants: 0, forfaitLogement: fl }), l)]] as [string, string][],
      note: T(l, `Personne seule sans enfant ni autre ressource. Sous ${eur(P.pa.minimum_verse, l)}, rien n’est versé.`, `Single person, no children and no other income. Below ${eur(P.pa.minimum_verse, l)}, nothing is paid.`) };
  },
});
