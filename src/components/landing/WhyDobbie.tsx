import Image from 'next/image';
import { CheckIcon } from '@/components/ui/icons';
import { getWhyDobbieContent } from '@/lib/content';

export default function WhyDobbie() {
  const content = getWhyDobbieContent();

  return (
    <section id={content.sectionId} className="py-24 bg-brand-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block bg-white rounded-full px-4 py-1.5 mb-4 shadow-sm">
            <p className="text-sm text-[#5A0D29] font-medium">{content.badge}</p>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#5A0D29]">
            {content.title}
          </h2>
          <p className="mt-4 text-lg text-brand-text max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <Image
              src={content.image.src}
              alt={content.image.alt}
              width={600}
              height={600}
              className="rounded-2xl shadow-xl w-full h-auto object-cover aspect-square"
            />
          </div>

          <div className="space-y-6">
            <h3 className="font-serif text-3xl font-bold text-[#5A0D29]">
              {content.benefitsTitle}
            </h3>
            <ul className="space-y-4">
              {content.reasons.map((reason, index) => (
                <li key={index} className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-[#5A0D29] mr-3 mt-1 flex-shrink-0" />
                  <span>
                    <span className="font-bold">{reason.title}</span>{' '}
                    {reason.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
