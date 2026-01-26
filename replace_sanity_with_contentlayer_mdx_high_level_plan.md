# Replacing Sanity with Contentlayer + MDX

> **Note:** This is a **high‑level implementation outline**. You’ll almost certainly need to adapt names, paths, route structure, and TypeScript types to match your actual project.

---

## 0. Mindset shift

- **Before:**
  - Sanity Studio + datasets
  - Portable Text + GROQ/`next-sanity` queries
- **After:**
  - `content/` folder in your repo
  - `*.mdx` files typed via Contentlayer
  - React/Next.js fully control layout and presentation

This guide assumes **Next.js App Router** and **TypeScript**, but you’ll need to align the imports and paths with your own setup.

---

## 1. Remove Sanity from the stack (high‑level)

1. Identify and remove Sanity plumbing:
   - `sanity.config.ts`, `sanity/` (or equivalent Studio folder)
   - Shared client files like `sanityClient.ts`, `client.ts`, `lib/sanity.ts`, etc.
   - Any `groq` queries and `next-sanity` helpers.

2. Clean up dependencies (adjust to your actual `package.json`):
   - Remove things like:
     - `next-sanity`
     - `@sanity/client`
     - `@sanity/image-url`
     - Sanity Studio packages and plugins

3. Remove obsolete env vars:
   - `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_TOKEN`, etc.

> **You may have references scattered across hooks, layout files, and old API routes.** Use your editor’s global search to find `sanity`, `groq`, or `portableText` and refactor case‑by‑case.

---

## 2. Add Contentlayer + MDX (skeleton)

Install (adjust to your package manager):

```bash
npm i contentlayer next-contentlayer
```

Wrap your Next config (exact file + syntax may differ in your project):

```ts
// next.config.mjs or next.config.js
import { withContentlayer } from 'next-contentlayer'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // your existing config here
}

export default withContentlayer(nextConfig)
```

Make sure this matches your current config style (ESM vs CJS, `export default` vs `module.exports`).

---

## 3. Basic `content/` structure (example)

You can customize this — it’s just a starting point:

```text
content/
  posts/
    my-first-post/
      index.mdx
      hero.jpg
  pages/
    about.mdx
```

Example `content/posts/my-first-post/index.mdx`:

```mdx
---
title: "My First Post"
slug: "my-first-post"
date: "2025-12-03"
layout: "default"
---

# Hello

This is MDX now.

<Callout>
  You can use custom React components here.
</Callout>
```

You’ll need to align the frontmatter fields (`slug`, `layout`, etc.) with what your app expects.

---

## 4. `contentlayer.config.ts` (high‑level example)

Create `contentlayer.config.ts` in the project root. Adjust patterns, field names, and computed fields to match your needs:

```ts
import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: 'posts/**/index.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    date: { type: 'date', required: true },
    layout: { type: 'string', required: false },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/blog/${doc.slug}`,
    },
  },
}))

export const Page = defineDocumentType(() => ({
  name: 'Page',
  filePathPattern: 'pages/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    slug: { type: 'string', required: true },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/${doc.slug}`,
    },
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post, Page],
})
```

You may want additional fields (e.g. `summary`, `tags`, `draft`) and different URL structures.

---

## 5. MDX rendering helpers (example)

Create an MDX rendering helper. The exact path is up to you, e.g. `src/mdx-components.tsx`.

```tsx
import { useMDXComponent } from 'next-contentlayer/hooks'
import Image from 'next/image'

// Import any custom components you want usable in MDX
import { Callout } from '@/components/Callout'
import { Scene3D } from '@/components/Scene3D'

const components = {
  Callout,
  Scene3D,
  img: (props: any) => <Image {...props} alt={props.alt ?? ''} />,
}

export function Mdx({ code }: { code: string }) {
  const Component = useMDXComponent(code)
  return <Component components={components} />
}
```

You may want to refine the typing, pass in more components, or customize Image behavior.

---

## 6. Blog routes (App Router example)

Assuming something like `app/blog/page.tsx` and `app/blog/[slug]/page.tsx`. Adjust to your actual routing structure.

### Blog index

```tsx
// app/blog/page.tsx
import { allPosts } from 'contentlayer/generated'
import Link from 'next/link'

export default function BlogPage() {
  const posts = [...allPosts].sort(
    (a, b) => +new Date(b.date) - +new Date(a.date),
  )

  return (
    <div>
      {posts.map((post) => (
        <article key={post._id}>
          <Link href={post.url}>{post.title}</Link>
        </article>
      ))}
    </div>
  )
}
```

You might need to adjust sorting, metadata, and markup to match your existing layout.

### Post detail

```tsx
// app/blog/[slug]/page.tsx
import { allPosts } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { Mdx } from '@/mdx-components'

const layouts = {
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  // Add more layouts: caseStudy: CaseStudyLayout, etc.
}

export function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }))
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = allPosts.find((p) => p.slug === params.slug)
  if (!post) return notFound()

  const Layout =
    layouts[post.layout as keyof typeof layouts] ?? layouts.default

  return (
    <Layout>
      <Mdx code={post.body.code} />
    </Layout>
  )
}
```

You’ll likely customize the layout, metadata (`generateMetadata`), and structure around the MDX render.

---

## 7. Images strategy (minimal)

High‑level options:

1. **Static files alongside MDX:**
   - Keep images in the same folder as the MDX file.
   - Import them in MDX or pass paths to components:

   ```mdx
   import hero from './hero.jpg'

   <Hero image={hero} />
   ```

2. **Public folder paths:**
   - Put images under `public/` and reference them as `/images/...`.

For a solo blog, static file imports + `next/image` is usually enough. You’ll need to align with whatever image setup you already have.

---

## 8. Global layout / header (code, not CMS)

Keep structural components in code. Example config file:

```ts
// site.config.ts
export const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
]
```

Use in `app/layout.tsx` or your root layout component:

```tsx
import { NAV_ITEMS } from '@/site.config'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
        </header>
        {children}
      </body>
    </html>
  )
}
```

You’ll adapt this to your actual layout tree and styling.

---

## 9. Replace Sanity usage with Contentlayer docs

Anywhere you previously did something like:

```ts
const posts = await client.fetch('*[_type == "post"]{ ... }')
```

Refactor to use the generated collections:

```ts
import { allPosts } from 'contentlayer/generated'

const posts = allPosts
```

Or for single pages:

```ts
import { allPages } from 'contentlayer/generated'

const aboutPage = allPages.find((p) => p.slug === 'about')
```

You’ll need to adapt each usage based on how much structure you had in Sanity. This step is inherently project‑specific.

---

## 10. Sanity cleanup

Once you’ve migrated relevant views:

- Remove any leftover `sanity` imports and utilities.
- Optionally delete the old Studio repo/folder.
- Remove build/deploy hooks that referenced Sanity (webhooks, rebuild triggers, etc.).

---

## 11. What you still need to adapt

This outline **won’t drop in 1:1**. Expect to adjust:

- Paths and file names (`app/` vs `pages/`, your project’s folder structure).
- TypeScript types and props (e.g. what your `Layout`/`Hero` components expect).
- Route structure (`/blog/[slug]` vs `/posts/[slug]`, etc.).
- Any places where Sanity content had fields that you haven’t mirrored in MDX frontmatter.

Use this as a **scaffold** and then wire it into your actual components and design system step by step.

