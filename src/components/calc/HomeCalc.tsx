/**
 * « Simulation CAF : toutes mes aides » (accueil). Un seul formulaire, chaque aide calculée par
 * son moteur : aide au logement, RSA, prime d'activité, allocations familiales, ARS. Les revenus
 * de l'année de référence (2024) sont pris égaux à douze fois les revenus mensuels saisis.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { apl, type Zone } from '../../lib/engine/logement';
import { rsa, primeActivite } from '../../lib/engine/minima';
import { allocationsFamiliales, ars } from '../../lib/engine/famille';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { Shell, Row2, Head, Rows, Note, disclaimer, eur, type L } from './kit';

const TX = {
  fr: { foyer: 'Vous vivez', seul: 'Seul', couple: 'Couple', enf: 'Enfants à charge', scol: 'Dont enfants de 6 à 18 ans', rev: 'Salaires nets du foyer par mois', autres: 'Chômage, pensions par mois', loge: 'Logement', loc: 'Locataire', autre: 'Propriétaire ou hébergé', zone: 'Zone', z: ['Zone 1 (Paris)', 'Zone 2 (grandes villes)', 'Zone 3 (ailleurs)'], loyer: 'Loyer hors charges', head: 'Total estimé de vos aides par mois', al: 'Aide au logement', rsa: 'RSA', pa: 'Prime d’activité', af: 'Allocations familiales', ars: 'Rentrée scolaire (une fois en août)', an: 'Sur douze mois, rentrée comprise', hyp: 'Revenus de 2024 supposés égaux à douze fois ces revenus mensuels.' },
  en: { foyer: 'You live', seul: 'Alone', couple: 'Couple', enf: 'Dependent children', scol: 'Of whom aged 6 to 18', rev: 'Household net pay per month', autres: 'Unemployment, pensions per month', loge: 'Housing', loc: 'Tenant', autre: 'Owner or housed', zone: 'Zone', z: ['Zone 1 (Paris)', 'Zone 2 (large cities)', 'Zone 3 (elsewhere)'], loyer: 'Rent excluding charges', head: 'Estimated total of your benefits per month', al: 'Housing aid', rsa: 'RSA', pa: 'Activity bonus', af: 'Family allowances', ars: 'Back-to-school (once, in August)', an: 'Over twelve months, back-to-school included', hyp: '2024 income assumed equal to twelve times these monthly figures.' },
};

export default function HomeCalc({ lang = 'fr' }: { lang?: L }) {
  const t = TX[lang]; const $ = (x: number) => eur(x, lang);
  const [couple, setCouple] = useState('0'); const [enf, setEnf] = useState(1); const [scol, setScol] = useState(1);
  const [rev, setRev] = useState(1300); const [autres, setAutres] = useState(0); const [loc, setLoc] = useState('1');
  const [zone, setZone] = useState<Zone>(2); const [loyer, setLoyer] = useState(550);
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return;
    setCouple(str(u, 'c', '0')); setEnf(num(u, 'e', 1)); setScol(num(u, 's', 1)); setRev(num(u, 'r', 1300)); setAutres(num(u, 'a', 0)); setLoc(str(u, 'lo', '1'));
    const z = num(u, 'z', 2); setZone((z === 1 || z === 3 ? z : 2) as Zone); setLoyer(num(u, 'l', 550)); }, []);
  useEffect(() => { updateURL({ c: couple, e: enf, s: scol, r: rev, a: autres, lo: loc, z: zone, l: loyer }); }, [couple, enf, scol, rev, autres, loc, zone, loyer]);
  const r = useMemo(() => {
    const c = couple === '1', annuel = 12 * (rev + autres);
    const al = loc === '1' ? apl({ zone, couple: c, enfants: enf, loyer, revenusAnnuels: annuel }).aide : 0;
    const fl = loc === '0' || al > 0;
    const af = allocationsFamiliales({ enfants: enf, majorables: 0, revenus: annuel }).total;
    const s = Math.min(scol, enf);
    const rentree = ars({ c6_10: s, c11_14: 0, c15_18: 0, enfants: enf, revenus: annuel }).total;
    const minimum = rsa({ couple: c, enfants: enf, revenus: rev, autres: autres + af, forfaitLogement: fl }).rsa;
    const pa = primeActivite({ couple: c, enfants: enf, revenu1: rev, autres: autres + af + minimum, forfaitLogement: fl }).prime;
    const mois = al + minimum + pa + af;
    return { al, minimum, pa, af, rentree, mois, an: mois * 12 + rentree };
  }, [couple, enf, scol, rev, autres, loc, zone, loyer]);
  return (
    <Shell id="toutes-aides" form={<>
      <Row2>
        <Toggle id="h-c" label={t.foyer} value={couple} onChange={setCouple} options={[{ value: '0', label: t.seul }, { value: '1', label: t.couple }]} />
        <SelectField id="h-lo" label={t.loge} value={loc} onChange={setLoc} options={[{ value: '1', label: t.loc }, { value: '0', label: t.autre }]} />
      </Row2>
      <Row2>
        <NumberField id="h-e" label={t.enf} value={enf} onChange={setEnf} max={10} lang={lang} />
        <NumberField id="h-s" label={t.scol} value={scol} onChange={setScol} max={10} lang={lang} />
      </Row2>
      <Row2>
        <NumberField id="h-r" label={t.rev} value={rev} onChange={setRev} unit="€" max={30000} lang={lang} />
        <NumberField id="h-a" label={t.autres} value={autres} onChange={setAutres} unit="€" max={30000} lang={lang} />
      </Row2>
      {loc === '1' && <Row2>
        <SelectField id="h-z" label={t.zone} value={String(zone)} onChange={(x) => setZone(Number(x) as Zone)} options={[1, 2, 3].map((z) => ({ value: String(z), label: t.z[z - 1] }))} />
        <NumberField id="h-l" label={t.loyer} value={loyer} onChange={setLoyer} unit="€" max={5000} lang={lang} />
      </Row2>}
    </>} result={<>
      <Head label={t.head} value={$(r.mois)} sub={`${t.an} : ${$(r.an)}`} />
      <Rows rows={[[t.al, $(r.al)], [t.rsa, $(r.minimum)], [t.pa, $(r.pa)], [t.af, $(r.af)], [t.ars, $(r.rentree)]]} />
      <Note>{t.hyp} {disclaimer(lang)}</Note>
    </>} />
  );
}
