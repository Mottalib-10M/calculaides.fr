import { apl, type Zone } from '../engine/logement';
import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Votre APL d’étudiant en deux saisies', 'Your student housing aid in two inputs'),
  cta: T(l, 'Simulateur APL complet', 'Full housing aid calculator'),
  inputs: [
    { id: 'z', label: T(l, 'Ville', 'City'), def: 1, options: [T(l, 'Paris, petite couronne (zone 1)', 'Paris area (zone 1)'), T(l, 'Grande ville (zone 2)', 'Large city (zone 2)'), T(l, 'Autre commune (zone 3)', 'Elsewhere (zone 3)')].map((x, i) => ({ value: String(i + 1), label: x })) },
    { id: 'l', label: T(l, 'Loyer hors charges', 'Rent excluding charges'), def: 450, unit: '€', max: 3000 },
    { id: 'b', label: T(l, 'Boursier', 'Grant holder'), def: 0, options: [T(l, 'Non', 'No'), T(l, 'Oui', 'Yes')].map((x, i) => ({ value: String(i), label: x })) },
  ],
  run: ({ z, l: loyer, b }: Record<string, number>) => {
    const r = apl({ zone: (z || 2) as Zone, couple: false, enfants: 0, loyer, revenusAnnuels: 0, etudiant: true, boursier: b === 1 });
    return { head: [T(l, 'APL estimée par mois', 'Estimated aid per month'), eur(r.aide, l)],
      rows: [[T(l, 'Loyer plafond de la zone', 'Zone rent ceiling'), eur(r.plafond, l)], [T(l, 'Ressources forfaitaires retenues', 'Flat-rate resources used'), eur(r.r, l)], [T(l, 'Participation laissée à votre charge', 'Contribution left for you to pay'), eur(r.pp, l)]] as [string, string][],
      note: T(l, `Étudiant seul, sans revenu déclaré : ressources comptées au moins ${eur(P.apl.etudiant_forfait_ressources, l)} par an, ${eur(P.apl.etudiant_forfait_ressources - P.apl.etudiant_minoration_boursier, l)} pour un boursier.`, `Single student with no declared income: resources counted at no less than ${eur(P.apl.etudiant_forfait_ressources, l)} a year, ${eur(P.apl.etudiant_forfait_ressources - P.apl.etudiant_minoration_boursier, l)} for a grant holder.`) };
  },
});
