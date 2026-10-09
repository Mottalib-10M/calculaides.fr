import { aah } from '../engine/aah';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'AAH en couple depuis la déconjugalisation', 'AAH in a couple since individualisation'),
  cta: T(l, 'Simulateur AAH complet', 'Full AAH calculator'),
  inputs: [
    { id: 's', label: T(l, 'Votre salaire net mensuel', 'Your net monthly pay'), def: 0, unit: '€', max: 4000 },
    { id: 'c', label: T(l, 'Revenus mensuels du conjoint', 'Partner’s monthly income'), def: 2500, unit: '€', max: 10000 },
  ],
  run: ({ s }: Record<string, number>) => {
    const x = aah({ salaire: s });
    return { head: [T(l, 'AAH estimée par mois', 'Estimated AAH per month'), eur(x.aah, l, 2)],
      rows: [[T(l, 'Revenus du conjoint retenus', 'Partner’s income counted'), eur(0, l)], [T(l, 'Vos ressources retenues', 'Your resources counted'), eur(x.ressourcesRetenues, l, 2)]] as [string, string][],
      note: T(l, 'Calcul déconjugalisé. Si l’ancien calcul vous est plus favorable, la CAF le conserve.', 'Individualised calculation. If the old joint calculation suits you better, the CAF keeps it.') };
  },
});
