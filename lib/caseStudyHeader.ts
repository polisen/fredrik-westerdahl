export type CaseStudyHeaderMeta = {
  years?: string;
  visitUrl?: string;
};

/** Shared header-line meta for sticky section pills and nav dropdowns. */
export const CASE_STUDY_HEADER: Record<string, CaseStudyHeaderMeta> = {
  '01-sublink': { years: '2023–2026' },
  '04-renewcell-toolkit': {
    years: '2023–2024',
    visitUrl: 'https://www.circulose.com/',
  },
  '05-auction-house': {
    years: '2024–2026',
    visitUrl: 'https://www.lillaauktionsstudion.se/',
  },
};

export function getCaseStudyHeader(slug: string): CaseStudyHeaderMeta {
  return CASE_STUDY_HEADER[slug] ?? {};
}
