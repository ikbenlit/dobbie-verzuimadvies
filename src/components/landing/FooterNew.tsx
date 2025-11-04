import { getCommonContent } from '@/lib/content';

export default function FooterNew() {
  const { footer } = getCommonContent();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bordeaux border-t border-bordeaux-hover pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <svg
                className="h-7 w-7 text-white"
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
              <span className="text-xl font-bold text-white font-serif">
                {footer.logo}
              </span>
            </div>
            <p className="text-sm text-white/80">{footer.tagline}</p>
          </div>

          {footer.sections.map((section, index) => (
            <div key={index}>
              <h4 className="font-bold text-gold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-sm text-white/80 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/20 pt-6 text-center">
          <p className="text-sm text-white">
            &copy; {currentYear} {footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
