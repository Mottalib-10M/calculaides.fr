/**
 * Prime d'activité (CSS art. L842-3, D843-1 à D843-3, R844-3) et RSA (CASF art. L262-2, R262-1,
 * R262-9), montants au 1er avril 2026. Les deux prestations partagent la même échelle de
 * composition du foyer : +50 % pour la 2e personne, +30 % pour chaque personne suivante, +40 %
 * par enfant au-delà du 2e ; le parent isolé a droit à 128,412 % + 42,804 % par enfant.
 */
import { P } from './params';

const round2 = (x: number) => Math.round(x * 100) / 100;
/** Le RSA publié arrondit les montants majorés au centime supérieur (1 173,05 € pour 3 personnes). */
const ceil2 = (x: number) => Math.ceil(Math.round(x * 1e6) / 1e4) / 100;
type Echelle = { majoration: { deuxieme: number; suivante: number; au_dela_troisieme_enfant: number }; isole: { base: number; par_enfant: number }; forfait_logement: { un: number; deux: number; trois: number } };

/** Coefficient de composition du foyer (1 pour une personne seule sans enfant). */
export function coefFoyer(couple: boolean, enfants: number, E: Echelle = P.pa): number {
  const n = Math.max(0, Math.floor(enfants));
  let c = 1, personnes = 1;
  if (couple) { c += E.majoration.deuxieme; personnes = 2; }
  for (let k = 1; k <= n; k++) {
    personnes += 1;
    if (personnes === 2) c += E.majoration.deuxieme;
    else if (k >= 3) c += E.majoration.au_dela_troisieme_enfant;
    else c += E.majoration.suivante;
  }
  return c;
}
/** Coefficient majoré du parent isolé (enfant à naître = 0 enfant, grossesse déclarée). */
export const coefIsole = (enfants: number, E: Echelle = P.pa) => E.isole.base + E.isole.par_enfant * Math.max(0, Math.floor(enfants));

/** Forfait logement : 12 %, 16 % ou 16,5 % du montant forfaitaire d'une, deux ou trois personnes. */
export function forfaitLogement(base: number, personnes: number, E: Echelle = P.pa): number {
  if (personnes <= 1) return round2(base * E.forfait_logement.un);
  if (personnes === 2) return round2(base * 1.5 * E.forfait_logement.deux);
  return round2(base * 1.8 * E.forfait_logement.trois);
}

/* ---------------------------------------------------------------- prime d'activité */

/** Bonification individuelle : nulle sous 59 Smic horaires, croissante jusqu'à 138, plafonnée. */
export function bonification(revenuMensuel: number): number {
  const B = P.pa.bonif, h = P.smic.horaire_brut;
  const s = B.seuil_smic_h * h, m = B.plafond_smic_h * h, max = B.taux_max * P.pa.montant_forfaitaire;
  if (revenuMensuel <= s) return 0;
  if (revenuMensuel >= m) return round2(max);
  return round2(max * (revenuMensuel - s) / (m - s));
}
export const seuilBonification = () => round2(P.pa.bonif.seuil_smic_h * P.smic.horaire_brut);
export const plafondBonification = () => round2(P.pa.bonif.plafond_smic_h * P.smic.horaire_brut);
export const bonificationMax = () => round2(P.pa.bonif.taux_max * P.pa.montant_forfaitaire);

export interface PaInput {
  couple: boolean;
  enfants: number;
  /** Revenus professionnels mensuels nets du demandeur et du conjoint (moyenne du trimestre). */
  revenu1: number;
  revenu2?: number;
  /** Autres ressources mensuelles : allocations familiales, chômage, pensions, pension alimentaire. */
  autres?: number;
  /** Aide au logement perçue, propriétaire sans loyer ou hébergé gratuitement : forfait logement. */
  forfaitLogement?: boolean;
  /** Parent isolé dans les 12 mois ou avec un enfant de moins de 3 ans : montant majoré. */
  isoleMajore?: boolean;
}
export interface PaResult { prime: number; brute: number; forfaitaire: number; partRevenus: number; bonif: number; ressources: number; fl: number; versable: boolean }

