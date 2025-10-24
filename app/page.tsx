import Link from 'next/link';
import { getUser } from '@/lib/supabase/server';

export default async function HomePage() {
  const user = await getUser();

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
            <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl font-bold tracking-tight text-bordeaux sm:text-5xl md:text-6xl">
                  <span className="block">DoBbie</span>
                  <span className="block text-gold">Jouw Digitale Verzuimbuddy</span>
                </h1>

                <p className="mt-3 text-base text-gray-dark sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                  24/7 praktische, juridisch onderbouwde antwoorden op vragen over verzuim,
                  communicatie en wetgeving. Speciaal ontwikkeld voor HR-medewerkers,
                  casemanagers en leidinggevenden.
                </p>

                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  {user ? (
                    <div className="rounded-md shadow">
                      <Link
                        href="/chat"
                        className="flex w-full items-center justify-center rounded-md bg-bordeaux px-8 py-3 text-base font-medium text-white hover:bg-bordeaux-hover md:px-10 md:py-4 md:text-lg"
                      >
                        Ga naar Chat
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="rounded-md shadow">
                        <Link
                          href="/register"
                          className="flex w-full items-center justify-center rounded-md bg-bordeaux px-8 py-3 text-base font-medium text-white hover:bg-bordeaux-hover md:px-10 md:py-4 md:text-lg"
                        >
                          Start gratis trial
                        </Link>
                      </div>
                      <div className="mt-3 sm:ml-3 sm:mt-0">
                        <Link
                          href="/login"
                          className="flex w-full items-center justify-center rounded-md border border-bordeaux bg-white px-8 py-3 text-base font-medium text-bordeaux hover:bg-cream md:px-10 md:py-4 md:text-lg"
                        >
                          Inloggen
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-bordeaux">
              Waarom DoBbie?
            </h2>
            <p className="mt-4 text-lg text-gray-dark">
              Directe antwoorden op al je verzuimvragen
            </p>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-bordeaux text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="mt-4 text-lg font-medium text-bordeaux">24/7 Beschikbaar</h3>
              <p className="mt-2 text-base text-gray-dark">
                Altijd toegang tot betrouwbaar advies, wanneer je het nodig hebt.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-bordeaux text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <h3 className="mt-4 text-lg font-medium text-bordeaux">Juridisch Onderbouwd</h3>
              <p className="mt-2 text-base text-gray-dark">
                Gebaseerd op actuele wet- en regelgeving zoals de Wet Poortwachter.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-bordeaux text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="mt-4 text-lg font-medium text-bordeaux">Direct Antwoord</h3>
              <p className="mt-2 text-base text-gray-dark">
                Geen wachttijden, direct praktisch advies voor jouw situatie.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}