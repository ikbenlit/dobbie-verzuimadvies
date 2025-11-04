'use client';

import Link from 'next/link';
import { getHomeContent } from '@/lib/content';

export default function Hero() {
  const { hero } = getHomeContent();

  return (
    <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-100/80 to-brand-light">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center md:text-left">
            <div className="inline-block bg-white/60 rounded-full px-4 py-1.5 mb-4 shadow-sm">
              <p className="text-sm text-bordeaux-hover font-medium">
                {hero.badge}
              </p>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-bordeaux-hover leading-tight">
              {hero.title}
            </h1>
            <p className="mt-6 text-lg text-brand-text max-w-xl mx-auto md:mx-0 leading-relaxed">
            Je hoeft niet langer te wachten op overvolle bedrijfsartsen of te twijfelen of je juist handelt.
              <strong className="text-bordeaux-hover"> DOBbie is jouw AI-verzuimbuddy die 24/7 klaarstaat</strong> voor alles rondom verzuim en duurzame inzetbaarheid. 
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center md:justify-start items-center gap-4">
              <Link
                href={hero.primaryCta.href}
                className="bg-bordeaux text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-bordeaux-hover transition-all w-full sm:w-auto"
              >
                {hero.primaryCta.text}
              </Link>
              <a
                href={hero.secondaryCta.href}
                className="bg-white text-bordeaux font-bold py-3 px-8 rounded-full shadow-lg border-2 border-bordeaux hover:bg-teal hover:text-white hover:border-teal transition-all w-full sm:w-auto"
              >
                {hero.secondaryCta.text}
              </a>
            </div>
          </div>

          {/* Smartphone Mockup */}
          <div className="relative w-full flex justify-center -mt-10 md:mt-0 group">
            <div className="w-60 md:w-72 h-[30rem] md:h-[34rem] bg-slate-900 rounded-[3rem] p-3 shadow-2xl shadow-black/30 transform -rotate-2 group-hover:rotate-0 group-hover:scale-105 transition-transform duration-300 ease-in-out">
              <div className="bg-white h-full w-full rounded-[2.5rem] overflow-hidden">
                <video
                  src={hero.video.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
