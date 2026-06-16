import { defineCollection, defineContentConfig } from '@nuxt/content';
import { defineSitemapSchema } from '@nuxtjs/sitemap/content';
import { z } from 'zod';

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  thumbnail: z.string().optional(),
  tags: z.array(z.string()).default([]),
  date: z.coerce.date(),
});

export default defineContentConfig({
  collections: {
    blog_en: defineCollection({
      type: 'page',
      source: { include: 'en/blog/**/*.md', prefix: '/blog' },
      schema: blogSchema.extend({
        sitemap: defineSitemapSchema({
          name: 'blog_en',
          // no onUrl, en is default without prefix
        }),
      }),
    }),
    blog_cs: defineCollection({
      type: 'page',
      source: { include: 'cs/blog/**/*.md', prefix: '/blog' },
      schema: blogSchema.extend({
        sitemap: defineSitemapSchema({
          name: 'blog_cs',
          onUrl: (url) => {
            url.loc = `/cs${url.loc}`;
          },
        }),
      }),
    }),
  },
});
