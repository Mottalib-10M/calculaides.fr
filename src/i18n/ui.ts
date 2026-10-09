import type { Locale } from './routes';
const fr = {
  updatedOn: 'Mis à jour le', editorialPolicy: 'Charte éditoriale', contactLabel: 'Contact', reviewedBy: 'Vérifié par',
  skipToContent: 'Aller au contenu', mainNav: 'Navigation principale', breadcrumbLabel: 'Fil d’Ariane', breadcrumbHome: 'Accueil', menuOpen: 'Ouvrir le menu',
  faqTitle: 'Questions fréquentes', relatedCalculators: 'Pages et simulateurs associés', sourcesTitle: 'Sources', writtenBy: 'Rédigé par',
  asOf: 'Barèmes', lastUpdated: 'vérifiés le', footerValidated: 'Sources : Journal officiel, Légifrance, service-public.fr', footerBrowser: '100 % dans votre navigateur · aucune donnée transmise · gratuit',
  footerDisclaimer: 'Site indépendant édité par Radif Partners, sans lien avec la Caisse nationale des allocations familiales, les CAF, la MSA ni aucune administration. Les montants affichés sont des estimations faites à partir des barèmes publiés au Journal officiel et de vos saisies : seule votre CAF calcule le droit réel, sur votre dossier. Aucune donnée collectée, aucune mise en relation.', footerPopular: '', notFound: 'Cette page n’existe pas.',
  readMore: 'Lire la suite',
};
const en: typeof fr = {
  updatedOn: 'Updated on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Checked by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Frequently asked questions', relatedCalculators: 'Related pages and calculators', sourcesTitle: 'Sources', writtenBy: 'Written by',
  asOf: 'Rates', lastUpdated: 'checked on', footerValidated: 'Sources: Journal officiel, Légifrance, service-public.fr', footerBrowser: '100% in your browser · no data sent · free',
  footerDisclaimer: 'Independent site published by Radif Partners, with no link to the national family allowance fund (CNAF), the local CAF offices, the MSA or any government body. Amounts shown are estimates only, based on the scales published in the Journal officiel and on your inputs: only your CAF works out your real entitlement from your file. No data collected, no referrals.', footerPopular: '', notFound: 'This page does not exist.',
  readMore: 'Read more',
};
export function t(lang: Locale) { return lang === 'en' ? en : fr; }
