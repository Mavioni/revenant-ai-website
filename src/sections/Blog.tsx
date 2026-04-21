import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Clock, Calendar, X } from 'lucide-react';
import { blogConfig } from '../config';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

gsap.registerPlugin(ScrollTrigger);

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  readTime: string;
  date: string;
  image: string;
  category: string;
}

export function Blog() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const postsRef = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!blogConfig.title || blogConfig.posts.length === 0) return null;

  const openPost = useCallback((post: BlogPost) => {
    setSelectedPost(post);
    setDialogOpen(true);
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }, []);

  const closePost = useCallback(() => {
    setDialogOpen(false);
    // Restore body scroll
    document.body.style.overflow = '';
    setTimeout(() => setSelectedPost(null), 300);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      onEnter: () => {
        const tl = gsap.timeline();

        // Title typewriter effect
        if (titleRef.current) {
          const text = titleRef.current.textContent || '';
          titleRef.current.textContent = '';
          titleRef.current.style.opacity = '1';

          text.split('').forEach((char, i) => {
            setTimeout(() => {
              if (titleRef.current) {
                titleRef.current.textContent += char;
              }
            }, i * 50);
          });
        }

        // Description fade
        tl.fromTo(
          descRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
          0.6
        );

        // Posts clip reveal
        postsRef.current.forEach((post, i) => {
          if (post) {
            const image = post.querySelector('.post-image');
            const content = post.querySelector('.post-content');

            tl.fromTo(
              image,
              {
                clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
              },
              {
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                duration: 0.9,
                ease: 'expo.out',
              },
              0.8 + i * 0.15
            );

            tl.fromTo(
              content,
              { y: 25, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
              `-=0.5`
            );
          }
        });

        // Button slide in
        tl.fromTo(
          buttonRef.current,
          { x: 40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' },
          '-=0.3'
        );
      },
      once: true,
    });
    triggersRef.current.push(trigger);

    return () => {
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
    };
  }, []);

  // Close dialog on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dialogOpen) {
        closePost();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [dialogOpen, closePost]);

  return (
    <section
      ref={sectionRef}
      id="blog"
      className="relative py-24 md:py-32 px-6 lg:px-16 bg-black overflow-hidden"
      aria-labelledby="blog-title"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 md:mb-16">
          <div>
            <h2
              ref={titleRef}
              id="blog-title"
              className="text-h2 md:text-h1 lg:text-display-xl text-white font-medium mb-4 opacity-0"
            >
              {blogConfig.title}
            </h2>
            <p
              ref={descRef}
              className="text-body-lg text-white/60 max-w-xl"
            >
              {blogConfig.subtitle}
            </p>
          </div>

          <button
            ref={buttonRef}
            className="hidden lg:flex items-center gap-2 text-body text-white/60 hover:text-white transition-colors duration-300 mt-8 lg:mt-0 group"
          >
            {blogConfig.allPostsLabel}
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Blog posts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {blogConfig.posts.map((post, index) => (
            <div
              key={post.id}
              ref={(el) => {
                postsRef.current[index] = el;
              }}
              className="group cursor-pointer"
              onClick={() => openPost(post)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openPost(post)}
              // No aria-label: the h3 title + excerpt + "Read More" text inside
              // ARE the accessible name. Adding "Read {title}" as aria-label
              // mismatched the visible text (WCAG 2.5.3 label-in-name).
            >
              {/* Image */}
              <div className="post-image relative aspect-[16/9] overflow-hidden mb-5 md:mb-6">
                <img
                  src={post.image}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Category tag */}
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/80 backdrop-blur-sm">
                  <span className="text-body-sm text-white">
                    {post.category}
                  </span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-highlight/0 group-hover:bg-highlight/10 transition-colors duration-500" />
              </div>

              {/* Content */}
              <div className="post-content">
                {/* Meta */}
                <div className="flex items-center gap-4 md:gap-6 mb-3 md:mb-4 text-body-sm text-white/50">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {blogConfig.readTimePrefix}{post.readTime}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-h4 md:text-h3 text-white font-medium mb-2 md:mb-3 group-hover:text-highlight transition-colors duration-300 relative inline-block">
                  {post.title}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-highlight group-hover:w-full transition-all duration-300" />
                </h3>

                {/* Excerpt */}
                <p className="text-body text-white/60 leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Read more — bumped from /40 to /55 for WCAG AA contrast on 14px text */}
                <div className="flex items-center gap-2 mt-4 text-body-sm text-white/55 group-hover:text-white transition-colors duration-300">
                  {blogConfig.readMoreLabel}
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blog Post Modal */}
      <Dialog open={dialogOpen} onOpenChange={closePost}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black border border-white/10 p-0">
          {selectedPost && (
            <>
              {/* Header Image */}
              <div className="relative aspect-[21/9] w-full">
                <img
                  src={selectedPost.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <button
                  onClick={closePost}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/80 backdrop-blur-sm flex items-center justify-center hover:bg-highlight transition-colors duration-300 rounded-full"
                  aria-label="Close article"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 md:px-8 pb-8 -mt-16 md:-mt-20 relative z-10">
                <DialogHeader>
                  {/* Category & Meta */}
                  <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <span className="px-3 py-1 bg-highlight/20 text-highlight text-body-sm">
                      {selectedPost.category}
                    </span>
                    <span className="flex items-center gap-2 text-body-sm text-white/50">
                      <Clock className="w-4 h-4" />
                      {blogConfig.readTimePrefix}{selectedPost.readTime}
                    </span>
                    <span className="flex items-center gap-2 text-body-sm text-white/50">
                      <Calendar className="w-4 h-4" />
                      {selectedPost.date}
                    </span>
                  </div>

                  <DialogTitle className="text-h2 md:text-h1 text-white font-medium mb-4 md:mb-6">
                    {selectedPost.title}
                  </DialogTitle>
                </DialogHeader>

                {/* Article Content */}
                <article 
                  className="prose prose-invert prose-lg max-w-none text-white/80 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: selectedPost.content
                      .replace(/## (.*)/g, '<h2 class="text-h3 text-white font-medium mt-8 md:mt-10 mb-4 md:mb-5">$1</h2>')
                      .replace(/### (.*)/g, '<h3 class="text-h4 text-white font-medium mt-6 md:mt-8 mb-3 md:mb-4">$1</h3>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                      .replace(/\n\n/g, '</p><p class="mb-4 md:mb-5">')
                      .replace(/\n- (.*)/g, '<li class="ml-6 mb-2">$1</li>')
                      .replace(/<li/g, '<ul class="mb-4 md:mb-5 list-disc"><li')
                      .replace(/<\/li>\n(?!<li)/g, '</li></ul>')
                      .replace(/^/, '<p class="mb-4 md:mb-5">')
                      .replace(/$/, '</p>')
                      .replace(/---\n/g, '<hr class="border-white/20 my-8 md:my-10" />')
                  }}
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
