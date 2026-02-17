import { defineCollection, z } from 'astro:content';

const docs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    purpose: z.enum(['guide', 'rule', 'template', 'example', 'reference']).optional(),
    level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    persona: z.array(z.enum(['general', 'power-user', 'developer', 'organization'])).optional(),
    status: z.enum(['draft', 'review', 'stable', 'recommended', 'deprecated']).optional(),
    lang: z.enum(['ko', 'en']).optional(),
    translationKey: z.string().optional(),
    tags: z.array(z.string()).optional(),
    created: z.string().optional(),
    updated: z.string().optional(),
    contributors: z.array(z.string()).optional(),
  }),
});

export const collections = { docs };
