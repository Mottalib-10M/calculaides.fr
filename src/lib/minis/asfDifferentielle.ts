import { asf } from '../engine/famille';
import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'ASF selon la pension reçue', 'ASF depending on the maintenance received'),
  cta: T(l, 'Simulateur des allocations familiales', 'Family allowance calculator'),
  inputs: [
    { id: 'e', label: T(l, 'Enfants concernés', 'Children concerned'), def: 1, options: [1, 2, 3, 4].map((x) => ({ value: String(x), label: String(x) })) },
    { id: 'p', label: T(l, 'Pension alimentaire reçue par enfant et par mois', 'Maintenance received per child per month'), def: 80, unit: '€', max: 2000 },
  ],
  run: ({ e, p }: Record<string, number>) => {
    const n = e || 1, total = asf(n, p);
    return { head: [T(l, 'ASF par mois', 'ASF per month'), eur(total, l, 2)],
      rows: [[T(l, 'ASF pleine par enfant', 'Full ASF per child'), eur(P.asf.par_enfant, l, 2)], [T(l, 'Versé par enfant', 'Paid per child'), eur(asf(1, p), l, 2)], [T(l, 'Pension + ASF par enfant', 'Maintenance + ASF per child'), eur(asf(1, p) + Math.max(0, p), l, 2)]] as [string, string][],
      note: T(l, 'Parent qui vit seul. L’ASF s’arrête en cas de mise en couple ; la CAF ne verse pas un complément différentiel trop faible.', 'For a parent living alone. ASF stops on moving in with a partner; the CAF does not pay a very small differential top-up.') };
  },
});
