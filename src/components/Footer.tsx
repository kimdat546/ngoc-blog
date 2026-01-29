import { IoLogoInstagram } from "react-icons/io5";
import { LuFacebook, LuTwitter } from "react-icons/lu";

export default function Footer() {
  return (
    <footer className="bg-forest text-white py-8 sm:py-10 md:py-12 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-sage rounded-full flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <path fill="currentColor" d="M419.7,422.5h-16c-2,0-5.2-.9-7.7-1.2-33-3.8-63.3-17.5-87.8-40-20.2-18.5-33.5-38.7-46.5-62.8.4,8.8.8,16.7,0,25s-2.9,4.3-5.2,4.2-4.1-1.6-4.9-4.1c3.2-32.4-7.5-65.4-19-96.4l-9.2-4.5c-27.6,11.7-55.4,26.3-77,45.9-5.5,5.5-10.3,11-14,17.9-8.7,16.2-2.6,36.6,14.2,44.5,11.5,5.4,28.4-2.4,48.2,16.5,3.4,3.3,7.1,6.7,11.6,8.7,13.8,6,29.8.6,38.2-11.6,2-2.9,5-3.7,7.7-1.7s2.6,4.8.7,7.6c-10.1,14.2-27.6,21.5-44.7,16.9s-14.5-6.9-20.3-12.4c-17.6-16.8-31.3-7.6-46.3-15.1-22.2-11-29.7-38.5-17.3-59.7,10.5-17.9,28.5-30.5,45.7-41.9-22.8,4-43.9,7.6-65.2-.5s-29.2-24.9-26.1-44.3c1.6-10,6.2-18.7,13-26,6.6-7,10.3-15.3,10.7-25,.5-12,4.6-23,12.8-31.6,11.7-12.4,29-15.9,44.8-9.4,20.3,8.4,35.6,29.8,47.8,48.3-3.1-21.7-6.4-39.7-.8-60.5.7-3.5,3.5-5.5,6.5-4.6s4.4,4,3.3,7.4c-2.4,7.6-2.7,15.5-2.8,23.6,1.4,28.5,9.2,56.5,19.4,84l9.5,3.8c18.9-7.7,35.6-16.4,51.9-26.8s18.7-13,27-21c5.6-5.9,10.5-12,13.7-19.5,5.2-12.4,2.1-25.9-8.1-34.7-18.3-15.7-33.1-1.6-54.9-21.9-11.9-11.1-26.8-16.4-41.4-6.9s-5.2,1.5-7.1-.7-2.2-5,.1-6.7c7.8-5.7,17.5-8.3,27.3-7.7,25.4,1.7,25.5,23.9,53.2,25,12.4.5,23.8,5.4,32.3,14.1,11.6,12,14.2,28.9,7.6,44.1-9.2,20.5-29.1,34.2-47.8,47,22.1-3.4,47.1-7.2,67.4,1.9,15.1,6.8,24.3,21.1,23.8,37.8-.4,12.1-5.4,23-13.7,31.7-6.7,7.1-10.1,15.7-10.5,25.6s-5.3,23.6-14,32.1c-10.5,10.2-25,13.8-39,9.6-6.5-1.9-12.2-5.1-17.6-9.2s-12.2-11.7-19-18c9.8,19.3,22.2,36.2,37.2,51,20.8,20.6,46.5,34.1,75.3,39.4,10.9,2,21.1,2.6,32.1,3,2.3,0,4,2.9,3.9,4.9s-1.4,3.6-2.7,5ZM219.3,232.8l4.2-9.3c-7.7-19.1-16.8-36.1-27.2-52.8-6.2-9.3-12.4-17.9-20.2-25.8-6.1-5.9-12.4-11.1-20.2-14.2-12.1-4.9-25.2-2.1-33.9,7.7-5.9,6.7-9,15.1-9.4,24.1-.5,12.2-5,22.9-13.4,31.8-6.3,6.7-10.3,14.9-10.8,24.2s6.4,23.9,18.1,29c16.7,7.3,40,4.8,57.7,1.3s37-8.9,54.9-15.9ZM310,335.4c12.7,5.3,26.2,2,34.8-8.2,5.6-6.7,8.4-14.8,8.8-23.6s4.9-22.6,13.1-31.3c5.9-6.2,9.8-13.6,10.9-22.2,1.7-13.7-5.5-26-18.1-31.5-7.1-3.1-14.5-4.1-22.4-4.6-11.6-.2-22.5,1.1-34,3.1-19,3.9-37.1,8.8-56.3,16.3l-3.8,9.5c7.5,18.5,16.2,35.2,26.6,51.6,9.4,14.9,23.7,33.8,40.6,40.9Z"/>
                    <path fill="currentColor" d="M77.6,384.8v-3.4c1.6-2.5,3.5-3,6.5-3.7,4.9-1.2,9.6-6.1,10.4-11,.6-3.6,2.1-5.7,5.7-5.5,3.2.1,4.3,2.2,4.9,5.6.9,5,5.9,10.1,10.9,11.1s5.8,1.8,5.8,5.3-2.2,4.7-5.7,5.3c-5,.9-10.1,6-11,11-.6,3.6-2.1,5.8-5.5,5.7s-4.4-2.4-5.1-5.6c-1.4-6.7-7.8-11.5-14.3-11.9l-2.6-3ZM99.8,387.6l4.4-4.5-4.4-4.3-4.3,4.4,4.3,4.4Z"/>
                    <path fill="currentColor" d="M397.7,181.6c-.9,3.9-1.4,6.5-5.2,6.6s-4.7-2.6-5.5-6.4c-1.8-8.7-9.9-16.7-18.5-18.4s-6.2-1.6-6.2-5.3c0-4,2.8-4.5,6.4-5.3,8.7-1.8,16.6-9.9,18.4-18.5.7-3.6,1.4-6,4.9-6.2s5,2.4,5.7,6.1c1.7,9.2,10,16.6,18.7,19,3.8-.6,5.9,2,6,4.8.2,4.1-2.6,4.7-6.3,5.5-8.4,1.7-16.4,9.4-18.3,18.1ZM392.3,168.6c3.1-3.8,6.8-7.4,10.3-10.5-4.1-3.3-7.3-6.7-10.3-10.3-3.3,3.9-6.8,7.4-10.4,10.5,3.9,3.2,7.4,6.7,10.4,10.3Z"/>
                    <path fill="currentColor" d="M374,115.6c-.9,3.8-1.8,6.1-5.1,6.2s-5.1-2.2-5.8-5.9c-.9-4.8-5.8-9.7-10.6-10.7s-5.9-1.7-6-5c-.2-3.8,2.3-5,6-5.8s9.6-5.9,10.6-10.7,1.7-5.8,5.1-6,4.9,2.3,5.6,6c1,4.9,6,9.8,10.8,10.7s5.7,1.7,5.8,5.1-2.2,5-5.8,5.6-9.6,5.5-10.7,10.4ZM368.6,104.2l4.3-4.4-4.4-4.4-4.4,4.4,4.5,4.4Z"/>
                  </g>
                  <path fill="currentColor" d="M193.8,322.3c-2.2,0-4.2-1.2-5.2-3.3-1.3-2.9,0-6.3,2.8-7.6,18-8.4,21.3-27.9,24.2-45.1,1.8-10.3,3.3-19.2,7.8-25.1,3.5-4.5,7.7-12.7,8.4-17.7,1.7-12.5,8-20.8,14-28.8,7.5-10,14.7-19.5,13.8-37.8-.2-3.2,2.3-5.9,5.4-6,3.2-.2,5.9,2.3,6,5.4,1.1,22.5-8,34.6-16.1,45.2-5.6,7.5-10.5,13.9-11.8,23.4-1,7.4-6.2,17.4-10.6,23.1-2.8,3.6-4.2,11.6-5.6,20-3.1,18-7.3,42.6-30.7,53.5-.8.4-1.6.5-2.4.5Z"/>
                  <path fill="currentColor" d="M309.3,272.5c-20.1,0-31.5-8.6-41.6-16.1-7.5-5.6-13.9-10.5-23.4-11.8-7.4-1-17.4-6.2-23.1-10.6-3.6-2.8-11.6-4.2-20-5.6-18-3.1-42.6-7.3-53.5-30.7-1.3-2.9,0-6.3,2.8-7.6,2.9-1.3,6.3,0,7.6,2.8,8.4,18,27.9,21.3,45.1,24.2,10.3,1.8,19.2,3.3,25.1,7.8,4.5,3.5,12.7,7.7,17.7,8.4,12.5,1.7,20.8,8,28.8,14,10,7.5,19.5,14.7,37.8,13.8,3.2-.2,5.9,2.3,6,5.4.2,3.2-2.3,5.9-5.4,6-1.3,0-2.5,0-3.7,0Z"/>
                </svg>
              </div>
              <span className="text-xl sm:text-2xl font-bold">
                My Forest Blog
              </span>
            </div>
            <p className="text-sm sm:text-base opacity-80 max-w-md leading-relaxed">
              A personal blog sharing nature-inspired stories, adventures, and
              articles about the magical connections between life and the
              natural world.
            </p>
            <div className="flex space-x-3 sm:space-x-4 mt-4 sm:mt-6">
              <div className="w-8 h-8 bg-sage rounded-full flex items-center justify-center hover:bg-moss transition-colors cursor-pointer">
                <div className="text-sm text-white">
                  <LuFacebook />
                </div>
              </div>
              <div className="w-8 h-8 bg-sage rounded-full flex items-center justify-center hover:bg-moss transition-colors cursor-pointer">
                <div className="text-sm text-white">
                  <IoLogoInstagram />
                </div>
              </div>
              <div className="w-8 h-8 bg-sage rounded-full flex items-center justify-center hover:bg-moss transition-colors cursor-pointer">
                <div className="text-sm text-white">
                  <LuTwitter />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Explore
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base opacity-80">
              <li>
                <a href="#" className="hover:text-sage transition-colors">
                  Latest Stories
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sage transition-colors">
                  Featured Tales
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sage transition-colors">
                  Forest Wisdom
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sage transition-colors">
                  Character Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Community
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base opacity-80">
              <li>
                <a href="#" className="hover:text-sage transition-colors">
                  Join Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sage transition-colors">
                  Reader Stories
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sage transition-colors">
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sage transition-colors">
                  Newsletter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-6 sm:pt-8 text-center opacity-80">
          <p className="text-xs sm:text-sm md:text-base">
            &copy; 2025 My Forest Blog. All rights reserved. Made with love for
            nature and storytelling.
          </p>
        </div>
      </div>

      {/* Floating spirits */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="spirit-orb absolute opacity-20 animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
              animationDelay: `${i * 1}s`,
              animationDuration: `${5 + (i % 2)}s`,
            }}
          />
        ))}
      </div>
    </footer>
  );
}
