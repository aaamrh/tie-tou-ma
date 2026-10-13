import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    date: z.iso.date().transform((value) => new Date(value)),
    category: z.string().trim().min(1).refine((value) => !['.', '..'].includes(value) && !/[\/\\]/.test(value), '分类名称不能使用路径或斜线'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
