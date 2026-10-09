/** Tests du moteur : chaque montant publié par l'administration est reproduit (RECETTE §17.4). */
import { describe, expect, it } from 'vitest';
import { apl, loyerPlafond, forfaitCharges, seuilSortieApl, primeActivite, bonification, rsa, forfaitairePa, forfaitaireRsa, allocationsFamiliales, ars, paje, prepare, complementFamilial, asf, aah, salaireRetenuAah, plafondAah, seuilSortiePrime, forfaitLogement, P } from './index';

describe('RSA (service-public F19778, avril 2026)', () => {
  it('montants forfaitaires du tableau', () => {
    expect(forfaitaireRsa(false, 0)).toBeCloseTo(651.69, 1);
    expect(forfaitaireRsa(true, 0)).toBeCloseTo(977.54, 1);
    expect(forfaitaireRsa(true, 1)).toBe(1173.05);
    expect(forfaitaireRsa(false, 2)).toBe(1173.05);
    expect(forfaitaireRsa(true, 2)).toBeCloseTo(1368.55, 1);
    expect(forfaitaireRsa(false, 1)).toBeCloseTo(977.54, 1);
    expect(forfaitaireRsa(false, 0, true)).toBeCloseTo(836.85, 1);
    expect(forfaitaireRsa(false, 1, true)).toBeCloseTo(1115.80, 1);
    expect(forfaitaireRsa(false, 2, true)).toBeCloseTo(1394.75, 1);
  });
  it('forfaits logement 78,20 / 156,41 / 193,55', () => {
    expect(forfaitLogement(P.rsa.montant_forfaitaire, 1, P.rsa)).toBeCloseTo(78.20, 1);
    expect(forfaitLogement(P.rsa.montant_forfaitaire, 2, P.rsa)).toBeCloseTo(156.41, 1);
    expect(forfaitLogement(P.rsa.montant_forfaitaire, 4, P.rsa)).toBeCloseTo(193.55, 1);
  });
  it("exemple officiel : couple, 2 enfants, aide au logement et allocations familiales = 1 022,75 €", () => {
    expect(rsa({ couple: true, enfants: 2, revenus: 0, autres: 152.25, forfaitLogement: true }).rsa).toBeCloseTo(1022.75, 1);
  });
  it('pas de versement sous 6 €', () => {
    expect(rsa({ couple: false, enfants: 0, revenus: 648, forfaitLogement: false }).rsa).toBe(0);
  });
});

describe("prime d'activité (service-public F2882, avril 2026)", () => {
  it('montants forfaitaires du tableau', () => {
    expect(forfaitairePa(false, 0)).toBeCloseTo(638.28, 1);
    expect(forfaitairePa(true, 0)).toBeCloseTo(957.42, 1);
    expect(forfaitairePa(true, 1)).toBeCloseTo(1148.90, 1);
    expect(forfaitairePa(true, 2)).toBeCloseTo(1340.39, 1);
    expect(forfaitairePa(false, 3) - forfaitairePa(false, 2)).toBeCloseTo(255.31, 1);
    expect(forfaitairePa(false, 0, true)).toBeCloseTo(819.63, 1);
    expect(forfaitairePa(false, 2, true)).toBeCloseTo(1366.05, 1);
  });
  it('bonification : nulle à 726 €, 240,63 € au-delà de 1 698,78 €', () => {
    expect(bonification(726)).toBe(0);
    expect(bonification(1700)).toBeCloseTo(240.63, 1);
    expect(bonification(1200)).toBeGreaterThan(0);
  });
  it('personne seule au Smic net : prime positive, nulle à 3 000 €', () => {
    const p = primeActivite({ couple: false, enfants: 0, revenu1: P.smic.mensuel_net });
    expect(p.prime).toBeGreaterThan(150); expect(p.prime).toBeLessThan(300);
    expect(primeActivite({ couple: false, enfants: 0, revenu1: 3000 }).prime).toBe(0);
    const s = seuilSortiePrime({ couple: false, enfants: 0 });
    expect(s).toBeGreaterThan(1700); expect(s).toBeLessThan(2300);
  });
  it('sans revenu professionnel : pas de prime', () => {
    expect(primeActivite({ couple: false, enfants: 0, revenu1: 0 }).prime).toBe(0);
  });
});

describe('aides au logement (arrêté du 28 septembre 2026)', () => {
  it('loyers plafonds et charges', () => {
    expect(loyerPlafond(1, false, 0)).toBe(336.97);
    expect(loyerPlafond(2, true, 0)).toBe(359.47);
    expect(loyerPlafond(3, false, 2)).toBeCloseTo(374.13 + 53.62, 2);
    expect(Math.round(loyerPlafond(1, false, 0) * 0.9 * 100) / 100).toBe(303.27);
    expect(forfaitCharges(false, 0)).toBe(61.29);
    expect(forfaitCharges(true, 2)).toBeCloseTo(89.09, 2);
    expect(forfaitCharges(false, 0, 'colocation')).toBe(30.64);
  });
  it('étudiant sans revenu en zone 1 : entre 150 et 300 €', () => {
    const a = apl({ zone: 1, couple: false, enfants: 0, loyer: 600, revenusAnnuels: 0, etudiant: true });
    expect(a.forfaitEtudiant).toBe(true); expect(a.aide).toBeGreaterThan(150); expect(a.aide).toBeLessThan(300);
  });
  it("l'aide baisse quand les revenus montent et s'éteint", () => {
    const b = { zone: 2 as const, couple: false, enfants: 0, loyer: 500 };
    expect(apl({ ...b, revenusAnnuels: 8000 }).aide).toBeGreaterThan(apl({ ...b, revenusAnnuels: 14000 }).aide);
    expect(apl({ ...b, revenusAnnuels: 40000 }).aide).toBe(0);
    const s = seuilSortieApl(b); expect(s).toBeGreaterThan(10000); expect(s).toBeLessThan(25000);
  });
  it('dégressivité au-delà de 2,5 fois le plafond en zone 2, suppression à 3,1 fois', () => {
    const b = { zone: 2 as const, couple: false, enfants: 0, revenusAnnuels: 0 };
    expect(apl({ ...b, loyer: 293.68 * 3.2 }).aide).toBe(0);
    expect(apl({ ...b, loyer: 293.68 * 2.8 }).degressivite).toBeGreaterThan(0);
  });
  it('famille de 2 enfants au Smic : aide versée', () => {
    expect(apl({ zone: 2, couple: true, enfants: 2, loyer: 750, revenusAnnuels: 22400 }).aide).toBeGreaterThan(100);
  });
});

