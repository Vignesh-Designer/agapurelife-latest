'use client';

import React from 'react';
import Image from 'next/image';
import { BlogPost } from '@/lib/types';
import { ArrowRight, Bookmark, Clock } from 'lucide-react';

interface BotanicalBlogProps {
  blogs: BlogPost[];
}

export const BotanicalBlog: React.FC<BotanicalBlogProps> = ({ blogs }) => {
  return (
    <section className="py-20 sm:py-28 bg-[#FFFFFF] text-[#1A1A1A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header: Changed from "From Our Botanical Blog" to "Our Blog" */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4">
          <div>
            <span className="text-[#99752D] text-xs font-bold uppercase tracking-widest block mb-2">
              WELLNESS & TRADITIONAL SCIENCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F281E]">
              Our Blog
            </h2>
          </div>

          <a
            href="#faq"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#143828] hover:text-[#C5A059] transition-colors group"
          >
            <span>Read All Articles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-[#FAF7F2] rounded-3xl border border-[#EAE3D4] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-neutral-200">
                  <Image
                    src={blog.image}
                    alt={`${blog.title} - Agápure Traditional Oil Wellness Guide`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-3 left-3 bg-[#143828]/90 backdrop-blur-xs text-[#F3E5AB] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {blog.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-[11px] text-[#8C8275] mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{blog.readTime}</span>
                    <span>•</span>
                    <span>{blog.date}</span>
                  </div>

                  <h3 className="font-bold text-base sm:text-lg text-[#0F281E] leading-snug group-hover:text-[#99752D] transition-colors">
                    {blog.title}
                  </h3>

                  <p className="text-xs sm:text-[13px] text-[#6B6357] mt-2.5 line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 border-t border-[#F2ECE1] flex items-center justify-between text-xs font-bold text-[#143828]">
                <span className="flex items-center gap-1 group-hover:text-[#C5A059] transition-colors">
                  <span>Read Full Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <Bookmark className="w-4 h-4 text-[#8C8275] hover:text-[#143828] cursor-pointer" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
