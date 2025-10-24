'use client';

import { useState } from 'react';
import { PlusIcon, MinusIcon } from '@/components/ui/icons';
import { getFAQContent } from '@/lib/content';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  isOpen,
  onClick,
}) => {
  return (
    <div className="border-b border-gray-200 py-6">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left"
      >
        <h3 className="text-lg font-semibold text-[#5A0D29]">{question}</h3>
        {isOpen ? (
          <MinusIcon className="h-6 w-6 text-[#5A0D29]" />
        ) : (
          <PlusIcon className="h-6 w-6 text-brand-text" />
        )}
      </button>
      {isOpen && (
        <div className="mt-4 text-brand-text">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default function FAQ() {
  const content = getFAQContent();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id={content.sectionId} className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#5A0D29]">
            {content.title}
          </h2>
          <p className="mt-4 text-lg text-brand-text">
            {content.description}
          </p>
        </div>
        <div>
          {content.items.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => handleClick(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
