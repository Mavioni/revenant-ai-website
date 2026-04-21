import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, Check, Loader2 } from 'lucide-react';
import { contactConfig } from '../config';
import { TransmissionRadar } from '../components/animations/TransmissionRadar';

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const inputsRef = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: '',
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!contactConfig.title) return null;

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      onEnter: () => {
        const tl = gsap.timeline();

        // Diagonal divider line draw
        tl.fromTo(
          dividerRef.current,
          { height: 0 },
          { height: '100%', duration: 1.2, ease: 'expo.inOut' }
        );

        // Form container slide
        tl.fromTo(
          formRef.current,
          { x: -50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: 'expo.out' },
          '-=0.8'
        );

        // Image reveal
        tl.fromTo(
          imageRef.current,
          {
            scale: 1.1,
            clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
          },
          {
            scale: 1,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            duration: 1,
            ease: 'expo.out',
          },
          '-=0.6'
        );

        // Title letter cascade
        if (titleRef.current) {
          const chars = titleRef.current.querySelectorAll('.char');
          tl.fromTo(
            chars,
            { opacity: 0, y: 15 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.03,
              ease: 'power2.out',
            },
            '-=0.6'
          );
        }

        // Subtitle
        tl.fromTo(
          subtitleRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
          '-=0.4'
        );

        // Input fields stagger
        inputsRef.current.forEach((input, i) => {
          if (input) {
            tl.fromTo(
              input,
              { y: 25, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
              `-=${0.35 - i * 0.08}`
            );
          }
        });

        // Submit button
        tl.fromTo(
          buttonRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' },
          '-=0.2'
        );
      },
      once: true,
    });
    triggersRef.current.push(trigger);

    // Image parallax
    const parallaxTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => {
        if (imageRef.current) {
          gsap.set(imageRef.current, {
            y: -25 + self.progress * 50,
          });
        }
      },
    });
    triggersRef.current.push(parallaxTrigger);

    return () => {
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
    };
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: '', email: '', projectType: '', message: '' });
      setIsSubmitted(false);
      setErrors({});
    }, 3000);
  }, [validateForm]);

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const titleChars = contactConfig.title.split('');

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-24 md:py-32 px-6 lg:px-16 bg-black overflow-hidden"
      aria-labelledby="contact-title"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 relative">
          {/* Diagonal divider */}
          <div
            ref={dividerRef}
            className="hidden lg:block absolute left-1/2 top-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"
            style={{
              transform: 'rotate(12deg) translateX(-50%)',
              transformOrigin: 'top center',
              willChange: 'height',
            }}
            aria-hidden="true"
          />

          {/* Form side */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="relative z-10"
            aria-label="Contact form"
          >
            {/* Title */}
            <h2
              ref={titleRef}
              id="contact-title"
              className="text-h2 md:text-h1 text-white font-medium mb-4"
            >
              {titleChars.map((char, i) => (
                <span key={i} className="char inline-block">
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h2>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="text-body-lg text-white/60 mb-10 md:mb-12"
            >
              {contactConfig.subtitle}
            </p>

            {/* Form fields */}
            <div className="space-y-6 md:space-y-8">
              {/* Name */}
              <div
                ref={(el) => {
                  inputsRef.current[0] = el;
                }}
                className="relative"
              >
                <label
                  htmlFor="name"
                  className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                    focusedField === 'name' || formData.name
                      ? '-top-6 text-body-sm text-white'
                      : 'top-3 text-body text-white/50'
                  }`}
                >
                  {contactConfig.nameLabel}
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full bg-transparent border-b py-3 text-white focus:outline-none transition-colors duration-300 ${
                    errors.name ? 'border-red-500' : 'border-white/20 focus:border-white'
                  }`}
                  disabled={isSubmitting || isSubmitted}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                <div
                  className={`absolute bottom-0 left-0 h-px bg-highlight transition-all duration-300 ${
                    focusedField === 'name' ? 'w-full' : 'w-0'
                  }`}
                />
                {errors.name && (
                  <p id="name-error" className="text-red-500 text-body-sm mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div
                ref={(el) => {
                  inputsRef.current[1] = el;
                }}
                className="relative"
              >
                <label
                  htmlFor="email"
                  className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                    focusedField === 'email' || formData.email
                      ? '-top-6 text-body-sm text-white'
                      : 'top-3 text-body text-white/50'
                  }`}
                >
                  {contactConfig.emailLabel}
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full bg-transparent border-b py-3 text-white focus:outline-none transition-colors duration-300 ${
                    errors.email ? 'border-red-500' : 'border-white/20 focus:border-white'
                  }`}
                  disabled={isSubmitting || isSubmitted}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                <div
                  className={`absolute bottom-0 left-0 h-px bg-highlight transition-all duration-300 ${
                    focusedField === 'email' ? 'w-full' : 'w-0'
                  }`}
                />
                {errors.email && (
                  <p id="email-error" className="text-red-500 text-body-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Project Type */}
              <div
                ref={(el) => {
                  inputsRef.current[2] = el;
                }}
                className="relative"
              >
                <label
                  htmlFor="projectType"
                  className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                    focusedField === 'projectType' || formData.projectType
                      ? '-top-6 text-body-sm text-white'
                      : 'top-3 text-body text-white/50'
                  }`}
                >
                  {contactConfig.projectTypeLabel}
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('projectType')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-white transition-colors duration-300 appearance-none cursor-pointer"
                  disabled={isSubmitting || isSubmitted}
                >
                  <option value="" className="bg-black">
                    {contactConfig.projectTypePlaceholder}
                  </option>
                  {contactConfig.projectTypeOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-black">
                      {option.label}
                    </option>
                  ))}
                </select>
                <div
                  className={`absolute bottom-0 left-0 h-px bg-highlight transition-all duration-300 ${
                    focusedField === 'projectType' ? 'w-full' : 'w-0'
                  }`}
                />
                {/* Custom select arrow */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Message */}
              <div
                ref={(el) => {
                  inputsRef.current[3] = el;
                }}
                className="relative"
              >
                <label
                  htmlFor="message"
                  className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                    focusedField === 'message' || formData.message
                      ? '-top-6 text-body-sm text-white'
                      : 'top-3 text-body text-white/50'
                  }`}
                >
                  {contactConfig.messageLabel}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  rows={4}
                  className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-white transition-colors duration-300 resize-none"
                  disabled={isSubmitting || isSubmitted}
                />
                <div
                  className={`absolute bottom-0 left-0 h-px bg-highlight transition-all duration-300 ${
                    focusedField === 'message' ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              ref={buttonRef}
              type="submit"
              disabled={isSubmitting || isSubmitted}
              className={`mt-10 md:mt-12 px-8 md:px-10 py-4 text-body font-medium flex items-center gap-3 relative overflow-hidden group transition-all duration-300 ${
                isSubmitted
                  ? 'bg-green-500 text-white cursor-default'
                  : isSubmitting
                  ? 'bg-white/80 text-black cursor-wait'
                  : 'bg-white text-black hover:bg-highlight hover:text-white'
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                {isSubmitted && <Check className="w-5 h-5" />}
                {isSubmitted ? 'Message Sent' : isSubmitting ? 'Sending...' : contactConfig.submitButtonText}
              </span>
              {!isSubmitting && !isSubmitted && (
                <Send className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              )}
              {!isSubmitting && !isSubmitted && (
                <div className="absolute inset-0 bg-highlight transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              )}
            </button>
          </form>

          {/* Image side */}
          <div
            ref={imageRef}
            className="relative aspect-[2/3] lg:aspect-auto overflow-hidden"
            style={{ willChange: 'transform, clip-path' }}
          >
            <div className="absolute inset-0">
              <img src={contactConfig.image} alt="Contact Transmission" className="w-full h-full object-cover grayscale brightness-[0.4]" />
            </div>
            <div className="absolute inset-0 z-10 opacity-90 pointer-events-none mix-blend-screen">
              <TransmissionRadar />
            </div>

            {/* Decorative blocks */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-highlight/20" aria-hidden="true" />
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-white/5" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