export function primeActivite(i: PaInput): PaResult {
  const base = P.pa.montant_forfaitaire;
  const n = Math.max(0, Math.floor(i.enfants));
  const coef = i.isoleMajore && !i.couple ? coefIsole(n) : coefFoyer(i.couple, n);
  const forfaitaire = round2(base * coef);
  const r1 = Math.max(0, i.revenu1), r2 = i.couple ? Math.max(0, i.revenu2 ?? 0) : 0;
  const rp = r1 + r2;
  const personnes = (i.couple ? 2 : 1) + n;
  const fl = i.forfaitLogement ? forfaitLogement(base, personnes) : 0;
  const ressources = rp + Math.max(0, i.autres ?? 0) + fl;
  const partRevenus = round2(P.pa.taux_revenus * rp);
  const bonif = bonification(r1) + (i.couple ? bonification(r2) : 0);
  const brute = round2(Math.max(0, forfaitaire + partRevenus + bonif - Math.max(forfaitaire, ressources)));
  const versable = brute >= P.pa.minimum_verse;
  return { prime: versable ? brute : 0, brute, forfaitaire, partRevenus, bonif: round2(bonif), ressources: round2(ressources), fl, versable };
}

/** Revenu d'activité mensuel (personne seule, autres données fixes) au-delà duquel la prime s'éteint. */
export function seuilSortiePrime(base: Omit<PaInput, 'revenu1'>): number {
  let lo = 0, hi = 20_000;
  for (let k = 0; k < 40; k++) { const mid = (lo + hi) / 2; if (primeActivite({ ...base, revenu1: mid }).prime > 0) lo = mid; else hi = mid; }
  return Math.floor(lo / 10) * 10;
}

/* ---------------------------------------------------------------- RSA */

export interface RsaInput {
  couple: boolean;
  enfants: number;
  /** Revenus d'activité mensuels nets du foyer (comptés à 100 % pour le RSA). */
  revenus: number;
  /** Autres ressources mensuelles du foyer (dont allocations familiales, pensions, chômage). */
  autres?: number;
  forfaitLogement?: boolean;
  isoleMajore?: boolean;
}
export interface RsaResult { rsa: number; brute: number; forfaitaire: number; fl: number; ressources: number; versable: boolean }

export function rsa(i: RsaInput): RsaResult {
  const base = P.rsa.montant_forfaitaire;
  const n = Math.max(0, Math.floor(i.enfants));
  const coef = i.isoleMajore && !i.couple ? coefIsole(n, P.rsa) : coefFoyer(i.couple, n, P.rsa);
  const forfaitaire = ceil2(base * coef);
  const personnes = (i.couple ? 2 : 1) + n;
  const fl = i.forfaitLogement ? forfaitLogement(base, personnes, P.rsa) : 0;
  const ressources = Math.max(0, i.revenus) + Math.max(0, i.autres ?? 0);
  const brute = round2(Math.max(0, forfaitaire - ressources - fl));
  const versable = brute >= P.rsa.minimum_verse;
  return { rsa: versable ? brute : 0, brute, forfaitaire, fl, ressources: round2(ressources), versable };
}

/** Montant forfaitaire du RSA ou de la prime d'activité pour une composition donnée. */
export const forfaitaireRsa = (couple: boolean, enfants: number, isole = false) => ceil2(P.rsa.montant_forfaitaire * (isole && !couple ? coefIsole(enfants, P.rsa) : coefFoyer(couple, enfants, P.rsa)));
export const forfaitairePa = (couple: boolean, enfants: number, isole = false) => round2(P.pa.montant_forfaitaire * (isole && !couple ? coefIsole(enfants) : coefFoyer(couple, enfants)));
