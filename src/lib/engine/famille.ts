/**
 * Prestations familiales 2026 (CSS livre V), montants nets de CRDS publiés par l'administration
 * au 1er avril 2026 : allocations familiales et complément dégressif, allocation de rentrée
 * scolaire et allocation différentielle, prime à la naissance et allocation de base de la Paje,
 * PreParE, complément familial, allocation de soutien familial. Ressources = revenu net
 * catégoriel de l'année 2024 pour les droits de 2026.
 */
import { P } from './params';

const round2 = (x: number) => Math.round(x * 100) / 100;

/* ---------------------------------------------------------------- allocations familiales */

export interface AfInput {
  /** Enfants à charge de moins de 20 ans. */
  enfants: number;
  /** Enfants ouvrant droit à la majoration : nés avant le 1er mars 2012 (14 ans et plus en 2026). */
  majorables: number;
  /** Enfants ayant atteint 20 ans dans l'année (forfait, familles d'au moins 3 enfants). */
  vingtAns?: number;
  /** Revenu net catégoriel 2024 du foyer. */
  revenus: number;
}
export interface AfResult { total: number; base: number; majorations: number; forfait: number; tranche: 0 | 1 | 2; complement: number; plafonds: [number, number]; nbMajorations: number }

export function plafondsAf(enfants: number): [number, number] {
  const p = P.af.plafonds;
  if (enfants <= 2) return [p.deux[0], p.deux[1]];
  const extra = (enfants - 3) * p.par_enfant;
  return [p.trois[0] + extra, p.trois[1] + extra];
}
/** Montant de base d'une tranche (0, 1, 2) pour n enfants. */
export function baseAf(enfants: number, tranche: 0 | 1 | 2): number {
  const T = P.af.tranches_nettes;
  if (enfants < 2) return 0;
  if (enfants === 2) return T.deux[tranche];
  if (enfants === 3) return T.trois[tranche];
  const parSuivant = T.quatre[tranche] - T.trois[tranche];
  return round2(T.quatre[tranche] + parSuivant * (enfants - 4));
}
/** Dans une famille de deux enfants, l'aîné n'ouvre pas droit à la majoration. */
export function nbMajorations(enfants: number, majorables: number): number {
  const m = Math.max(0, Math.min(Math.floor(majorables), Math.floor(enfants)));
  if (enfants < 2) return 0;
  if (enfants === 2) return m === 2 ? 1 : 0;
  return m;
}
function afTranche(i: AfInput, t: 0 | 1 | 2): number {
  const n = Math.max(0, Math.floor(i.enfants));
  const forfaits = n >= 3 ? Math.max(0, Math.floor(i.vingtAns ?? 0)) : 0;
  return baseAf(n, t) + P.af.majoration[t] * nbMajorations(n, i.majorables) + P.af.forfait_20_ans[t] * forfaits;
}
export function allocationsFamiliales(i: AfInput): AfResult {
  const n = Math.max(0, Math.floor(i.enfants));
  const pl = plafondsAf(n);
  const tranche: 0 | 1 | 2 = i.revenus <= pl[0] ? 0 : i.revenus <= pl[1] ? 1 : 2;
  const nbM = nbMajorations(n, i.majorables);
  const forfaits = n >= 3 ? Math.max(0, Math.floor(i.vingtAns ?? 0)) : 0;
  const montant = afTranche(i, tranche);
  // Complément dégressif : ressources au-dessus d'un plafond de moins de 12 fois l'écart entre tranches.
  let complement = 0;
  if (n >= 2 && tranche > 0) {
    const plafond = pl[tranche - 1];
    const avant = afTranche(i, (tranche - 1) as 0 | 1);
    const c = (plafond + 12 * avant - i.revenus) / 12 - montant;
    if (c > 0) complement = round2(c);
  }
  return {
    total: n >= 2 ? round2(montant + complement) : 0, base: baseAf(n, tranche),
    majorations: round2(P.af.majoration[tranche] * nbM), forfait: round2(P.af.forfait_20_ans[tranche] * forfaits),
    tranche, complement, plafonds: pl, nbMajorations: nbM,
  };
}

/* ---------------------------------------------------------------- rentrée scolaire */

export interface ArsInput { c6_10: number; c11_14: number; c15_18: number; /** enfants à charge au total */ enfants?: number; revenus: number }
export interface ArsResult { total: number; plein: number; plafond: number; differentielle: boolean }
export function plafondArs(enfants: number): number {
  const p = P.ars.plafonds;
  if (enfants <= 1) return p.un;
  if (enfants === 2) return p.deux;
  return p.trois + p.par_enfant * (enfants - 3);
}
export function ars(i: ArsInput): ArsResult {
  const M = P.ars.montants;
  const nb = Math.max(0, i.c6_10) + Math.max(0, i.c11_14) + Math.max(0, i.c15_18);
  const plein = round2(i.c6_10 * M['6_10'] + i.c11_14 * M['11_14'] + i.c15_18 * M['15_18']);
  const enfants = Math.max(nb, Math.floor(i.enfants ?? nb));
  const plafond = plafondArs(enfants);
  if (nb === 0) return { total: 0, plein: 0, plafond, differentielle: false };
  if (i.revenus <= plafond) return { total: plein, plein, plafond, differentielle: false };
  const diff = round2(plein - (i.revenus - plafond));
  return { total: diff >= P.ars.minimum_verse ? diff : 0, plein, plafond, differentielle: true };
}

