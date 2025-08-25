import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, Mail } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Overview', href: '#overview' },
    { label: 'Bedrooms', href: '#bedrooms' },
    { label: 'Living', href: '#living' },
    { label: 'Features', href: '#features' },
    { label: 'Sustainability', href: '#sustainability' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Location', href: '#location' },
    { label: 'Enquire', href: '#enquire' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white shadow-sm border-b border-ever-line'
            : 'glass'
        }`}
      >
        <div className="container-luxury">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className={`font-heading text-2xl font-bold transition-colors duration-300 ${
              isScrolled ? 'text-ever-ink' : 'text-white'
            }`}>
              Everview
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className={`font-body text-sm font-medium transition-all duration-200 tracking-wide relative hover:after:scale-x-100 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-ever-champ after:origin-bottom-right after:transition-transform after:duration-300 hover:after:origin-bottom-left ${
                    isScrolled ? 'text-ever-ink' : 'text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Solar Badge */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className={`border px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 transition-colors duration-300 ${
                isScrolled 
                  ? 'border-ever-champ text-ever-ink' 
                  : 'border-white/30 text-white'
              }`}>
                <div className="w-2 h-2 rounded-full bg-ever-blue"></div>
                Solar powered • No load-shedding
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-2 transition-colors ${
                isScrolled 
                  ? 'text-ever-ink hover:text-ever-blue' 
                  : 'text-white hover:text-ever-champ'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/98 backdrop-blur-md border-t border-ever-line">
            <div className="container-luxury py-6">
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => scrollToSection(item.href)}
                    className="font-body text-left text-base font-medium text-ever-ink hover:text-ever-blue transition-colors duration-200 py-2 tracking-wide"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="pt-4 border-t border-ever-line">
                  <div className="border border-ever-champ text-ever-ink px-4 py-3 rounded-full text-sm font-medium text-center flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-ever-blue"></div>
                    Solar powered • No load-shedding
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Sticky Enquire Button - Mobile Only */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => scrollToSection('#enquire')}
          className="btn-luxury shadow-lg"
        >
          Enquire Now
        </Button>
      </div>
    </>
  );
};

export default Navigation;