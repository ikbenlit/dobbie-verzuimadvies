
import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-100/80 to-brand-light">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center md:text-left">
            <div className="inline-block bg-white/60 rounded-full px-4 py-1.5 mb-4 shadow-sm">
              <p className="text-sm text-[#5A0D29] font-medium">Online Verzuimadvies</p>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-[#5A0D29] leading-tight">
              Professioneel advies binnen handbereik
            </h1>
            <p className="mt-6 text-lg text-brand-text max-w-xl mx-auto md:mx-0">
              Direct antwoord op al uw vragen over verzuim, re-integratie en arbeidsgerelateerde zaken. Efficiënt, betrouwbaar en altijd beschikbaar.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center md:justify-start items-center gap-4">
              <Link to="/chat" className="bg-[#771138] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-[#5A0D29] transition-all w-full sm:w-auto">
                Probeer DOBbie
              </Link>
              <a href="#waarom" className="bg-[#E9B046] text-black font-bold py-3 px-8 rounded-full shadow-lg hover:bg-[#5A0D29] hover:text-white transition-all w-full sm:w-auto">
                Meer Informatie
              </a>
            </div>
          </div>
          
          {/* Smartphone Mockup */}
          <div className="relative w-full flex justify-center -mt-10 md:mt-0 group">
            
            <div className="w-60 md:w-72 h-[30rem] md:h-[34rem] bg-slate-900 rounded-[3rem] p-3 shadow-2xl shadow-black/30 transform -rotate-2 group-hover:rotate-0 group-hover:scale-105 transition-transform duration-300 ease-in-out">
              <div className="bg-white h-full w-full rounded-[2.5rem] overflow-hidden">
                <video 
                  src="/video/demo-dobbie.mp4"
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
};

export default Hero;
