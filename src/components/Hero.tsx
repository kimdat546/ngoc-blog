'use client';

import { useState, useEffect } from 'react';

interface Spirit {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

export default function Hero() {
  const [spirits, setSpirits] = useState<Spirit[]>([]);

  useEffect(() => {
    const generateSpirits = (): Spirit[] => {
      return Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 4 + Math.random() * 2
      }));
    };
    setSpirits(generateSpirits());
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url(/images/hero-image.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-forest/20"></div>

      {/* Floating Forest Spirits */}
      <div className="absolute inset-0">
        {spirits.map((spirit) => (
          <div
            key={spirit.id}
            className="spirit-orb absolute animate-float"
            style={{
              left: `${spirit.x}%`,
              top: `${spirit.y}%`,
              animationDelay: `${spirit.delay}s`,
              animationDuration: `${spirit.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-20 text-center max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-6 sm:mb-8 flex justify-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-moss rounded-full flex items-center justify-center animate-float">
            <div className="icon-sparkles !text-2xl sm:!text-3xl text-white"></div>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-lg">
          Welcome to My
          <span className="block text-cream">Forest Blog</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md px-4">
          Join me on a journey through nature-inspired stories, personal
          adventures, and articles about the magical connections between life
          and the natural world.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
          <button
            onClick={() => scrollToSection("blog")}
            className="btn-forest text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
          >
            <div className="flex items-center justify-center space-x-2">
              <span>Read My Stories</span>
              <div className="icon-arrow-right text-base sm:text-lg"></div>
            </div>
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-moss border-2 border-moss text-white hover:border-white rounded-full transition-all duration-300"
          >
            About Me
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="icon-chevron-down text-2xl text-sage"></div>
      </div>
    </section>
  );
}
