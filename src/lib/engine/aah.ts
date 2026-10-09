/**
 * Allocation aux adultes handicapés (CSS art. L821-1, L821-3, D821-2 à D821-9), montant au
 * 1er avril 2026. Depuis le 1er octobre 2023, seules les ressources de la personne comptent
 * (déconjugalisation). Les revenus d'une activité en milieu ordinaire sont retenus après un
 * abattement de 80 % jusqu'à 30 % du Smic brut mensuel et de 40 % au-delà.
 */
import { P } from './params';

const round2 = (x: number) => Math.round(x * 100) / 100;
const A = P.aah;

export interface AahInput {
  /** Salaire mensuel net (activité en milieu ordinaire). */
  salaire: number;
  /** Pension d'invalidité, rente ou autre ressource mensuelle de la personne. */
  autres?: number;
  /** Enfants à charge. */
  enfants?: number;
}
export interface AahResult { aah: number; plafondAnnuel: number; ressourcesRetenues: number; salaireRetenu: number; abattement: number }

/** Part du salaire retenue après abattement (80 % jusqu'à 30 % du Smic brut, 40 % au-delà). */
export function salaireRetenuAah(salaire: number): number {
  const ab = A.abattement_activite;
  const tranche = ab.tranche_smic_brut * P.smic.mensuel_brut;
  const s = Math.max(0, salaire);
  const bas = Math.min(s, tranche), haut = Math.max(0, s - tranche);
  return round2(bas * (1 - ab.taux_bas) + haut * (1 - ab.taux_haut));
}
/** Plafond annuel : 12 fois le montant maximal, majoré de 50 % par enfant, arrondi à l'euro (12 499, 18 749, 24 998 € selon service-public). */
export const plafondAah = (enfants = 0) => Math.round(12 * A.montant_max * (1 + 0.5 * Math.max(0, Math.floor(enfants))));

export function aah(i: AahInput): AahResult {
  const salaireRetenu = salaireRetenuAah(i.salaire);
  const ressourcesRetenues = round2(salaireRetenu + Math.max(0, i.autres ?? 0));
  const plafondAnnuel = plafondAah(i.enfants);
  const v = round2(Math.min(A.montant_max, Math.max(0, (Math.max(plafondAnnuel, 12 * A.montant_max) - 12 * ressourcesRetenues) / 12)));
  return { aah: v, plafondAnnuel, ressourcesRetenues, salaireRetenu, abattement: round2(Math.max(0, i.salaire) - salaireRetenu) };
}
/** Salaire net mensuel à partir duquel l'AAH s'éteint (sans autre ressource). */
export function seuilSortieAah(enfants = 0, autres = 0): number {
  let lo = 0, hi = 20_000;
  for (let k = 0; k < 40; k++) { const mid = (lo + hi) / 2; if (aah({ salaire: mid, autres, enfants }).aah > 0) lo = mid; else hi = mid; }
  return Math.floor(lo);
}
