import { defineDocumentType, defineNestedType, makeSource } from 'contentlayer/source-files';

const removePrefix = (value: string, prefix: string) =>
  value.replace(new RegExp(`^${prefix}/`), '').replace(/\/index$/, '');

const Theme = defineNestedType(() => ({
  name: 'Theme',
  fields: {
    background: { type: 'string', required: true },
    foreground: { type: 'string', required: true },
    primary: { type: 'string', required: false },
  },
}));

export const Insight = defineDocumentType(() => ({
  name: 'Insight',
  filePathPattern: 'insights/**/*.md',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    summary: { type: 'string', required: false },
    publishedAt: { type: 'date', required: false },
    tags: { type: 'list', of: { type: 'string' }, required: false },
    relatedCaseAnchor: { type: 'string', required: false },
    theme: { type: 'nested', of: Theme, required: false },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => removePrefix(doc._raw.flattenedPath, 'insights'),
    },
    url: { type: 'string', resolve: (doc) => `/insights/${removePrefix(doc._raw.flattenedPath, 'insights')}` },
  },
}));

export const CreativeWork = defineDocumentType(() => ({
  name: 'CreativeWork',
  filePathPattern: 'creative/**/*.md',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    summary: { type: 'string', required: false },
    year: { type: 'string', required: false },
    medium: { type: 'string', required: false },
    link: { type: 'string', required: false },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => removePrefix(doc._raw.flattenedPath, 'creative'),
    },
  },
}));

export const Portfolio = defineDocumentType(() => ({
  name: 'Portfolio',
  filePathPattern: 'pages/portfolio.md',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
  },
  isSingleton: true,
}));

export const CaseStudy = defineDocumentType(() => ({
  name: 'CaseStudy',
  filePathPattern: 'case-studies/**/*.md',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    subtitle: { type: 'string', required: false }, // e.g. Co-Founder & CTO
    tagline: { type: 'string', required: false }, // e.g. Funded modular SaaS platform
    order: { type: 'number', required: false },
    insightSlugs: { type: 'list', of: { type: 'string' }, required: false }, // e.g. ["startup-architecture"]
    category: { type: 'string', required: false }, // 'case-study' | 'project' - defaults to case-study
    theme: { type: 'nested', of: Theme, required: false },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => removePrefix(doc._raw.flattenedPath, 'case-studies'),
    },
    url: {
      type: 'string',
      resolve: (doc) => `/${removePrefix(doc._raw.flattenedPath, 'case-studies')}`,
    },
  },
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Insight, CreativeWork, Portfolio, CaseStudy],
});
