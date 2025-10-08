export default function About() {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 bg-warm-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-forest mb-4 sm:mb-6">About Me</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-forest mb-3 sm:mb-4">
                Nature Writer & Storyteller
              </h3>

              <p className="text-base sm:text-lg text-sage leading-relaxed">
                Hello! I'm a passionate writer who finds inspiration in the quiet whispers of
                the forest and the gentle magic that surrounds us in nature. My blog is where
                I share stories, articles, and adventures that celebrate the connection between
                our inner world and the natural environment.
              </p>

              <p className="text-base sm:text-lg text-sage leading-relaxed">
                Influenced by the enchanting worlds of Studio Ghibli and the wisdom found in
                ancient forests, I write about personal experiences, nature observations, and
                the small magical moments that make life extraordinary.
              </p>

              <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6">
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-sage text-white rounded-full text-xs sm:text-sm">Nature Writing</span>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-moss text-white rounded-full text-xs sm:text-sm">Storytelling</span>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-forest text-white rounded-full text-xs sm:text-sm">Photography</span>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-sage text-white rounded-full text-xs sm:text-sm">Forest Bathing</span>
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0 mb-20 lg:mb-0">
              <div className="floating-card p-6 sm:p-8 text-center">
                <div className="text-3xl sm:text-4xl text-sage mb-3 sm:mb-4">"</div>
                <blockquote className="text-base sm:text-lg text-forest italic mb-3 sm:mb-4">
                  "In every walk with nature, one receives far more than they seek.
                  Through writing, I share these gifts with fellow wanderers."
                </blockquote>
                <div className="w-10 sm:w-12 h-1 bg-moss mx-auto"></div>
              </div>
              <img
                src="/images/chibi.png"
                alt="Forest Spirit"
                className="absolute -bottom-12 sm:-bottom-16 -right-2 sm:-right-12 w-24 h-24 sm:w-32 sm:h-32 animate-float drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
