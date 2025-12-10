# 🌲 My Forest Blog

A beautiful, nature-inspired personal blog website for sharing stories, articles, and adventures about the magical connections between life and the natural world. This blog was lovingly created as a gift for a dear friend to share her nature-inspired writings and experiences.

🌐 **Live Site:** [ngocmyforestblog.vercel.app](https://ngocmyforestblog.vercel.app/)

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css)
![Contentful](https://img.shields.io/badge/Contentful-CMS-2478CC?style=flat-square&logo=contentful)

## ✨ About the Blog

> *"Join me on a journey through nature-inspired stories, personal adventures, and articles about the magical connections between life and the natural world."*

This blog is a creative space for a passionate nature writer and storyteller who finds inspiration in:
- 🌿 The quiet whispers of the forest
- ✨ The gentle magic that surrounds us in nature
- 🎬 The enchanting worlds of Studio Ghibli
- 🌳 The wisdom found in ancient forests

## 🎯 Features

- **📖 Story Sharing** - Nature-inspired stories and personal narratives
- **📝 Articles** - Thoughtful writings about life and nature
- **🏔️ Adventures** - Documented experiences and explorations
- **🎨 Forest-Themed Design** - Beautiful earthy aesthetics with warm, magical vibes
- **📱 Fully Responsive** - Looks great on all devices
- **⚡ Fast Performance** - Built with Next.js 15 and Turbopack
- **🖋️ Contentful CMS** - Easy content management
- **🌿 Studio Ghibli Inspired** - Magical and whimsical design touches

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **React 19** | UI library |
| **TypeScript** | Type-safe development |
| **Tailwind CSS v4** | Styling and design system |
| **Contentful** | Headless CMS for blog content |
| **Turbopack** | Fast development builds |
| **React Icons** | Icon library |
| **Lucide Icons** | Additional icon set (via CDN) |

## 📁 Project Structure

```
ngoc-blog/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Homepage
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── globals.css         # Global styles & design tokens
│   │   ├── post/[id]/          # Dynamic blog post pages
│   │   └── posts/              # Blog posts listing page
│   ├── components/             # Reusable React components
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Hero.tsx            # Hero section
│   │   ├── About.tsx           # About section
│   │   ├── BlogPosts.tsx       # Blog posts grid
│   │   ├── Contact.tsx         # Contact section
│   │   └── Footer.tsx          # Site footer
│   └── lib/                    # Utilities and data
│       ├── blogData.ts         # Blog data fetching functions
│       ├── categoryData.ts     # Category definitions
│       └── contentful.ts       # Contentful client setup
├── public/                     # Static assets
│   └── images/                 # Image assets
├── .env.example                # Environment variables template
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager
- Contentful account with configured space

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kimdat546/ngoc-blog.git
   cd ngoc-blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Copy the example environment file and configure your Contentful credentials:
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your Contentful Space ID and Access Token.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the blog!

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm start` | Start production server |

## 🎨 Design System

The blog uses a carefully crafted **forest-inspired color palette**:

- **Forest greens** - Primary accent colors
- **Warm whites** - Clean backgrounds
- **Moss and sage tones** - Secondary accents
- **Earthy gradients** - Natural, magical feel

### Custom Components

- `.btn-forest` - Forest-themed buttons with hover effects
- `.floating-card` - Elegant cards with shadow and hover animations
- `.container` - Responsive content container

## 📄 Content Management

Blog content is managed through **Contentful CMS**:

### Content Types

- **Blog Post** - Main content with title, slug, excerpt, content, category, publish date, read time, and featured image
- **Category** - Post categories (Story, Article, Adventure)

### Features

- Rich text content support
- Category-based organization
- Featured posts
- Automatic read time calculation
- Responsive images from Contentful

## 🌐 Deployment

The blog is deployed on [Vercel](https://vercel.com):

**Live URL:** [https://ngocmyforestblog.vercel.app/](https://ngocmyforestblog.vercel.app/)

To deploy your own:
1. Push your code to GitHub
2. Import your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

## 💝 Made with Love

This blog was created as a special gift for a dear friend - a magical space where she can share her nature-inspired stories, adventures, and thoughts with the world. Every design choice was made with care to create a warm, enchanting atmosphere that reflects her love for nature, storytelling, and the magical worlds of Studio Ghibli.

---

<p align="center">
  🌲 Built with ❤️ using Next.js and Contentful 🌲<br>
  <em>"Where the ancient trees whisper"</em>
</p>
