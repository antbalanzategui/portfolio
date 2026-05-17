import { getAllEntries, getEntryBySlug, getEntrySlugs } from './content';

const DIR = 'case-studies';

export const getCaseStudySlugs = () => getEntrySlugs(DIR);
export const getCaseStudyBySlug = (slug) => getEntryBySlug(DIR, slug);
export const getAllCaseStudies = (opts) => getAllEntries(DIR, opts);
