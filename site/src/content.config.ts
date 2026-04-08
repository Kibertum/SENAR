import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const core = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/core/en' }),
  schema: z.object({}).passthrough(),
});

const coreRu = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/core/ru' }),
  schema: z.object({}).passthrough(),
});

const standard = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/standard/en' }),
  schema: z.object({}).passthrough(),
});

const standardRu = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/standard/ru' }),
  schema: z.object({}).passthrough(),
});

const guide = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/guide/en' }),
  schema: z.object({}).passthrough(),
});

const guideRu = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/guide/ru' }),
  schema: z.object({}).passthrough(),
});

const reference = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/reference/en' }),
  schema: z.object({}).passthrough(),
});

const referenceRu = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/reference/ru' }),
  schema: z.object({}).passthrough(),
});

export const collections = { core, coreRu, standard, standardRu, guide, guideRu, reference, referenceRu };
