/** Simulateurs des prestations familiales : allocations familiales, ARS, naissance (Paje), PreParE. Moteur : lib/engine/famille.ts. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { allocationsFamiliales, ars, paje, prepare, type PrepareMode } from '../../lib/engine/famille';
import { P } from '../../lib/engine/params';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { Shell, Row2, Head, Rows, Note, MethodLink, yesNo, disclaimer, eur, type L } from './kit';

type Props = { lang?: L; methodHref?: string };
const REV = P.af.revenus_reference;

/* ------------------------------------------------ allocations familiales */
const AF = {
  fr: { enf: 'Enfants de moins de 20 ans', maj: 'Dont nés avant le 1er mars 2012', majHelp: 'Ils ouvrent la majoration (14 ans et plus).', vingt: 'Enfant ayant eu 20 ans cette année', rev: `Revenu net catégoriel ${REV} du foyer`, revHelp: `Avis d’imposition 2025 sur les revenus ${REV}.`, head: 'Allocations familiales par mois', none: 'Pas d’allocations avec un seul enfant', base: 'Montant de base', majs: 'Majorations pour âge', forfait: 'Allocation forfaitaire', compl: 'Complément dégressif', tranche: 'Tranche de revenus', t: ['1re (montant plein)', '2e (moitié)', '3e (quart)'], an: 'Sur un an' },
  en: { enf: 'Children under 20', maj: 'Of whom born before 1 March 2012', majHelp: 'They trigger the age supplement (14 and over).', vingt: 'Child who turned 20 this year', rev: `Household net income ${REV} (revenu net catégoriel)`, revHelp: `From the 2025 tax notice on ${REV} income.`, head: 'Family allowances per month', none: 'No allowance with only one child', base: 'Basic amount', majs: 'Age supplements', forfait: 'Flat-rate allowance', compl: 'Tapering supplement', tranche: 'Income band', t: ['1st (full amount)', '2nd (half)', '3rd (quarter)'], an: 'Over a year' },
};
export function AfCalc({ lang = 'fr', methodHref }: Props) {
  const t = AF[lang]; const $ = (x: number) => eur(x, lang);
  const [enf, setEnf] = useState(2); const [maj, setMaj] = useState(0); const [vingt, setVingt] = useState(0); const [rev, setRev] = useState(45000);
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setEnf(num(u, 'e', 2)); setMaj(num(u, 'm', 0)); setVingt(num(u, 'v', 0)); setRev(num(u, 'r', 45000)); }, []);
  useEffect(() => { updateURL({ e: enf, m: maj, v: vingt, r: rev }); }, [enf, maj, vingt, rev]);
  const r = useMemo(() => allocationsFamiliales({ enfants: enf, majorables: maj, vingtAns: vingt, revenus: rev }), [enf, maj, vingt, rev]);
  return (
    <Shell id="af" form={<>
      <Row2>
        <NumberField id="af-e" label={t.enf} value={enf} onChange={setEnf} max={12} lang={lang} />
        <NumberField id="af-m" label={t.maj} value={maj} onChange={setMaj} max={12} help={t.majHelp} lang={lang} />
      </Row2>
      <Row2>
        <NumberField id="af-r" label={t.rev} value={rev} onChange={setRev} unit="€" max={1000000} help={t.revHelp} lang={lang} />
        <NumberField id="af-v" label={t.vingt} value={vingt} onChange={setVingt} max={5} lang={lang} />
      </Row2>
    </>} result={<>
      <Head label={t.head} value={$(r.total)} sub={enf < 2 ? t.none : `${t.an} : ${$(r.total * 12)}`} />
      <Rows rows={[[t.tranche, t.t[r.tranche]], [t.base, $(r.base)], [t.majs, $(r.majorations)], [t.forfait, $(r.forfait)], [t.compl, $(r.complement)]]} />
      <Note>{disclaimer(lang)}</Note>
      <MethodLink href={methodHref} lang={lang} />
    </>} />
  );
}

