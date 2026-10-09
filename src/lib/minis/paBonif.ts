import { bonification, bonificationMax, primeActivite, seuilBonification, plafondBonification } from '../engine/minima';
import { T, eur, pct, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Votre bonification individuelle', 'Your individual top-up'),
  cta: T(l, 'Simulateur de prime d’activité complet', 'Full activity bonus calculator'),
  inputs: [{ id: 's', label: T(l, 'Revenu professionnel net par mois', 'Net monthly earnings'), def: 1100, unit: '€', max: 5000 }],
  run: ({ s }: Record<string, number>) => {
    const b = bonification(s);
    const pos = s <= seuilBonification() ? T(l, 'sous le seuil d’entrée', 'below the entry point') : s >= plafondBonification() ? T(l, 'au plafond', 'at the ceiling') : T(l, 'dans la zone de montée', 'on the rising slope');
    return { head: [T(l, 'Bonification par mois', 'Top-up per month'), eur(b, l, 2)],
      rows: [[T(l, 'Part du maximum atteinte', 'Share of the maximum reached'), pct(b / bonificationMax(), l, 0)], [T(l, 'Position', 'Position'), pos], [T(l, 'Prime totale, personne seule', 'Total bonus, single person'), eur(primeActivite({ couple: false, enfants: 0, revenu1: s }).prime, l)]] as [string, string][],
      note: T(l, `Due au-dessus de ${eur(seuilBonification(), l, 2)}, maximale à ${eur(bonificationMax(), l, 2)} dès ${eur(plafondBonification(), l, 2)}.`, `Paid above ${eur(seuilBonification(), l, 2)}, capped at ${eur(bonificationMax(), l, 2)} from ${eur(plafondBonification(), l, 2)}.`) };
  },
});
