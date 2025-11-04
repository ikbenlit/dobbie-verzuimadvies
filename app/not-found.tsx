'use client';

import Link from 'next/link';
import Header from '@/components/landing/Header';
import FooterNew from '@/components/landing/FooterNew';
import { SearchX, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bordeaux/5 via-gold/5 to-teal/5">
      <Header />

      <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-4">
        <div className="max-w-2xl w-full text-center">
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-bordeaux/10 to-teal/10 rounded-full flex items-center justify-center animate-pulse">
                <SearchX className="w-16 h-16 text-bordeaux" strokeWidth={1.5} />
              </div>
              <div className="absolute -top-2 -right-2 w-16 h-16 bg-gold/20 rounded-full animate-ping"></div>
            </div>
          </div>

          {/* Error Code */}
          <h1 className="font-serif text-8xl md:text-9xl font-bold text-bordeaux/20 mb-4">
            404
          </h1>

          {/* Message */}
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-bordeaux-hover mb-4">
            Sorry, deze pagina kan DOBbie niet voor je vinden!
          </h2>

          <p className="text-lg text-brand-text mb-8 max-w-lg mx-auto">
            Het lijkt erop dat deze pagina niet bestaat of is verplaatst.
            Geen zorgen, DOBbie helpt je graag verder!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-bordeaux to-bordeaux-hover hover:from-bordeaux-hover hover:to-bordeaux text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
            >
              <Home className="w-5 h-5" />
              Naar Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 bg-white text-teal border-2 border-teal hover:bg-teal hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
              Ga Terug
            </button>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-brand-text mb-4 font-medium">
              Misschien helpen deze links je verder:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/#waarom" className="text-teal hover:text-teal-dark font-medium transition-colors">
                Waarom DOBbie
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/#prijzen" className="text-teal hover:text-teal-dark font-medium transition-colors">
                Prijzen
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/contact" className="text-teal hover:text-teal-dark font-medium transition-colors">
                Contact
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/login" className="text-teal hover:text-teal-dark font-medium transition-colors">
                Inloggen
              </Link>
            </div>
          </div>
        </div>
      </main>

      <FooterNew />
    </div>
  );
}
