# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal nature-themed blog ("My Forest Blog") built with Next.js 15 (App Router), React 19, TypeScript, and Tailwind CSS v4. Content is sourced from Contentful CMS. Deployed on Vercel at https://ngocmyforestblog.vercel.app/.

## Development Commands

- `npm run dev` — Next dev server with Turbopack (http://localhost:3000)
- `npm run build` — Production build with Turbopack
- `npm start` — Run production server

No test runner, linter, or formatter is configured in `package.json`.

## Environment

Contentful credentials are required at build/runtime. Copy `.env.example` → `.env` and set:

- `NEXT_PUBLIC_CONTENTFUL_SPACE_ID`
- `NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN`

These are read in `src/lib/contentful.ts`. Without them, all data fetches return empty arrays (errors are caught and logged, not thrown).

## Architecture

### Content pipeline (Contentful → BlogPost)

All blog data flows through `src/lib/blogData.ts`, which wraps the Contentful Delivery client from `src/lib/contentful.ts`. Key points:

- Contentful content types: `blogPost` (fields: title, slug, excerpt [rich text], content [rich text], category [reference], publishDate, readTime, featuredImage) and `category` (name, slug).
- `transformContentfulPost()` flattens a Contentful entry into the local `BlogPost` interface. It keeps **both** the plain-text version (`excerpt`, `content` via `documentToPlainTextString`) and the original rich-text `Document` (`excerptRichText`, `contentRichText`) so pages can render either.
- Featured image URLs come back protocol-relative from Contentful; the transform prepends `https:`.
- `featured` is currently hardcoded to `false` — there is no "featured" field in the CMS yet. `getFeaturedPosts()` just returns the 3 most recent posts.
- All fetch helpers (`getBlogPosts`, `getFeaturedPosts`, `getPostsByCategory`, `getPostById`) swallow errors and return `[]`/`null` rather than throwing. Callers don't need try/catch but also won't distinguish "no posts" from "Contentful is down."

When rendering post bodies, prefer the `*RichText` fields with `@contentful/rich-text-react-renderer`, not the plain-text strings.

### Routing

- `/` — composed in `src/app/page.tsx` from `Header`, `Hero`, `About`, `BlogPosts`, `Contact`, `Footer`.
- `/posts` — full post listing.
- `/post/[id]` — dynamic post detail page; `[id]` is the Contentful entry `sys.id` (passed to `getPostById`), **not** the slug. Keep this in mind when building links — see `BlogPost.id` vs `BlogPost.slug`.

### Styling

Tailwind CSS v4 via `@tailwindcss/postcss`. Custom utility classes live in `src/app/globals.css`:

- `.btn-forest`, `.floating-card`, `.container`

Color palette is forest/moss/sage/warm-white. Lucide icons are loaded via a CDN CSS import in `layout.tsx`; React Icons is also available as an npm dependency.

### Path aliases

`@/*` → `src/*` (see `tsconfig.json`).

## Notes for Future Changes

- Adding a real "featured" flag requires a new boolean field in Contentful **and** updating `transformContentfulPost` + `getFeaturedPosts`.
- If you switch `/post/[id]` to slug-based routing, also update every place that builds post URLs and the `getPostById` call site.
- `transformContentfulPost` uses `any` for the entry argument — tighten this if you touch it, but be aware the `ContentfulBlogPost` skeleton type is already defined nearby.
