export default function Footer() {
  return (
    <footer className="bg-forest text-white py-12 relative">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-sage rounded-full flex items-center justify-center">
                <div className="icon-leaf text-xl text-white"></div>
              </div>
              <span className="text-2xl font-bold">My Forest Blog</span>
            </div>
            <p className="opacity-80 max-w-md leading-relaxed">
              A personal blog sharing nature-inspired stories, adventures, and articles
              about the magical connections between life and the natural world.
            </p>
            <div className="flex space-x-4 mt-6">
              <div className="w-8 h-8 bg-sage rounded-full flex items-center justify-center hover:bg-moss transition-colors cursor-pointer">
                <div className="text-sm text-white">🐦</div>
              </div>
              <div className="w-8 h-8 bg-sage rounded-full flex items-center justify-center hover:bg-moss transition-colors cursor-pointer">
                <div className="text-sm text-white">📸</div>
              </div>
              <div className="w-8 h-8 bg-sage rounded-full flex items-center justify-center hover:bg-moss transition-colors cursor-pointer">
                <div className="text-sm text-white">📘</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 opacity-80">
              <li><a href="#" className="hover:text-sage transition-colors">Latest Stories</a></li>
              <li><a href="#" className="hover:text-sage transition-colors">Featured Tales</a></li>
              <li><a href="#" className="hover:text-sage transition-colors">Forest Wisdom</a></li>
              <li><a href="#" className="hover:text-sage transition-colors">Character Guide</a></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Community</h4>
            <ul className="space-y-2 opacity-80">
              <li><a href="#" className="hover:text-sage transition-colors">Join Us</a></li>
              <li><a href="#" className="hover:text-sage transition-colors">Reader Stories</a></li>
              <li><a href="#" className="hover:text-sage transition-colors">Events</a></li>
              <li><a href="#" className="hover:text-sage transition-colors">Newsletter</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-8 text-center opacity-80">
          <p>&copy; 2025 My Forest Blog. All rights reserved. Made with love for nature and storytelling.</p>
        </div>
      </div>

      {/* Floating spirits */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="spirit-orb absolute opacity-20 animate-float"
            style={{
              left: `${15 + (i * 15)}%`,
              top: `${30 + (i % 2) * 40}%`,
              animationDelay: `${i * 1}s`,
              animationDuration: `${5 + (i % 2)}s`
            }}
          />
        ))}
      </div>
    </footer>
  );
}