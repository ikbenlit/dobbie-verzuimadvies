
import React, { useState } from 'react';
import PlusIcon from './icons/PlusIcon';
import MinusIcon from './icons/MinusIcon';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 py-6">
      <button onClick={onClick} className="w-full flex justify-between items-center text-left">
        <h3 className="text-lg font-semibold text-[#5A0D29]">{question}</h3>
        {isOpen ? <MinusIcon className="h-6 w-6 text-[#5A0D29]" /> : <PlusIcon className="h-6 w-6 text-brand-text" />}
      </button>
      {isOpen && (
        <div className="mt-4 text-brand-text">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const faqs = [
  {
    question: "Voor wie is DOBbie bedoeld?",
    answer: "DOBbie is ontworpen voor HR-managers, leidinggevenden en ondernemers in het MKB die snel en betrouwbaar advies nodig hebben over verzuim en re-integratie."
  },
  {
    question: "Hoe actueel is de informatie van DOBbie?",
    answer: "Onze kennisbank wordt continu bijgewerkt door arbeidsrecht- en verzuimexperts om te garanderen dat alle adviezen in lijn zijn met de laatste wet- en regelgeving, zoals de Wet verbetering poortwachter."
  },
  {
    question: "Is mijn data veilig bij DOBbie?",
    answer: "Ja, wij nemen databeveiliging zeer serieus. Alle data wordt versleuteld opgeslagen op servers binnen de EU en we zijn volledig GDPR-compliant. Gesprekken worden anoniem verwerkt."
  },
  {
    question: "Kan ik mijn abonnement op elk moment opzeggen?",
    answer: "Absoluut. U kunt uw abonnement op elk moment eenvoudig online opzeggen. U behoudt toegang tot het einde van uw huidige factureringsperiode."
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#5A0D29]">
            Veelgestelde Vragen
          </h2>
          <p className="mt-4 text-lg text-brand-text">
            Vind hier antwoorden op de meest voorkomende vragen over DOBbie.
          </p>
        </div>
        <div>
          {faqs.map((faq, index) => (
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
};

export default FAQ;
