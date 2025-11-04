import { Quote } from 'lucide-react';
import { getTestimonialsContent } from '@/lib/content';

export default function Testimonials() {
  const content = getTestimonialsContent();

  return (
    <section className="py-24 bg-brand-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-bordeaux-hover mb-4">
            {content.title}
          </h2>
          <p className="text-lg text-brand-text max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {content.testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`${testimonial.bgColor} rounded-2xl p-8 border-2 border-transparent relative overflow-hidden`}
            >
              {/* Gradient accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${testimonial.gradient}`}></div>

              {/* Quote icon */}
              <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center mb-6`}>
                <Quote className="w-6 h-6 text-white" />
              </div>

              {/* Quote text */}
              <p className="text-brand-text mb-6 leading-relaxed italic">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className={`text-sm font-bold bg-gradient-to-r ${testimonial.gradient} bg-clip-text text-transparent`}>
                — {testimonial.author}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
