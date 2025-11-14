import { CheckCircle, Sparkles } from 'lucide-react';
import { getDobbieCTAContent } from '@/lib/content';
import Link from 'next/link';

export default function DobbieCTA() {
  const content = getDobbieCTAContent();

  return (
    <section className="py-20 bg-gradient-to-br from-bordeaux/5 via-gold/5 to-teal/5">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 border border-gold/20">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center mr-3 animate-pulse shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-bordeaux-hover">
                {content.title}
              </h2>
            </div>
          </div>

          {/* Reasons List - 2 columns on desktop, stacked on mobile */}
          <div className="grid md:grid-cols-2 gap-3 mb-10 max-w-4xl mx-auto">
            {content.reasons.map((reason, index) => (
              <div
                key={index}
                className="flex items-start gap-3 text-left"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-5 h-5 text-teal" />
                </div>
                <p className="text-brand-text leading-relaxed">{reason}</p>
              </div>
            ))}
          </div>

          {/* Support Section - Highlighted */}
          <div className="bg-gradient-to-r from-teal/10 via-gold/10 to-bordeaux/10 rounded-2xl p-6 md:p-8 mb-10 border border-teal/20">
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-bordeaux mb-4">
                {content.support.intro}
              </p>
              <div className="flex flex-wrap justify-center gap-3 mb-4">
                {content.support.badges.map((badge, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white rounded-full text-teal font-semibold shadow-md border border-teal/20"
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <p className="text-lg text-brand-text font-medium">
                {content.support.promise}
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="mb-6">
              <p className="text-2xl md:text-3xl font-bold text-bordeaux-hover mb-2">
                <span className="mr-2">{content.cta.emoji}</span>
                {content.cta.heading}
              </p>
              <p className="text-sm text-brand-text/80 font-medium">
                {content.cta.subtext}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="bg-gradient-to-r from-bordeaux to-bordeaux-hover hover:from-bordeaux-hover hover:to-bordeaux text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 min-w-[200px] text-center"
              >
                {content.buttons.primary}
              </Link>
              <Link
                href="/contact"
                className="bg-white text-teal border-2 border-teal hover:bg-teal hover:text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 min-w-[200px] text-center"
              >
                {content.buttons.secondary}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
