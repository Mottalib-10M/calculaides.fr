/** Simulateur de prime d'activité. Moteur : lib/engine/minima.ts (montants du 1er avril 2026). */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import Toggle from '../ui/Toggle';
import { primeActivite, seuilSortiePrime } from '../../lib/engine/minima';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { Shell, Row2, Head, Rows, Note, MethodLink, yesNo, disclaimer, eur, type L } from './kit';

const TX = {
  fr: { foyer: 'Vous vivez', seul: 'Seul', couple: 'Couple', enfants: 'Enfants à charge', r1: 'Votre salaire net mensuel', r2: 'Salaire net du conjoint', rHelp: 'Moyenne des trois derniers mois.', autres: 'Autres ressources par mois', autresHelp: 'Allocations familiales, chômage, pension, pension alimentaire.', al: 'Aide au logement ou logé gratuitement', iso: 'Parent isolé (montant majoré)', head: 'Prime d’activité estimée par mois', none: 'Pas de prime avec ces données', mf: 'Montant forfaitaire du foyer', part: 'Part des revenus d’activité', bonif: 'Bonifications individuelles', ress: 'Ressources comptées', fl: 'dont forfait logement', sortie: 'La prime s’arrête vers', sortieU: 'de salaire', trim: 'Sur le trimestre' },
  en: { foyer: 'You live', seul: 'Alone', couple: 'Couple', enfants: 'Dependent children', r1: 'Your net monthly pay', r2: 'Partner’s net monthly pay', rHelp: 'Average of the last three months.', autres: 'Other monthly income', autresHelp: 'Family allowances, unemployment, pension, maintenance.', al: 'Housing aid or free housing', iso: 'Lone parent (higher rate)', head: 'Estimated activity bonus per month', none: 'No bonus with these figures', mf: 'Household flat-rate amount', part: 'Share of earnings added', bonif: 'Individual top-ups', ress: 'Resources counted', fl: 'of which housing flat rate', sortie: 'The bonus stops at about', sortieU: 'of pay', trim: 'Over the quarter' },
};

export default function PaCalc({ lang = 'fr', methodHref, initial }: { lang?: L; methodHref?: string; initial?: { couple?: boolean; enfants?: number; revenu1?: number; revenu2?: number } }) {
  const t = TX[lang]; const $ = (x: number) => eur(x, lang);
  const I = initial ?? {};
  const [couple, setCouple] = useState(I.couple ? '1' : '0');
  const [enfants, setEnfants] = useState(I.enfants ?? 0);
  const [r1, setR1] = useState(I.revenu1 ?? 1400);
  const [r2, setR2] = useState(I.revenu2 ?? 0);
  const [autres, setAutres] = useState(0);
  const [al, setAl] = useState('0');
  const [iso, setIso] = useState('0');
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return;
    setCouple(str(u, 'c', '0')); setEnfants(num(u, 'e', 0)); setR1(num(u, 'r1', 1400)); setR2(num(u, 'r2', 0)); setAutres(num(u, 'a', 0)); setAl(str(u, 'al', '0')); setIso(str(u, 'i', '0')); }, []);
  useEffect(() => { updateURL({ c: couple, e: enfants, r1, r2, a: autres, al, i: iso }); }, [couple, enfants, r1, r2, autres, al, iso]);
  const inp = { couple: couple === '1', enfants, revenu2: r2, autres, forfaitLogement: al === '1', isoleMajore: iso === '1' };
  const r = useMemo(() => primeActivite({ ...inp, revenu1: r1 }), [couple, enfants, r1, r2, autres, al, iso]);
  const sortie = useMemo(() => seuilSortiePrime(inp), [couple, enfants, r2, autres, al, iso]);
  return (
    <Shell id="pa" form={<>
      <Row2>
        <Toggle id="pa-c" label={t.foyer} value={couple} onChange={setCouple} options={[{ value: '0', label: t.seul }, { value: '1', label: t.couple }]} />
        <NumberField id="pa-e" label={t.enfants} value={enfants} onChange={setEnfants} max={10} lang={lang} />
      </Row2>
      <Row2>
        <NumberField id="pa-r1" label={t.r1} value={r1} onChange={setR1} unit="€" max={20000} help={t.rHelp} lang={lang} />
        {couple === '1' ? <NumberField id="pa-r2" label={t.r2} value={r2} onChange={setR2} unit="€" max={20000} lang={lang} />
          : <Toggle id="pa-i" label={t.iso} value={iso} onChange={setIso} options={yesNo(lang)} />}
      </Row2>
      <Row2>
        <NumberField id="pa-a" label={t.autres} value={autres} onChange={setAutres} unit="€" max={20000} help={t.autresHelp} lang={lang} />
        <Toggle id="pa-al" label={t.al} value={al} onChange={setAl} options={yesNo(lang)} />
      </Row2>
    </>} result={<>
      <Head label={t.head} value={$(r.prime)} sub={r.prime === 0 ? t.none : `${t.trim} : ${$(r.prime * 3)}`} />
      <Rows rows={[
        [t.mf, $(r.forfaitaire)],
        [t.part, `+ ${$(r.partRevenus)}`],
        [t.bonif, `+ ${$(r.bonif)}`],
        [t.ress, `− ${$(Math.max(r.ressources, r.forfaitaire))}`],
        ...(r.fl > 0 ? [[t.fl, $(r.fl)] as [string, string]] : []),
        [t.sortie, `${$(sortie)} ${t.sortieU}`],
      ]} />
      <Note>{disclaimer(lang)}</Note>
      <MethodLink href={methodHref} lang={lang} />
    </>} />
  );
}
