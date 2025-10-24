import Image from 'next/image';
import { getVisionContent } from '@/lib/content';

export default function Vision() {
  const content = getVisionContent();

  return (
    <section id={content.sectionId} className="py-24 bg-brand-light">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1">
            <div className="inline-block bg-white rounded-full px-4 py-1.5 mb-4">
              <p className="text-sm text-bordeaux-hover font-medium">
                {content.badge}
              </p>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-bordeaux-hover">
              {content.title}
            </h2>
            <p className="mt-4 text-lg text-brand-text whitespace-pre-line">
              {content.description}
            </p>
            <div className="mt-6">
              <p className="font-bold text-bordeaux-hover">{content.author.name}</p>
              <p className="text-sm text-brand-text">{content.author.role}</p>
            </div>
          </div>

          <div className="order-1 md:order-2 flex justify-center">
            <Image
              src={content.author.image.src}
              alt={content.author.image.alt}
              width={400}
              height={500}
              className="rounded-2xl shadow-xl w-full max-w-sm h-auto object-cover aspect-[4/5] object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
