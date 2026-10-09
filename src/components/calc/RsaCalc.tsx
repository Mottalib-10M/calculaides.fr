/** Simulateur RSA, avec la prime d'activité du même foyer en regard. Moteur : lib/engine/minima.ts. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import Toggle from '../ui/Toggle';
import { rsa, primeActivite } from '../../lib/engine/minima';
import { allocationsFamiliales } from '../../lib/engine/famille';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { Shell, Row2, Head, Rows, Note, MethodLink, yesNo, disclaimer, eur, type L } from './kit';

const TX = {
  fr: { foyer: 'Vous vivez', seul: 'Seul', couple: 'Couple', enfants: 'Enfants à charge', rev: 'Revenus d’activité du foyer par mois', revHelp: 'Salaires nets, comptés en entier pour le RSA.', autres: 'Autres ressources par mois', autresHelp: 'Chômage, pensions, pension alimentaire (hors allocations familiales).', al: 'Aide au logement ou logé gratuitement', iso: 'Parent isolé (montant majoré)', head: 'RSA estimé par mois', none: 'Pas de RSA avec ces données', mf: 'Montant forfaitaire', af: 'Allocations familiales déduites', ress: 'Revenus et autres ressources', fl: 'Forfait logement', pa: 'Prime d’activité du même foyer', total: 'RSA + prime d’activité' },
  en: { foyer: 'You live', seul: 'Alone', couple: 'Couple', enfants: 'Dependent children', rev: 'Household earnings per month', revHelp: 'Net pay, counted in full for the RSA.', autres: 'Other monthly income', autresHelp: 'Unemployment, pensions, maintenance (not family allowances).', al: 'Housing aid or free housing', iso: 'Lone parent (higher rate)', head: 'Estimated RSA per month', none: 'No RSA with these figures', mf: 'Flat-rate amount', af: 'Family allowances deducted', ress: 'Earnings and other income', fl: 'Housing flat rate', pa: 'Activity bonus, same household', total: 'RSA + activity bonus' },
};

export default function RsaCalc({ lang = 'fr', methodHref, initial }: { lang?: L; methodHref?: string; initial?: { couple?: boolean; enfants?: number; revenus?: number; al?: boolean } }) {
  const t = TX[lang]; const $ = (x: number) => eur(x, lang);
  const I = initial ?? {};
  const [couple, setCouple] = useState(I.couple ? '1' : '0');
  const [enfants, setEnfants] = useState(I.enfants ?? 0);
  const [rev, setRev] = useState(I.revenus ?? 0);
  const [autres, setAutres] = useState(0);
  const [al, setAl] = useState(I.al === false ? '0' : '1');
  const [iso, setIso] = useState('0');
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return;
    setCouple(str(u, 'c', '0')); setEnfants(num(u, 'e', 0)); setRev(num(u, 'r', 0)); setAutres(num(u, 'a', 0)); setAl(str(u, 'al', '1')); setIso(str(u, 'i', '0')); }, []);
  useEffect(() => { updateURL({ c: couple, e: enfants, r: rev, a: autres, al, i: iso }); }, [couple, enfants, rev, autres, al, iso]);
  const af = useMemo(() => allocationsFamiliales({ enfants, majorables: 0, revenus: 0 }).total, [enfants]);
  const r = useMemo(() => rsa({ couple: couple === '1', enfants, revenus: rev, autres: autres + af, forfaitLogement: al === '1', isoleMajore: iso === '1' }), [couple, enfants, rev, autres, af, al, iso]);
  const pa = useMemo(() => primeActivite({ couple: couple === '1', enfants, revenu1: rev, autres: autres + af + r.rsa, forfaitLogement: al === '1', isoleMajore: iso === '1' }), [couple, enfants, rev, autres, af, al, iso, r.rsa]);
  return (
    <Shell id="rsa" form={<>
      <Row2>
        <Toggle id="rsa-c" label={t.foyer} value={couple} onChange={setCouple} options={[{ value: '0', label: t.seul }, { value: '1', label: t.couple }]} />
        <NumberField id="rsa-e" label={t.enfants} value={enfants} onChange={setEnfants} max={10} lang={lang} />
      </Row2>
      <Row2>
        <NumberField id="rsa-r" label={t.rev} value={rev} onChange={setRev} unit="€" max={20000} help={t.revHelp} lang={lang} />
        <NumberField id="rsa-a" label={t.autres} value={autres} onChange={setAutres} unit="€" max={20000} help={t.autresHelp} lang={lang} />
      </Row2>
      <Row2>
        <Toggle id="rsa-al" label={t.al} value={al} onChange={setAl} options={yesNo(lang)} />
        {couple === '0' && <Toggle id="rsa-i" label={t.iso} value={iso} onChange={setIso} options={yesNo(lang)} />}
      </Row2>
    </>} result={<>
      <Head label={t.head} value={$(r.rsa)} sub={r.rsa === 0 ? t.none : undefined} />
      <Rows rows={[
        [t.mf, $(r.forfaitaire)],
        [t.ress, `− ${$(rev + autres)}`],
        ...(af > 0 ? [[t.af, `− ${$(af)}`] as [string, string]] : []),
        ...(r.fl > 0 ? [[t.fl, `− ${$(r.fl)}`] as [string, string]] : []),
        [t.pa, $(pa.prime)],
        [t.total, $(r.rsa + pa.prime), true],
      ]} />
      <Note>{disclaimer(lang)}</Note>
      <MethodLink href={methodHref} lang={lang} />
    </>} />
  );
}
