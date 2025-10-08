'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { BsRocketTakeoff } from 'react-icons/bs';
import { GiClockwork } from 'react-icons/gi';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { PiVoicemailFill } from 'react-icons/pi';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Thank you for your message! I\'ll get back to you soon with a response.');
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => setSubmitMessage(''), 5000);
    }, 2000);
  };

  return (
    <section
      id="contact"
      className="py-12 sm:py-16 md:py-20 bg-forest text-white relative overflow-hidden"
    >
      {/* Floating spirits background */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="spirit-orb absolute opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Let's Connect</h2>
            <p className="text-base sm:text-lg md:text-xl opacity-90 max-w-3xl mx-auto px-4">
              Have thoughts about my stories or want to share your own nature
              experiences? I'd love to hear from fellow nature enthusiasts and
              storytellers.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-start">
            {/* Contact Info */}
            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sage rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="text-lg sm:text-xl text-white">
                    <PiVoicemailFill />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-white">
                    Send a Message
                  </h3>
                  <p className="text-sm sm:text-base opacity-80">hello@myforestblog.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sage rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="text-lg sm:text-xl text-white">
                    <HiOutlineLocationMarker />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-white">
                    Visit the Grove
                  </h3>
                  <p className="text-sm sm:text-base opacity-80">
                    Deep in the Enchanted Forest
                    <br />
                    Where the ancient trees whisper
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sage rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="text-lg sm:text-xl text-white">
                    <GiClockwork />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-white">
                    Forest Hours
                  </h3>
                  <p className="text-sm sm:text-base opacity-80">
                    Dawn to Dusk
                    <br />
                    When the spirits are most active
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 mt-8 lg:mt-0">
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-90">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-sage transition-all"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-90">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-sage transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 opacity-90">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-sage transition-all"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 opacity-90">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-sage transition-all resize-none"
                  placeholder="Share your thoughts or story..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white/10 hover:bg-moss text-white font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending to the spirits...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Send Message</span>
                    <div className="text-base sm:text-lg">
                      <BsRocketTakeoff />
                    </div>
                  </div>
                )}
              </button>

              {submitMessage && (
                <div className="text-center text-sage font-medium text-sm sm:text-base">
                  {submitMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
