'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

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

        <Link href="/posts" className="btn-forest">
          All Posts
        </Link>
      </nav>
    </header>
  );
}