/* ------------------------------------------------ allocation de rentrée scolaire */
const ARS = {
  fr: { a: 'Enfants de 6 à 10 ans', b: 'Enfants de 11 à 14 ans', c: 'Enfants de 15 à 18 ans', autres: 'Autres enfants à charge', autresHelp: 'Plus jeunes ou plus âgés : ils relèvent le plafond.', rev: `Revenu net catégoriel ${REV}`, head: 'Allocation de rentrée scolaire 2026', none: 'Pas d’allocation avec ces données', plein: 'Montant plein', plafond: 'Plafond de ressources', diff: 'Versement réduit (allocation différentielle)', oui: 'oui', non: 'non' },
  en: { a: 'Children aged 6 to 10', b: 'Children aged 11 to 14', c: 'Children aged 15 to 18', autres: 'Other dependent children', autresHelp: 'Younger or older: they raise the ceiling.', rev: `Net income ${REV} (revenu net catégoriel)`, head: 'Back-to-school allowance 2026', none: 'No allowance with these figures', plein: 'Full amount', plafond: 'Income ceiling', diff: 'Reduced (differential) payment', oui: 'yes', non: 'no' },
};
export function ArsCalc({ lang = 'fr', methodHref }: Props) {
  const t = ARS[lang]; const $ = (x: number) => eur(x, lang);
  const [a, setA] = useState(1); const [b, setB] = useState(1); const [c, setC] = useState(0); const [autres, setAutres] = useState(0); const [rev, setRev] = useState(30000);
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setA(num(u, 'a', 1)); setB(num(u, 'b', 1)); setC(num(u, 'c', 0)); setAutres(num(u, 'o', 0)); setRev(num(u, 'r', 30000)); }, []);
  useEffect(() => { updateURL({ a, b, c, o: autres, r: rev }); }, [a, b, c, autres, rev]);
  const r = useMemo(() => ars({ c6_10: a, c11_14: b, c15_18: c, enfants: a + b + c + autres, revenus: rev }), [a, b, c, autres, rev]);
  return (
    <Shell id="ars" form={<>
      <Row2>
        <NumberField id="ars-a" label={t.a} value={a} onChange={setA} max={10} lang={lang} />
        <NumberField id="ars-b" label={t.b} value={b} onChange={setB} max={10} lang={lang} />
      </Row2>
      <Row2>
        <NumberField id="ars-c" label={t.c} value={c} onChange={setC} max={10} lang={lang} />
        <NumberField id="ars-o" label={t.autres} value={autres} onChange={setAutres} max={10} help={t.autresHelp} lang={lang} />
      </Row2>
      <Row2><NumberField id="ars-r" label={t.rev} value={rev} onChange={setRev} unit="€" max={1000000} lang={lang} /></Row2>
    </>} result={<>
      <Head label={t.head} value={$(r.total)} sub={r.total === 0 ? t.none : undefined} />
      <Rows rows={[[t.plein, $(r.plein)], [t.plafond, $(r.plafond)], [t.diff, r.differentielle ? t.oui : t.non]]} />
      <Note>{disclaimer(lang)}</Note>
      <MethodLink href={methodHref} lang={lang} />
    </>} />
  );
}

/* ------------------------------------------------ naissance : prime et allocation de base */
const NA = {
  fr: { enf: 'Enfants à charge, bébé compris', deux: 'Deux revenus ou parent isolé', deuxHelp: `Chaque parent a gagné au moins ${P.paje.seuil_deuxieme_revenu} € en ${REV}.`, rev: `Revenu net catégoriel ${REV}`, nes: 'Naissances (jumeaux : 2)', head: 'Prime à la naissance', none: 'Revenus au-dessus du plafond', ab: 'Allocation de base par mois', taux: 'Taux', plein: 'plein', partiel: 'partiel', aucun: 'aucun', plafond: 'Plafond de la prime', plafondPlein: 'Plafond du taux plein', total: 'Allocation de base jusqu’aux 3 ans' },
  en: { enf: 'Dependent children, baby included', deux: 'Two earners or lone parent', deuxHelp: `Each parent earned at least €${P.paje.seuil_deuxieme_revenu} in ${REV}.`, rev: `Net income ${REV} (revenu net catégoriel)`, nes: 'Births (twins: 2)', head: 'Birth grant', none: 'Income above the ceiling', ab: 'Basic allowance per month', taux: 'Rate', plein: 'full', partiel: 'partial', aucun: 'none', plafond: 'Birth-grant ceiling', plafondPlein: 'Full-rate ceiling', total: 'Basic allowance up to age 3' },
};
export function NaissanceCalc({ lang = 'fr', methodHref }: Props) {
  const t = NA[lang]; const $ = (x: number) => eur(x, lang);
  const [enf, setEnf] = useState(1); const [deux, setDeux] = useState('1'); const [rev, setRev] = useState(38000); const [nes, setNes] = useState(1);
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setEnf(num(u, 'e', 1)); setDeux(str(u, 'd', '1')); setRev(num(u, 'r', 38000)); setNes(num(u, 'n', 1)); }, []);
  useEffect(() => { updateURL({ e: enf, d: deux, r: rev, n: nes }); }, [enf, deux, rev, nes]);
  const r = useMemo(() => paje({ enfants: Math.max(1, enf), deuxRevenus: deux === '1', revenus: rev, naissances: nes }), [enf, deux, rev, nes]);
  return (
    <Shell id="naissance" form={<>
      <Row2>
        <NumberField id="na-e" label={t.enf} value={enf} onChange={setEnf} max={12} lang={lang} />
        <Toggle id="na-d" label={t.deux} value={deux} onChange={setDeux} options={yesNo(lang)} />
      </Row2>
      <Row2>
        <NumberField id="na-r" label={t.rev} value={rev} onChange={setRev} unit="€" max={1000000} help={t.deuxHelp} lang={lang} />
        <NumberField id="na-n" label={t.nes} value={nes} onChange={setNes} max={4} lang={lang} />
      </Row2>
    </>} result={<>
      <Head label={t.head} value={$(r.prime)} sub={r.prime === 0 ? t.none : undefined} />
      <Rows rows={[[t.ab, $(r.ab)], [t.taux, t[r.taux]], [t.plafond, $(r.plafond)], [t.plafondPlein, $(r.plafondPlein)], [t.total, $(r.totalAb36), true]]} />
      <Note>{disclaimer(lang)}</Note>
      <MethodLink href={methodHref} lang={lang} />
    </>} />
  );
}

