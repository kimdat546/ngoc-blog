export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  featured: boolean;
  image: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "Morning Mist and Forest Spirits",
    excerpt: "A magical encounter during an early morning walk through the ancient oak grove...",
    content: "Today I experienced something truly magical. As the first rays of sunlight pierced through the morning mist, I found myself walking through the ancient oak grove near my home. The air was thick with mystery, and every step seemed to awaken the forest spirits that dwelt within.\n\nI had set out before dawn, drawn by an inexplicable urge to witness the forest's awakening. The path was familiar, yet in the pre-dawn darkness, it felt like stepping into another world. As I walked deeper into the grove, the mist began to swirl around my feet, and I noticed small orbs of light dancing between the trees.\n\nAt first, I thought they were fireflies, but as I drew closer, I realized these lights moved with purpose and intelligence. They seemed to be leading me somewhere, beckoning me to follow. Without hesitation, I let them guide me off the beaten path to a clearing I had never seen before.\n\nIn the center of the clearing stood the most magnificent oak tree I had ever encountered. Its trunk was so wide that it would take at least six people holding hands to encircle it. The spirit lights danced around its base, and as the first rays of sunlight broke through the canopy, they slowly faded away, leaving me alone with this ancient guardian.\n\nI spent the next hour in quiet communion with this tree, feeling a profound sense of connection to something much larger than myself. It was a reminder that magic still exists in our world, we just need to be open to seeing it.",
    category: "Story",
    date: "2025-01-15",
    readTime: "5 min read",
    featured: true,
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "The Art of Forest Bathing",
    excerpt: "Discovering the Japanese practice of Shinrin-yoku and its profound impact on well-being...",
    content: "Forest bathing, or Shinrin-yoku in Japanese, is more than just a walk in the woods. It's a practice of mindful immersion in nature that has transformed my understanding of wellness and connection.\n\nThe concept is beautifully simple: spend time in a forest environment, engaging all your senses while being present and mindful. No hiking boots required, no fitness goals to meet – just you, the trees, and the healing power of nature.\n\nDuring my first forest bathing session, I was skeptical. How could simply sitting among trees be therapeutic? But as I settled into the practice, something shifted. The constant chatter in my mind began to quiet. I became acutely aware of the subtle sounds around me – the whisper of leaves, the distant call of birds, the gentle creaking of branches.\n\nScientific research supports what I experienced that day. Studies show that forest bathing can reduce stress hormones, boost immune function, and improve overall mood. The trees themselves release compounds called phytoncides, which have antimicrobial properties and may enhance our natural killer cell activity.\n\nWhat started as curiosity has become a weekly ritual. Every Sunday morning, I make my way to the local woodland, not to conquer trails or reach destinations, but simply to be. It's become my church, my meditation, my reset button for the week ahead.",
    category: "Article",
    date: "2025-01-10",
    readTime: "7 min read",
    featured: true,
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "My Journey to the Hidden Waterfall",
    excerpt: "An adventure through unmarked trails led to a discovery that changed everything...",
    content: "Last weekend's hiking adventure took an unexpected turn when I decided to venture off the marked trail. What I discovered was a hidden waterfall that seemed straight out of a Miyazaki film.\n\nI had been following the main trail for about two hours when I heard it – the distant sound of rushing water. The trail map showed no water features in this area, which made me curious. Following the sound, I pushed through a thicket of ferns and found myself on a barely visible deer path.\n\nThe path wound downward through increasingly lush vegetation. Moss-covered boulders became more frequent, and the air grew cooler and more humid. After twenty minutes of careful navigation, I emerged into a hidden valley that took my breath away.\n\nA crystal-clear waterfall cascaded down a 30-foot rock face into a emerald pool below. The entire scene was framed by ancient ferns and draped with flowering vines. Butterflies danced in the mist, and the sound of falling water created a natural symphony that seemed to wash away all my worldly concerns.\n\nI spent the afternoon at this secret oasis, sketching in my journal and simply absorbing the magic of this untouched place. It reminded me that there are still mysteries to discover, still places where nature reigns supreme and humans are merely visitors.\n\nBefore leaving, I carefully marked my route on my phone, but I've decided to keep this location to myself. Some places are too precious to share widely – they need to remain sanctuaries for those patient enough to seek them out.",
    category: "Adventure",
    date: "2025-01-05",
    readTime: "4 min read",
    featured: false,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "Lessons from Ancient Trees",
    excerpt: "What centuries-old oaks taught me about patience, growth, and resilience...",
    content: "Standing beneath the canopy of a 400-year-old oak tree, I couldn't help but reflect on the lessons these ancient beings offer us about time, patience, and the cycles of life.\n\nThis particular oak has witnessed four centuries of human history. It was already mature when my great-great-grandparents were born. It has weathered countless storms, droughts, and seasons, growing stronger and more magnificent with each passing year.\n\nWhat strikes me most about ancient trees is their patience. They don't rush their growth or compete aggressively for space. They simply persist, adapting to changing conditions while remaining fundamentally themselves. Their root systems extend far beyond what we see above ground, creating networks of support and communication with other trees.\n\nIn our fast-paced world, there's profound wisdom in the oak's approach to existence. Growth doesn't always have to be visible or dramatic. Sometimes the most important development happens slowly, underground, building the foundation for future strength.\n\nI've started visiting this oak regularly, not just to admire its majesty, but to practice its patience. In a culture obsessed with instant results and rapid progress, the oak reminds me that the most meaningful achievements often take time to mature.\n\nThe tree also teaches resilience. Its bark bears scars from lightning strikes and storms, yet it continues to thrive. These marks aren't weaknesses – they're evidence of survival, adaptation, and continued growth despite adversity.\n\nPerhaps most importantly, the oak demonstrates the power of rootedness. In our increasingly mobile and digital world, there's something profound about a being that has remained in one place for centuries, becoming a pillar of stability for the entire ecosystem around it.",
    category: "Article",
    date: "2024-12-28",
    readTime: "6 min read",
    featured: false,
    image: "https://images.unsplash.com/photo-1574935182877-d45bb9df92ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

export const getBlogPosts = (): BlogPost[] => BLOG_POSTS;
export const getFeaturedPosts = (): BlogPost[] => BLOG_POSTS.filter(post => post.featured);
export const getPostsByCategory = (category: string): BlogPost[] => BLOG_POSTS.filter(post => post.category === category);
export const getPostById = (id: number): BlogPost | undefined => BLOG_POSTS.find(post => post.id === id);