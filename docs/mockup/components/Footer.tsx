
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-light border-t border-gray-200/50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
                <svg className="h-7 w-7 text-brand-dark" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM11 11V7H13V11H11ZM11 13H13V15H11V13Z"/>
                </svg>
                <span className="text-xl font-bold text-brand-dark font-serif">DOBbie</span>
            </div>
            <p className="text-sm text-brand-text">Uw slimme partner in verzuimadvies.</p>
          </div>
          <div>
            <h4 className="font-bold text-[#5A0D29] mb-4">Snelle Links</h4>
            <ul className="space-y-2">
              <li><a href="#waarom" className="text-sm text-brand-text hover:text-[#5A0D29]">Waarom DOBbie</a></li>
              <li><a href="#visie" className="text-sm text-brand-text hover:text-[#5A0D29]">Visie</a></li>
              <li><a href="#prijzen" className="text-sm text-brand-text hover:text-[#5A0D29]">Prijzen</a></li>
              <li><a href="#faq" className="text-sm text-brand-text hover:text-[#5A0D29]">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#5A0D29] mb-4">Contact</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-brand-text hover:text-[#5A0D29]">info@dobbie.nl</a></li>
              <li><a href="#" className="text-sm text-brand-text hover:text-[#5A0D29]">LinkedIn</a></li>
            </ul>
          </div>
           <div>
            <h4 className="font-bold text-[#5A0D29] mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-brand-text hover:text-[#5A0D29]">Privacybeleid</a></li>
              <li><a href="#" className="text-sm text-brand-text hover:text-[#5A0D29]">Algemene Voorwaarden</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200/50 pt-6 text-center text-sm text-brand-text">
          <p>&copy; {new Date().getFullYear()} DOBbie. Alle rechten voorbehouden.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
