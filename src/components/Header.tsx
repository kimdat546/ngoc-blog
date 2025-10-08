'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-moss rounded-full flex items-center justify-center">
            <div className="icon-leaf text-lg text-white"></div>
          </div>
          <span className="text-xl font-bold text-forest">My Forest Blog</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => scrollToSection('hero')}
            className="text-forest hover:text-moss transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="text-forest hover:text-moss transition-colors"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('blog')}
            className="text-forest hover:text-moss transition-colors"
          >
            Blog
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="text-forest hover:text-moss transition-colors"
          >
            Contact
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`md:hidden ${isScrolled ? 'text-forest' : 'text-white'}`}
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
