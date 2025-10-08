export default function About() {
  return (
    <section id="about" className="py-20 bg-warm-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-forest mb-6">About Me</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-forest mb-4">
                Nature Writer & Storyteller
              </h3>

              <p className="text-lg text-sage leading-relaxed">
                Hello! I'm a passionate writer who finds inspiration in the quiet whispers of
                the forest and the gentle magic that surrounds us in nature. My blog is where
                I share stories, articles, and adventures that celebrate the connection between
                our inner world and the natural environment.
              </p>

              <p className="text-lg text-sage leading-relaxed">
                Influenced by the enchanting worlds of Studio Ghibli and the wisdom found in
                ancient forests, I write about personal experiences, nature observations, and
                the small magical moments that make life extraordinary.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <span className="px-4 py-2 bg-sage text-white rounded-full text-sm">Nature Writing</span>
                <span className="px-4 py-2 bg-moss text-white rounded-full text-sm">Storytelling</span>
                <span className="px-4 py-2 bg-forest text-white rounded-full text-sm">Photography</span>
                <span className="px-4 py-2 bg-sage text-white rounded-full text-sm">Forest Bathing</span>
              </div>
            </div>

            <div className="relative">
              <div className="floating-card p-8 text-center">
                <div className="text-4xl text-sage mb-4">"</div>
                <blockquote className="text-lg text-forest italic mb-4">
                  "In every walk with nature, one receives far more than they seek.
                  Through writing, I share these gifts with fellow wanderers."
                </blockquote>
                <div className="w-12 h-1 bg-moss mx-auto"></div>
              </div>
              <img
                src="/images/chibi.png"
                alt="Forest Spirit"
                className="absolute -bottom-16 -right-12 w-32 h-32 "
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
