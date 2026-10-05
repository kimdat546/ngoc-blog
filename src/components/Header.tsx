'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { FiChevronDown } from 'react-icons/fi';
import { getMenuCategories, type MenuCategory } from '@/lib/categoryData';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    getMenuCategories().then(setMenuCategories);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Handle scrolling to section when page loads with hash
    if (pathname === '/' && window.location.hash) {
      const sectionId = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [pathname]);

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);

    // If not on homepage, navigate to homepage first
    if (pathname !== '/') {
      router.push(`/#${sectionId}`);
      return;
    }

    // If on homepage, scroll to section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isHome = pathname === '/';
  const isTransparent = isHome && !isScrolled;
  const textClass = isTransparent
    ? 'text-white [text-shadow:0_2px_6px_rgba(0,0,0,0.8)]'
    : 'text-forest';
  // Over the hero artwork, colour changes get lost, so hover underlines instead.
  const hoverClass = isTransparent
    ? 'hover:underline underline-offset-8 decoration-1 decoration-white/70'
    : 'hover:text-moss';
  // Dropdown: frosted dark glass over the hero, solid white panel elsewhere.
  const dropdownPanelClass = isTransparent
    ? 'bg-forest/60 backdrop-blur-md border border-white/15 shadow-xl'
    : 'bg-white/95 backdrop-blur-sm border border-sage/20 shadow-lg';
  const dropdownItemClass = isTransparent
    ? 'text-white/90 hover:bg-white/10 hover:text-white'
    : 'text-forest hover:bg-cream hover:text-moss';
  const dropdownDividerClass = isTransparent ? 'bg-white/15' : 'bg-sage/20';

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isTransparent
          ? 'bg-gradient-to-b from-black/50 via-black/25 to-transparent'
          : 'bg-white/90 backdrop-blur-sm shadow-lg'
      }`}
    >
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.svg"
            alt="Forest Blog Logo"
            width={40}
            height={40}
            className={`w-10 h-10 ${isTransparent ? 'drop-shadow-md' : ''}`}
          />
          <span className={`text-xl font-bold ${textClass}`}>My Forest Blog</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <button
            onClick={() => scrollToSection('hero')}
            className={`${textClass} ${hoverClass} transition-colors cursor-pointer`}
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className={`${textClass} ${hoverClass} transition-colors cursor-pointer`}
          >
            About
          </button>
          {menuCategories.map((cat) =>
            cat.children.length === 0 ? (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`${textClass} ${hoverClass} transition-colors cursor-pointer whitespace-nowrap`}
              >
                {cat.name}
              </Link>
            ) : (
              <div key={cat.id} className="relative group">
                <Link
                  href={`/category/${cat.slug}`}
                  aria-haspopup="true"
                  className={`${textClass} ${hoverClass} transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-1`}
                >
                  {cat.name}
                  <FiChevronDown className="text-sm transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
                </Link>
                {/* pt-3 bridges the gap so the menu doesn't close while moving the mouse down */}
                <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3 invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-200">
                  <div className={`min-w-48 rounded-xl py-2 transition-colors ${dropdownPanelClass}`}>
                    <Link
                      href={`/category/${cat.slug}`}
                      className={`block px-4 py-2 text-sm whitespace-nowrap transition-colors ${dropdownItemClass}`}
                    >
                      Tất cả bài viết
                    </Link>
                    <div className={`my-1 mx-4 h-px ${dropdownDividerClass}`} />
                    {cat.children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/category/${child.slug}`}
                        className={`block px-4 py-2 text-sm whitespace-nowrap transition-colors ${dropdownItemClass}`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )
          )}
          <button
            onClick={() => scrollToSection('blog')}
            className={`${textClass} ${hoverClass} transition-colors cursor-pointer`}
          >
            Blog
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className={`${textClass} ${hoverClass} transition-colors cursor-pointer`}
          >
            Contact
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`md:hidden ${textClass}`}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <Link href="/posts" className="hidden md:inline-block btn-forest">
          All Posts
        </Link>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm shadow-lg">
          <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-forest hover:text-moss transition-colors text-left"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-forest hover:text-moss transition-colors text-left"
            >
              About
            </button>
            {menuCategories.map((cat) => (
              <div key={cat.id} className="flex flex-col space-y-3">
                <Link
                  href={`/category/${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-forest hover:text-moss transition-colors text-left"
                >
                  {cat.name}
                </Link>
                {cat.children.length > 0 && (
                  <div className="flex flex-col space-y-3 pl-4 border-l border-sage/30">
                    {cat.children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/category/${child.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-sm text-forest/80 hover:text-moss transition-colors text-left"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={() => scrollToSection('blog')}
              className="text-forest hover:text-moss transition-colors text-left"
            >
              Blog
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-forest hover:text-moss transition-colors text-left"
            >
              Contact
            </button>
            <Link href="/posts" className="btn-forest text-center" onClick={() => setIsMobileMenuOpen(false)}>
              All Posts
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