describe('allocations familiales (service-public F13213)', () => {
  it('2 enfants, revenus modestes : 152,25 €', () => {
    expect(allocationsFamiliales({ enfants: 2, majorables: 0, revenus: 40000 }).total).toBe(152.25);
  });
  it('3 enfants, tranches 347,32 / 173,67 / 86,83', () => {
    expect(allocationsFamiliales({ enfants: 3, majorables: 0, revenus: 50000 }).total).toBe(347.32);
    expect(allocationsFamiliales({ enfants: 3, majorables: 0, revenus: 100000 }).total).toBe(173.67);
    expect(allocationsFamiliales({ enfants: 3, majorables: 0, revenus: 150000 }).total).toBe(86.83);
  });
  it("famille de 2 : l'aîné n'ouvre pas la majoration", () => {
    expect(allocationsFamiliales({ enfants: 2, majorables: 1, revenus: 40000 }).total).toBe(152.25);
    expect(allocationsFamiliales({ enfants: 2, majorables: 2, revenus: 40000 }).total).toBeCloseTo(152.25 + 76.13, 2);
  });
  it('complément dégressif, exemple officiel : 3 enfants, 87 000 €', () => {
    const r = allocationsFamiliales({ enfants: 3, majorables: 0, revenus: 87000 });
    expect(r.tranche).toBe(1); expect(r.complement).toBeGreaterThan(0);
    expect(r.total).toBeCloseTo((86644 + 12 * 347.32 - 87000) / 12, 1);
  });
  it('un seul enfant : rien', () => { expect(allocationsFamiliales({ enfants: 1, majorables: 0, revenus: 0 }).total).toBe(0); });
});

describe('ARS, Paje, PreParE, CF, ASF, AAH', () => {
  it('ARS plein et différentielle', () => {
    expect(ars({ c6_10: 1, c11_14: 1, c15_18: 0, revenus: 30000 }).total).toBeCloseTo(426.87 + 450.41, 2);
    const d = ars({ c6_10: 1, c11_14: 0, c15_18: 0, revenus: 29056 });
    expect(d.differentielle).toBe(true); expect(d.total).toBeCloseTo(326.87, 2);
    expect(ars({ c6_10: 1, c11_14: 0, c15_18: 0, revenus: 29400 }).total).toBe(0);
  });
  it('prime à la naissance et allocation de base', () => {
    const r = paje({ enfants: 1, deuxRevenus: false, revenus: 30000 });
    expect(r.prime).toBe(1093.11); expect(r.ab).toBe(198.16);
    expect(paje({ enfants: 1, deuxRevenus: false, revenus: 35000 }).ab).toBe(99.08);
    expect(paje({ enfants: 1, deuxRevenus: false, revenus: 40000 }).prime).toBe(0);
    expect(paje({ enfants: 2, deuxRevenus: true, revenus: 50000, naissances: 2 }).prime).toBeCloseTo(2186.22, 2);
  });
  it('PreParE', () => {
    expect(prepare({ mode: 'plein', enfants: 1, couple: true }).dureeMois).toBe(6);
    expect(prepare({ mode: 'mi-temps', enfants: 2, couple: true }).mensuel).toBe(297.17);
    expect(prepare({ mode: 'plein', enfants: 3, couple: true, majoree: true }).mensuel).toBe(751.40);
  });
  it('complément familial', () => {
    expect(complementFamilial({ enfants3a21: 3, deuxRevenus: false, revenus: 20000 }).cf).toBe(297.27);
    expect(complementFamilial({ enfants3a21: 3, deuxRevenus: false, revenus: 30000 }).cf).toBe(198.16);
    expect(complementFamilial({ enfants3a21: 3, deuxRevenus: false, revenus: 50000 }).cf).toBe(0);
  });
  it('ASF pleine et différentielle', () => { expect(asf(2)).toBeCloseTo(401.56, 2); expect(asf(1, 100)).toBeCloseTo(100.78, 2); });
  it('AAH : sans ressource 1 041,59 €, plafond 12 499 €', () => {
    expect(aah({ salaire: 0 }).aah).toBe(1041.59);
    expect([0, 1, 2, 3, 4].map((n) => plafondAah(n))).toEqual([12499, 18749, 24998, 31248, 37497]);
    expect(salaireRetenuAah(500)).toBeCloseTo(100, 2);
    expect(aah({ salaire: 0, autres: 1100 }).aah).toBe(0);
    expect(aah({ salaire: 1000 }).aah).toBeGreaterThan(500);
  });
});