/* ------------------------------------------------ PreParE */
const PR = {
  fr: { mode: 'Votre activité pendant le congé', plein: 'Arrêt total', mi: 'Temps partiel jusqu’à 50 %', part: 'Temps partiel de 50 à 80 %', enf: 'Enfants à charge', foyer: 'Vous vivez', seul: 'Seul', couple: 'Couple', maj: 'PreParE majorée (3 enfants et plus)', head: 'PreParE par mois', duree: 'Durée maximale par parent', mois: 'mois', limite: 'Dans la limite des', ans: 'ans de l’enfant', an: 'an de l’enfant', total: 'Total sur la durée maximale' },
  en: { mode: 'Your work during the leave', plein: 'Full stop', mi: 'Part time up to 50%', part: 'Part time 50 to 80%', enf: 'Dependent children', foyer: 'You live', seul: 'Alone', couple: 'Couple', maj: 'Higher PreParE (3+ children)', head: 'PreParE per month', duree: 'Maximum length per parent', mois: 'months', limite: 'Up to the child’s', ans: 'rd birthday', an: 'st birthday', total: 'Total over the maximum length' },
};
export function PrepareCalc({ lang = 'fr', methodHref }: Props) {
  const t = PR[lang]; const $ = (x: number) => eur(x, lang);
  const [mode, setMode] = useState<PrepareMode>('plein'); const [enf, setEnf] = useState(2); const [couple, setCouple] = useState('1'); const [maj, setMaj] = useState('0');
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; const m = str(u, 'm', 'plein'); setMode((['plein', 'mi-temps', 'partiel'].includes(m) ? m : 'plein') as PrepareMode); setEnf(num(u, 'e', 2)); setCouple(str(u, 'c', '1')); setMaj(str(u, 'mj', '0')); }, []);
  useEffect(() => { updateURL({ m: mode, e: enf, c: couple, mj: maj }); }, [mode, enf, couple, maj]);
  const r = useMemo(() => prepare({ mode, enfants: Math.max(1, enf), couple: couple === '1', majoree: maj === '1' }), [mode, enf, couple, maj]);
  return (
    <Shell id="prepare" form={<>
      <SelectField id="pr-m" label={t.mode} value={mode} onChange={(x) => setMode(x as PrepareMode)} options={[{ value: 'plein', label: t.plein }, { value: 'mi-temps', label: t.mi }, { value: 'partiel', label: t.part }]} />
      <Row2>
        <NumberField id="pr-e" label={t.enf} value={enf} onChange={setEnf} max={12} lang={lang} />
        <Toggle id="pr-c" label={t.foyer} value={couple} onChange={setCouple} options={[{ value: '0', label: t.seul }, { value: '1', label: t.couple }]} />
      </Row2>
      {enf >= 3 && mode === 'plein' && <Row2><Toggle id="pr-mj" label={t.maj} value={maj} onChange={setMaj} options={yesNo(lang)} /></Row2>}
    </>} result={<>
      <Head label={t.head} value={$(r.mensuel)} />
      <Rows rows={[[t.duree, `${r.dureeMois} ${t.mois}`], [t.limite, lang === 'en' ? `${r.limite}${r.limite === '1' ? t.an : t.ans}` : `${r.limite} ${r.limite === '1' ? t.an : t.ans}`], [t.total, $(r.total), true]]} />
      <Note>{disclaimer(lang)}</Note>
      <MethodLink href={methodHref} lang={lang} />
    </>} />
  );
}
