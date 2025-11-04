'use client';

import Image from 'next/image';
import Icon from '@/components/ui/Icon';
import { getFeaturesContent } from '@/lib/content';

export default function Features() {
  const content = getFeaturesContent();

  return (
    <section id={content.sectionId} className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 lg:gap-16 items-center">
          {/* Image Column (left) */}
          <div className="hidden lg:block rounded-card shadow-card overflow-hidden">
            <Image
              src={content.image.src}
              alt={content.image.alt}
              width={600}
              height={800}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Text and Features Column (right) */}
          <div>
            <div className="mb-12 md:mb-16 text-center lg:text-left">
              <h2 className="font-serif text-h2 font-bold text-bordeaux">
                {content.title}
              </h2>
              <p className="mt-4 text-body text-gray-dark max-w-3xl mx-auto lg:mx-0">
                {content.description}
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              {content.features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-card shadow-card p-6 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(119,17,56,0.15)]"
                >
                  <div className="w-12 h-12 bg-cream rounded-lg flex items-center justify-center mb-4">
                    <Icon name={feature.icon} className="h-6 w-6 text-bordeaux" />
                  </div>
                  <h3 className="text-h3 font-semibold text-bordeaux">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-body text-gray-dark">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