/* ---------------------------------------------------------------- Paje : naissance et allocation de base */

export interface PajeInput { /** enfants à charge, l'enfant né ou à naître compris */ enfants: number; deuxRevenus: boolean; revenus: number; naissances?: number }
/** totalAb36 : 35 mensualités, du mois suivant la naissance au mois précédant les 3 ans (fiche F2552). */
export interface PajeResult { prime: number; ab: number; taux: 'plein' | 'partiel' | 'aucun'; plafond: number; plafondPlein: number; totalAb36: number }
const idx = (enfants: number) => Math.min(Math.max(1, Math.floor(enfants)), 3) - 1;
export function plafondNaissance(enfants: number, deuxRevenus: boolean): number {
  const p = P.paje.plafonds_naissance, t = deuxRevenus ? p.deux_revenus : p.un_revenu;
  return t[idx(enfants)] + p.par_enfant * Math.max(0, Math.floor(enfants) - 3);
}
export function plafondAbPlein(enfants: number, deuxRevenus: boolean): number {
  const t = deuxRevenus ? P.paje.plafonds_ab_plein.deux_revenus : P.paje.plafonds_ab_plein.un_revenu;
  // Au-delà du 3e enfant : même écart que du 2e au 3e (7 456 €), comme le barème de la prime (8 908 €).
  const pas = t[2] - t[1];
  return t[idx(enfants)] + pas * Math.max(0, Math.floor(enfants) - 3);
}
export function paje(i: PajeInput): PajeResult {
  const plafond = plafondNaissance(i.enfants, i.deuxRevenus);
  const plafondPlein = plafondAbPlein(i.enfants, i.deuxRevenus);
  const ok = i.revenus <= plafond;
  const prime = ok ? round2(P.paje.prime_naissance * Math.max(1, Math.floor(i.naissances ?? 1))) : 0;
  const taux = !ok ? 'aucun' : i.revenus <= plafondPlein ? 'plein' : 'partiel';
  const ab = taux === 'plein' ? P.paje.ab_plein : taux === 'partiel' ? P.paje.ab_partiel : 0;
  return { prime, ab, taux, plafond, plafondPlein, totalAb36: round2(ab * 35) };
}

/* ---------------------------------------------------------------- PreParE */

export type PrepareMode = 'plein' | 'mi-temps' | 'partiel';
export interface PrepareInput { mode: PrepareMode; enfants: number; couple: boolean; majoree?: boolean }
export interface PrepareResult { mensuel: number; dureeMois: number; limite: string; total: number; majoree: boolean }
export function prepare(i: PrepareInput): PrepareResult {
  const R = P.prepare;
  const majoree = !!i.majoree && i.enfants >= 3 && i.mode === 'plein';
  const mensuel = majoree ? R.majoree : i.mode === 'plein' ? R.taux_plein : i.mode === 'mi-temps' ? R.partiel_50 : R.partiel_50_80;
  let dureeMois: number, limite: string;
  if (majoree) { dureeMois = i.couple ? R.duree.majoree_mois : 12; limite = '1'; }
  else if (i.enfants <= 1) { dureeMois = i.couple ? R.duree.un_enfant_mois : 12; limite = '1'; }
  else { dureeMois = i.couple ? R.duree.deux_enfants_mois : 36; limite = '3'; }
  return { mensuel, dureeMois, limite, total: round2(mensuel * dureeMois), majoree };
}

/* ---------------------------------------------------------------- complément familial et ASF */

export interface CfInput { enfants3a21: number; deuxRevenus: boolean; revenus: number }
export interface CfResult { cf: number; majore: boolean; plafond: number; plafondMajore: number }
export function complementFamilial(i: CfInput): CfResult {
  const n = Math.floor(i.enfants3a21);
  const pick = (t: { un_revenu: number[]; deux_revenus: number[]; par_enfant: number }) => {
    const row = i.deuxRevenus ? t.deux_revenus : t.un_revenu;
    return n <= 3 ? row[0] : row[1] + t.par_enfant * (n - 4);
  };
  const plafond = pick(P.cf.plafonds), plafondMajore = pick(P.cf.plafonds_majore);
  if (n < 3 || i.revenus > plafond) return { cf: 0, majore: false, plafond, plafondMajore };
  const majore = i.revenus <= plafondMajore;
  return { cf: majore ? P.cf.majore : P.cf.base, majore, plafond, plafondMajore };
}
export function asf(enfants: number, pensionParEnfant = 0): number {
  const a = P.asf.par_enfant;
  return round2(Math.max(0, Math.floor(enfants)) * Math.max(0, a - Math.max(0, pensionParEnfant)));
}
