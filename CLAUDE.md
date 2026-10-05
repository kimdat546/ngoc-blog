# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal nature-themed blog ("My Forest Blog") built with Next.js 15 (App Router), React 19, TypeScript, and Tailwind CSS v4. Content is sourced from Contentful CMS; comments live in Cloudflare D1 behind a Worker. Deployed on Vercel at https://ngocmyforestblog.vercel.app/.

## Development Commands

- `npm run dev` — Next dev server with Turbopack (http://localhost:3000)
- `npm run build` — Production build with Turbopack
- `npm start` — Run production server

No test runner, linter, or formatter is configured in `package.json`.

Comments Worker (run from `workers/comments/`, uses the globally available `npx wrangler`):

- `npx wrangler deploy` — deploy the Worker
- `npx wrangler d1 migrations apply ngoc-blog-comments --remote` — apply SQL in `migrations/`
- `npx wrangler secret put <NAME>` — set `API_SECRET` / `TURNSTILE_SECRET`
- `npx wrangler types` — regenerate `worker-configuration.d.ts` after changing `wrangler.jsonc`

## Environment

Copy `.env.example` → `.env.local`. Variables (also needed in Vercel):

- `NEXT_PUBLIC_CONTENTFUL_SPACE_ID`, `NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN` — read in `src/lib/contentful.ts`. Without them, all data fetches return empty arrays (errors are caught and logged, not thrown).
- `RESEND_API_KEY`, `CONTACT_EMAIL_TO` — emails for the contact form and new-comment notifications.
- `COMMENTS_API_URL`, `COMMENTS_API_SECRET` — server-only; where the comments Worker lives and the shared bearer secret (must equal the Worker's `API_SECRET`).
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — Cloudflare Turnstile widget on the comment form. If unset, the widget isn't rendered and comments can't be submitted.
- `NEXT_PUBLIC_SITE_URL` (optional) — defaults to the Vercel URL; used for `metadataBase` and links in emails.

## Architecture

### Content pipeline (Contentful → BlogPost)

All blog data flows through `src/lib/blogData.ts`, which wraps the Contentful Delivery client from `src/lib/contentful.ts`. Key points:

- Contentful content types: `blogPost` (fields: title, slug, excerpt [rich text], content [rich text], category [reference], publishDate, readTime, featuredImage) and `category` (name, slug, parent [reference to category], showInMenu, menuOrder).
- `transformContentfulPost()` flattens a Contentful entry into the local `BlogPost` interface. It keeps **both** the plain-text version (`excerpt`, `content` via `documentToPlainTextString`) and the original rich-text `Document` (`excerptRichText`, `contentRichText`) so pages can render either.
- Featured image URLs come back protocol-relative from Contentful; the transform prepends `https:`.
- `featured` is currently hardcoded to `false` — there is no "featured" field in the CMS yet. `getFeaturedPosts()` just returns the 3 most recent posts.
- All fetch helpers swallow errors and return `[]`/`null` rather than throwing. Callers don't need try/catch but also won't distinguish "no posts" from "Contentful is down."
- Categories (`src/lib/categoryData.ts`) are parent/child. `getMenuCategories()` returns top-level categories with `showInMenu`, sorted by `menuOrder`; `Header` loads them client-side.

When rendering post bodies, prefer the `*RichText` fields with `@contentful/rich-text-react-renderer`, not the plain-text strings. The post page's renderer handles embedded Contentful video (`ScrollAutoplayVideo`) / audio and turns bare YouTube links (link text == URL) into `YouTubeEmbed`.

### Routing

- `/` — composed in `src/app/page.tsx` from `Header`, `Hero`, `About`, `BlogPosts`, `Contact`, `Footer`. `BlogPosts` and `/posts` fetch Contentful client-side.
- `/posts` — full post listing with search (title, excerpt, content).
- `/post/[slug]` — post detail, looked up with `getPostBySlug`. Legacy `/post/<contentful sys.id>` URLs (22-char base62) are 308-redirected to the slug URL. Has `generateMetadata` for SEO/OG and appends `PostDisclaimer` + `CommentSection`.
- `/category/[slug]` — posts in the category and all its child categories.
- `/api/contact` — POST, sends the contact form via Resend (honeypot field `website`).
- `/api/comments` — GET list / POST create; proxies to the comments Worker.

### Comments (Cloudflare Worker + D1 + Turnstile)

```
CommentForm (Turnstile token) → /api/comments (Next, validates + hashes IP) → Worker (bearer auth, verifies Turnstile) → D1
```

- Worker code: `workers/comments/` (`src/index.ts`, `wrangler.jsonc`, `migrations/`). It is excluded from the root `tsconfig.json`; typecheck it with `npx -p typescript tsc -p workers/comments`.
- Only the Next server calls the Worker (`src/lib/comments.ts`); the API secret never reaches the browser. The Worker returns `403 {error: "turnstile_failed"}` for bad tokens, which the route maps to a Vietnamese message.
- Turnstile tokens are single-use — `CommentForm` resets the widget after every submit. Widget domains: `ngocmyforestblog.vercel.app`, `localhost`. A new production domain must be added to the widget in the Cloudflare dashboard.
- After a comment is saved, the route emails the author via Resend (best-effort).

### Image galleries

`src/lib/gallery.ts` + `src/components/gallery/` (Swiper, react-photo-album, yet-another-react-lightbox):

- **Auto-grouping:** `groupConsecutiveImages()` runs on `contentRichText` before rendering. Runs of 2+ consecutive top-level image assets (empty paragraphs between them ignored) become a synthetic `imageGallery` embedded entry: 2–5 images → `grid`, 6+ → `carousel`. Single images render as before.
- **Gallery entries:** Contentful content type `imageGallery` (fields: `title` short text, `images` media many, `layout` one of `carousel` / `grid` / `slideshow`) can be embedded in a post's rich text. `getPostBySlug` / `getPostById` use `include: 3` so the gallery's assets are resolved.
- All layouts open a fullscreen lightbox (zoom, counter, captions = asset title/description). Image URLs go through the Contentful Images API (`contentfulImageUrl`, webp, sized per use; GIFs untouched).

### Post body rendering & content blocks

`src/components/PostContent.tsx` renders `contentRichText` (the excerpt is still rendered inline in the post page). It styles all built-in nodes/marks (H1–H6, tables, hr → `Divider`, code/strike/sup/sub, entry & asset hyperlinks) and these embedded entry types:

- `imageGallery` — see "Image galleries".
- `callout` — `title` (short text, optional), `body` (rich text), `variant`: `note` | `leaf` | `heart` | `important`.
- `divider` — `variant`: `leaf` | `flower` | `sparkle` | `dots` | `line`.
- `styledText` — `body` (rich text), `color`: `forest` | `moss` | `sage` | `brown` | `golden` | `rose`; `font`: `serif` | `handwriting` | `notebook` | `elegant` | `sans` (next/font, Vietnamese subsets, `src/components/blocks/fonts.ts`); `align`: `left` | `center` | `right`; `size`: `small` | `normal` | `large`.

**Inline colour syntax** (`src/lib/textColor.tsx`, wired as `renderText` for post content + excerpt): `(chữ)[hồng]` text colour, `(chữ)[nền vàng]` highlight, `(chữ)[đỏ, nền vàng]` both, `(chữ)[#8a3ffc]` hex. Names are Vietnamese with unaccented/English aliases; unknown specs are left as literal text. `stripColorSyntax` removes the syntax from the plain-text `excerpt`/`content` (search, cards, meta). It only matches within one text node, so partially-bold phrases won't colour.

Apart from that, Contentful rich text has no inline colour/font marks; per-passage styling only works through `styledText`. Unknown/missing option values fall back to defaults. Nested rich text in blocks reuses the same render options.

### Styling

Tailwind CSS v4 via `@tailwindcss/postcss`. Custom utility classes live in `src/app/globals.css`:

- `.btn-forest`, `.floating-card`, `.container`

Color palette (forest/moss/sage/cream/warm-white/soft-brown/golden) is declared in the `@theme` block of `globals.css`, so Tailwind generates the utilities and variants (`hover:bg-moss`, `bg-sage/20`, `text-forest/80`…). Don't hand-write color utilities like `.bg-moss {}` — Tailwind won't generate variants for them. The `:root` vars (`--moss-green` etc.) duplicate the same hex values for the hand-written component CSS; keep both in sync. Lucide icons are loaded via a CDN CSS import in `layout.tsx`; React Icons is also available as an npm dependency.

### Path aliases

`@/*` → `src/*` (see `tsconfig.json`).

## Notes for Future Changes

- Adding a real "featured" flag requires a new boolean field in Contentful **and** updating `transformContentfulPost` + `getFeaturedPosts`.
- `transformContentfulPost` uses `any` for the entry argument — tighten this if you touch it, but be aware the `ContentfulBlogPost` skeleton type is already defined nearby.
- The repo was hit by the PolinRider supply-chain malware (see `SECURITY-NOTICE.md`). Be suspicious of unexpected code appended to config files.
