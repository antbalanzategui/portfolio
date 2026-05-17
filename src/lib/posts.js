import { getAllEntries, getEntryBySlug, getEntrySlugs } from './content';

const DIR = 'posts';

export const getPostSlugs = () => getEntrySlugs(DIR);
export const getPostBySlug = (slug) => getEntryBySlug(DIR, slug);
export const getAllPosts = (opts) => getAllEntries(DIR, opts);

export { formatPostDate } from './post-format';
