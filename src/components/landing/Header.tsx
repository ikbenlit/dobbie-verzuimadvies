'use client';

import Link from 'next/link';
import { getCommonContent } from '@/lib/content';

export default function Header() {
  const { nav } = getCommonContent();

  return (
    <header className="absolute top-0 left-0 right-0 z-50 py-6 px-4 md:px-8">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg
            className="h-8 w-8 text-brand-dark"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM11 11V7H13V11H11ZM11 13H13V15H11V13Z"
            />
          </svg>
          <span className="text-2xl font-bold text-brand-dark font-serif">
            {nav.logo}
          </span>
        </div>

        <nav className="hidden md:flex items-center bg-white/50 backdrop-blur-sm rounded-full shadow-sm p-1">
          {nav.links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-brand-text hover:text-brand-dark transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Link
          href="/chat"
          className="hidden md:inline-block bg-brand-accent text-brand-dark font-bold py-2 px-6 rounded-full hover:bg-opacity-80 transition-all"
        >
          {nav.startButton}
        </Link>
      </div>
    </header>
  );
}
