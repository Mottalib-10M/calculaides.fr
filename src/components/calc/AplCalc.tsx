/** Simulateur APL / ALF / ALS en location. Moteur : lib/engine/logement.ts (barème du 1er octobre 2026). */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { apl, seuilSortieApl, type Zone, type Logement } from '../../lib/engine/logement';
import { formatPercent } from '../../lib/format';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { Shell, Row2, Head, Rows, Note, MethodLink, yesNo, disclaimer, eur, type L } from './kit';

const TX = {
  fr: { zone: 'Zone du logement', z1: 'Zone 1 : Paris et petite couronne', z2: 'Zone 2 : grandes agglomérations', z3: 'Zone 3 : reste du territoire', foyer: 'Vous vivez', seul: 'Seul', couple: 'Couple', enfants: 'Personnes à charge', type: 'Type de logement', location: 'Location (logement entier)', colocation: 'Colocation', chambre: 'Chambre, foyer, résidence', loyer: 'Loyer mensuel hors charges', loyerHelp: 'En colocation, votre part du loyer.', rev: 'Revenus nets imposables des 12 derniers mois', revHelp: 'Foyer entier : salaires, chômage, pensions.', etu: 'Étudiant', bourse: 'Boursier', head: 'Aide au logement estimée par mois', none: 'Pas d’aide versée avec ces données', plafond: 'Loyer plafond retenu', charges: 'Forfait charges', part: 'Participation personnelle', ress: 'Ressources retenues sur l’année', forfait: '(forfait étudiant)', taux: 'Taux de participation', degr: 'Réduction pour loyer élevé', sortie: 'L’aide s’arrête vers', an: 'par an de revenus' },
  en: { zone: 'Housing zone', z1: 'Zone 1: Paris and inner suburbs', z2: 'Zone 2: large cities', z3: 'Zone 3: rest of France', foyer: 'You live', seul: 'Alone', couple: 'Couple', enfants: 'Dependants', type: 'Type of housing', location: 'Rental (whole home)', colocation: 'Flat-share', chambre: 'Room, hostel, residence', loyer: 'Monthly rent excluding charges', loyerHelp: 'In a flat-share, your share of the rent.', rev: 'Taxable net income over the last 12 months', revHelp: 'Whole household: wages, unemployment, pensions.', etu: 'Student', bourse: 'Grant holder', head: 'Estimated housing aid per month', none: 'No aid paid with these figures', plafond: 'Rent ceiling used', charges: 'Flat-rate service charges', part: 'Your own contribution', ress: 'Annual resources used', forfait: '(student flat rate)', taux: 'Contribution rate', degr: 'Reduction for high rent', sortie: 'Aid stops at about', an: 'a year of income' },
};
const LOGEMENTS: Logement[] = ['location', 'colocation', 'chambre'];

export default function AplCalc({ lang = 'fr', methodHref, initial }: { lang?: L; methodHref?: string; initial?: { zone?: Zone; couple?: boolean; enfants?: number; loyer?: number; revenus?: number; etudiant?: boolean; logement?: Logement } }) {
  const t = TX[lang]; const $ = (x: number) => eur(x, lang);
  const I = initial ?? {};
  const [zone, setZone] = useState<Zone>(I.zone ?? 2);
  const [couple, setCouple] = useState(I.couple ? '1' : '0');
  const [enfants, setEnfants] = useState(I.enfants ?? 0);
  const [logement, setLogement] = useState<Logement>(I.logement ?? 'location');
  const [loyer, setLoyer] = useState(I.loyer ?? 520);
  const [rev, setRev] = useState(I.revenus ?? 14000);
  const [etu, setEtu] = useState(I.etudiant ? '1' : '0');
  const [bourse, setBourse] = useState('0');
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return;
    const z = num(u, 'z', 2); setZone((z === 1 || z === 3 ? z : 2) as Zone); setCouple(str(u, 'c', '0')); setEnfants(num(u, 'e', 0));
    const lg = str(u, 'lg', 'location'); setLogement((LOGEMENTS.includes(lg as Logement) ? lg : 'location') as Logement);
    setLoyer(num(u, 'l', 520)); setRev(num(u, 'r', 14000)); setEtu(str(u, 'et', '0')); setBourse(str(u, 'b', '0')); }, []);
  useEffect(() => { updateURL({ z: zone, c: couple, e: enfants, lg: logement, l: loyer, r: rev, et: etu, b: bourse }); }, [zone, couple, enfants, logement, loyer, rev, etu, bourse]);
  const base = { zone, couple: couple === '1', enfants, loyer, logement, etudiant: etu === '1', boursier: bourse === '1' };
  const r = useMemo(() => apl({ ...base, revenusAnnuels: rev }), [zone, couple, enfants, loyer, logement, rev, etu, bourse]);
  const sortie = useMemo(() => seuilSortieApl(base), [zone, couple, enfants, loyer, logement, etu, bourse]);
  return (
    <Shell id="apl" form={<>
      <SelectField id="apl-z" label={t.zone} value={String(zone)} onChange={(x) => setZone(Number(x) as Zone)} options={[1, 2, 3].map((z) => ({ value: String(z), label: t[`z${z}` as 'z1'] }))} />
      <Row2>
        <Toggle id="apl-c" label={t.foyer} value={couple} onChange={setCouple} options={[{ value: '0', label: t.seul }, { value: '1', label: t.couple }]} />
        <NumberField id="apl-e" label={t.enfants} value={enfants} onChange={setEnfants} max={10} lang={lang} />
      </Row2>
      <SelectField id="apl-t" label={t.type} value={logement} onChange={(x) => setLogement(x as Logement)} options={LOGEMENTS.map((x) => ({ value: x, label: t[x] }))} />
      <Row2>
        <NumberField id="apl-l" label={t.loyer} value={loyer} onChange={setLoyer} unit="€" max={5000} help={t.loyerHelp} lang={lang} />
        <NumberField id="apl-r" label={t.rev} value={rev} onChange={setRev} unit="€" max={500000} help={t.revHelp} lang={lang} />
      </Row2>
      <Row2>
        <Toggle id="apl-et" label={t.etu} value={etu} onChange={setEtu} options={yesNo(lang)} />
        {etu === '1' && <Toggle id="apl-b" label={t.bourse} value={bourse} onChange={setBourse} options={yesNo(lang)} />}
      </Row2>
    </>} result={<>
      <Head label={t.head} value={$(r.aide)} sub={r.aide === 0 ? t.none : undefined} />
      <Rows rows={[
        [t.plafond, `${$(r.loyerRetenu)} / ${$(r.plafond)}`],
        [t.charges, $(r.charges)],
        [t.part, `− ${$(r.pp)}`],
        [`${t.ress} ${r.forfaitEtudiant ? t.forfait : ''}`.trim(), $(r.r)],
        [t.taux, formatPercent(r.tp, 2, lang)],
        ...(r.degressivite > 0 ? [[t.degr, formatPercent(r.degressivite, 0, lang)] as [string, string]] : []),
        [t.sortie, `${$(sortie)} ${t.an}`],
      ]} />
      <Note>{disclaimer(lang)}</Note>
      <MethodLink href={methodHref} lang={lang} />
    </>} />
  );
}
