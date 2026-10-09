/** Simulateur AAH avec un salaire ou une pension. Moteur : lib/engine/aah.ts (montant du 1er avril 2026). */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import { aah, seuilSortieAah } from '../../lib/engine/aah';
import { readParams, num, updateURL } from '../../lib/url-state';
import { Shell, Row2, Head, Rows, Note, MethodLink, disclaimer, eur, type L } from './kit';

const TX = {
  fr: { sal: 'Salaire net mensuel', salHelp: 'Emploi en milieu ordinaire.', autres: 'Pension, rente ou autre ressource par mois', enf: 'Enfants à charge', head: 'AAH estimée par mois', none: 'Pas d’AAH avec ces ressources', retenu: 'Salaire retenu après abattement', ab: 'Abattement sur le salaire', ress: 'Ressources retenues par mois', plafond: 'Plafond annuel de ressources', total: 'Salaire + AAH', sortie: 'L’AAH s’arrête vers', sortieU: 'de salaire net' },
  en: { sal: 'Net monthly pay', salHelp: 'Job in an ordinary workplace.', autres: 'Pension, annuity or other monthly income', enf: 'Dependent children', head: 'Estimated AAH per month', none: 'No AAH with this income', retenu: 'Pay counted after allowance', ab: 'Allowance on pay', ress: 'Monthly resources counted', plafond: 'Annual income ceiling', total: 'Pay + AAH', sortie: 'AAH stops at about', sortieU: 'net pay' },
};

export default function AahCalc({ lang = 'fr', methodHref }: { lang?: L; methodHref?: string }) {
  const t = TX[lang]; const $ = (x: number) => eur(x, lang);
  const [sal, setSal] = useState(800); const [autres, setAutres] = useState(0); const [enf, setEnf] = useState(0);
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setSal(num(u, 's', 800)); setAutres(num(u, 'a', 0)); setEnf(num(u, 'e', 0)); }, []);
  useEffect(() => { updateURL({ s: sal, a: autres, e: enf }); }, [sal, autres, enf]);
  const r = useMemo(() => aah({ salaire: sal, autres, enfants: enf }), [sal, autres, enf]);
  const sortie = useMemo(() => seuilSortieAah(enf, autres), [enf, autres]);
  return (
    <Shell id="aah" form={<>
      <Row2>
        <NumberField id="aah-s" label={t.sal} value={sal} onChange={setSal} unit="€" max={20000} help={t.salHelp} lang={lang} />
        <NumberField id="aah-a" label={t.autres} value={autres} onChange={setAutres} unit="€" max={20000} lang={lang} />
      </Row2>
      <Row2><NumberField id="aah-e" label={t.enf} value={enf} onChange={setEnf} max={10} lang={lang} /></Row2>
    </>} result={<>
      <Head label={t.head} value={$(r.aah)} sub={r.aah === 0 ? t.none : undefined} />
      <Rows rows={[[t.ab, `− ${$(r.abattement)}`], [t.retenu, $(r.salaireRetenu)], [t.ress, $(r.ressourcesRetenues)], [t.plafond, $(r.plafondAnnuel)], [t.total, $(sal + r.aah), true], [t.sortie, `${$(sortie)} ${t.sortieU}`]]} />
      <Note>{disclaimer(lang)}</Note>
      <MethodLink href={methodHref} lang={lang} />
    </>} />
  );
}
