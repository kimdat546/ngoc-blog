# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog built with Next.js 15, React 19, and Tailwind CSS v4. The blog focuses on nature-inspired stories, articles, and adventures with a forest/nature theme.

## Development Commands

- `npm run dev` - Start development server with Turbopack (runs on http://localhost:3000)
- `npm run build` - Build production version with Turbopack
- `npm start` - Start production server

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **UI**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: React Icons + Lucide CSS (via CDN)
- **Build Tool**: Turbopack

### Project Structure
- `src/app/` - Next.js App Router pages
  - `page.tsx` - Homepage with component composition
  - `layout.tsx` - Root layout with metadata and global styles
  - `post/[id]/page.tsx` - Dynamic blog post pages
  - `posts/page.tsx` - Blog posts listing page
- `src/components/` - Reusable React components (Header, Hero, About, BlogPosts, Contact, Footer)
- `src/lib/blogData.ts` - Blog data management and utilities
- `public/images/` - Static assets

### Blog Data System
Blog posts are managed in `src/lib/blogData.ts` as a TypeScript array with the following structure:
- Static data with predefined blog posts
- Categories: Story, Article, Adventure
- Features: excerpt, full content, featured posts, read time, images from Unsplash
- Utility functions: `getBlogPosts()`, `getFeaturedPosts()`, `getPostsByCategory()`, `getPostById()`

### Styling System
- Uses Tailwind CSS v4 with custom color palette
- Custom CSS classes defined in `globals.css`:
  - `.btn-forest` - Primary forest-themed button
  - `.floating-card` - Card component with hover effects
  - `.container` - Responsive container
- Color scheme: forest greens, warm whites, moss, sage tones

### Component Architecture
- Modular component structure with clear separation of concerns
- Components are primarily functional with minimal state
- Uses Next.js Image optimization where applicable
- External CDN for Lucide icons via CSS import in layout

### Routing
- Static homepage (`/`) with component composition
- Dynamic blog post pages (`/post/[id]`)
- Posts listing page (`/posts`)
- Client-side navigation with Next.js Link component

### Development Notes
- Project uses absolute imports with `@/` alias for src directory
- All components are in TypeScript with proper type definitions
- Blog post content supports basic paragraph formatting (split by `\n\n`)
- Images sourced from Unsplash with responsive aspect ratios