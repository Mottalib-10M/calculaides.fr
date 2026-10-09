/**
 * Aides personnelles au logement en location (APL, ALF, ALS : un seul barème depuis 2001).
 * Formule du code de la construction et de l'habitation (art. D823-16 et D823-17) et de
 * l'arrêté du 27 septembre 2019, valeurs revalorisées au 1er octobre 2026 :
 *   aide = L + C − Pp − minoration forfaitaire,  Pp = P0 + Tp × (R − R0)
 * L : loyer retenu dans la limite du loyer plafond (zone, composition, colocation ou chambre) ;
 * C : forfait charges ; P0 : participation minimale ; Tp = TF + TL ; R : ressources annuelles
 * arrondies à la centaine supérieure ; R0 : abattement forfaitaire selon la composition.
 */
import { P } from './params';

export type Zone = 1 | 2 | 3;
export type Logement = 'location' | 'colocation' | 'chambre';
export interface AplInput {
  zone: Zone;
  couple: boolean;
  /** Personnes à charge (enfants, ascendants). */
  enfants: number;
  /** Loyer mensuel hors charges (part du demandeur en colocation). */
  loyer: number;
  logement?: Logement;
  /** Revenus nets imposables des 12 derniers mois (avant abattement de 10 %). */
  revenusAnnuels: number;
  etudiant?: boolean;
  boursier?: boolean;
}
export interface AplResult {
  aide: number; brute: number; plafond: number; loyerRetenu: number; charges: number;
  p0: number; tp: number; tf: number; tl: number; r: number; r0: number; pp: number;
  degressivite: number; versable: boolean; forfaitEtudiant: boolean;
}

const A = P.apl;
const round2 = (x: number) => Math.round(x * 100) / 100;

/** Loyer plafond mensuel de la zone pour la composition du foyer, avant coefficient. */
export function loyerPlafond(zone: Zone, couple: boolean, enfants: number): number {
  const z = A.loyers_plafonds[String(zone) as '1' | '2' | '3'];
  if (enfants <= 0) return couple ? z.couple : z.seul;
  return round2(z.un_enfant + z.par_enfant * (enfants - 1));
}

/** Coefficient du type de logement : colocation 75 %, chambre 90 %. */
export const coefLogement = (l: Logement = 'location') => (l === 'colocation' ? A.coef_colocation : l === 'chambre' ? A.coef_chambre : 1);

export function forfaitCharges(couple: boolean, enfants: number, logement: Logement = 'location'): number {
  const C = A.forfait_charges;
  const base = logement === 'colocation' ? (couple || enfants > 0 ? C.coloc_couple : C.coloc_seul) : C.base;
  return round2(base + C.par_enfant * Math.max(0, enfants));
}

export function r0(couple: boolean, enfants: number): number {
  const R = A.r0;
  if (enfants <= 0) return couple ? R.couple : R.seul;
  if (enfants <= R.pac.length) return R.pac[enfants - 1];
  return R.pac[R.pac.length - 1] + R.pac_supp * (enfants - R.pac.length);
}

export function tauxFamille(couple: boolean, enfants: number): number {
  const T = A.tf;
  if (enfants <= 0) return couple ? T.couple : T.seul;
  if (enfants <= T.pac.length) return T.pac[enfants - 1];
  return T.pac[T.pac.length - 1] + T.pac_supp * (enfants - T.pac.length);
}

/** Taux complémentaire selon le rapport du loyer retenu au loyer de référence (plafond de zone 2). */
export function tauxLoyer(rl: number): number {
  const T = A.tl;
  if (rl < T.seuil1) return 0;
  if (rl < T.seuil2) return T.taux2 * (rl - T.seuil1);
  return T.taux2 * (T.seuil2 - T.seuil1) + T.taux3 * (rl - T.seuil2);
}

/** Ressources retenues : abattement de 10 %, plancher étudiant, arrondi à la centaine supérieure. */
export function ressourcesRetenues(revenusAnnuels: number, etudiant = false, boursier = false): { r: number; forfait: boolean } {
  let r = Math.max(0, revenusAnnuels) * (1 - A.abattement_frais_pro);
  let forfait = false;
  if (etudiant) {
    const plancher = A.etudiant_forfait_ressources - (boursier ? A.etudiant_minoration_boursier : 0);
    if (r < plancher) { r = plancher; forfait = true; }
  }
  return { r: Math.ceil(r / A.arrondi_ressources) * A.arrondi_ressources, forfait };
}

export function apl(i: AplInput): AplResult {
  const logement = i.logement ?? 'location';
  const n = Math.max(0, Math.floor(i.enfants));
  const coef = coefLogement(logement);
  const plafond = round2(loyerPlafond(i.zone, i.couple, n) * coef);
  const loyerRetenu = Math.min(Math.max(0, i.loyer), plafond);
  const charges = forfaitCharges(i.couple, n, logement);
  const e = loyerRetenu + charges;
  const p0 = Math.max(A.p0_taux * e, A.p0_min);
  const ref = loyerPlafond(2, i.couple, n) * coef;
  const tf = tauxFamille(i.couple, n);
  const tl = tauxLoyer(ref > 0 ? loyerRetenu / ref : 0);
  const tp = tf + tl;
  const { r, forfait } = ressourcesRetenues(i.revenusAnnuels, i.etudiant, i.boursier);
  const r0v = r0(i.couple, n);
  const pp = p0 + tp * Math.max(0, r - r0v);
  let brute = Math.max(0, e - pp - A.minoration);
  // Dégressivité puis suppression quand le loyer réel dépasse un multiple du plafond.
  const [kd, ks] = A.degressivite[String(i.zone) as '1' | '2' | '3'];
  const ld = plafond * kd, ls = plafond * ks;
  let degressivite = 0;
  if (i.loyer > ld) {
    degressivite = i.loyer >= ls ? 1 : (i.loyer - ld) / (ls - ld);
    brute = brute * (1 - degressivite);
  }
  brute = round2(brute);
  const versable = brute >= A.seuil_versement;
  return { aide: versable ? brute : 0, brute, plafond, loyerRetenu, charges, p0: round2(p0), tp, tf, tl, r, r0: r0v, pp: round2(pp), degressivite, versable, forfaitEtudiant: forfait };
}

/** Revenu annuel (net imposable) au-delà duquel l'aide tombe sous le seuil de versement. */
export function seuilSortieApl(base: Omit<AplInput, 'revenusAnnuels'>): number {
  let lo = 0, hi = 200_000;
  if (apl({ ...base, revenusAnnuels: 0 }).aide === 0) return 0;
  for (let k = 0; k < 40; k++) { const mid = (lo + hi) / 2; if (apl({ ...base, revenusAnnuels: mid }).aide > 0) lo = mid; else hi = mid; }
  return Math.floor(lo / 100) * 100;
}
