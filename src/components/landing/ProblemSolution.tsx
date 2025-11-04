import { AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { getProblemSolutionContent } from '@/lib/content';
import type { ProblemSolutionParagraph } from '@/types/content';

// Helper functie om paragrafen te renderen
function renderParagraph(paragraph: string | ProblemSolutionParagraph, index: number) {
  // Als het een string is, render het gewoon
  if (typeof paragraph === 'string') {
    return <p key={index}>{paragraph}</p>;
  }

  // Als het een object is met speciale formatting
  const { text, highlight, highlightColor, continuation, emphasis, end } = paragraph;

  return (
    <p key={index}>
      {text && <>{text} </>}
      {highlight && highlightColor === 'red' && (
        <strong className="text-red-600">{highlight}</strong>
      )}
      {highlight && highlightColor === 'green' && (
        <strong className="text-green-600">{highlight}</strong>
      )}
      {highlight && !highlightColor && (
        <strong>{highlight}</strong>
      )}
      {continuation && <> {continuation}</>}
      {emphasis && <strong>{emphasis}</strong>}
      {end && <>{end}</>}
    </p>
  );
}

export default function ProblemSolution() {
  const content = getProblemSolutionContent();

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Probleem */}
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-bordeaux-hover">
                {content.problem.title}
              </h3>
            </div>

            <div className="space-y-4 text-brand-text leading-relaxed">
              {content.problem.paragraphs.map((paragraph, index) =>
                renderParagraph(paragraph, index)
              )}
              {content.problem.quote && (
                <p className="text-sm italic border-l-4 border-red-200 pl-4 py-2 bg-red-50">
                  {content.problem.quote}
                </p>
              )}
              {content.problem.benefits && (
                <div className="bg-red-50 border-l-4 border-red-500 pl-4 py-3 space-y-2">
                  <p className="font-bold text-bordeaux-hover">{content.problem.benefits.title}</p>
                  <ul className="text-sm space-y-1">
                    {content.problem.benefits.items.map((item, index) => (
                      <li key={index}>
                        ✗ {item.text} <strong>{item.emphasis}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Oplossing */}
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-bordeaux-hover">
                {content.solution.title}
              </h3>
            </div>

            <div className="space-y-4 text-brand-text leading-relaxed">
              {content.solution.paragraphs.map((paragraph, index) =>
                renderParagraph(paragraph, index)
              )}
              <div className="bg-green-50 border-l-4 border-green-500 pl-4 py-3 space-y-2">
                <p className="font-bold text-bordeaux-hover">{content.solution.benefits.title}</p>
                <ul className="text-sm space-y-1">
                  {content.solution.benefits.items.map((item, index) => (
                    <li key={index}>
                      ✓ {item.text} <strong>{item.emphasis}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-xl font-bold text-bordeaux-hover">
            {content.cta.text} <span className="text-teal">{content.cta.highlight}</span> {content.cta.continuation}
          </p>

          {/* Call to Action met knop */}
          {content.cta.action && (
            <div className="mt-8 bg-gradient-to-br from-teal/10 to-bordeaux/10 rounded-2xl p-8 max-w-2xl mx-auto">
              <h4 className="text-2xl font-bold text-bordeaux-hover mb-2">
                {content.cta.action.title}
              </h4>
              <p className="text-brand-text mb-6">
                {content.cta.action.subtitle}
              </p>
              <Link
                href="/register"
                className="inline-block bg-teal hover:bg-teal-hover text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
              >
                {content.cta.action.buttonText}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
