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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-md shadow-lg border-b border-luxury-gold/20'
            : 'bg-transparent'
        }`}
      >
        <div className="container-luxury">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="font-heading text-2xl font-bold text-luxury-charcoal">
              Everview
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="font-body text-sm font-medium text-foreground hover:text-luxury-gold transition-colors duration-200"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Solar Badge */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="bg-luxury-gold text-white px-4 py-2 rounded-full text-sm font-medium">
                No Load-Shedding • 100% Solar + 26kWh Storage
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-foreground hover:text-luxury-gold transition-colors"
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
          <div className="lg:hidden bg-background/98 backdrop-blur-md border-t border-luxury-gold/20">
            <div className="container-luxury py-6">
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => scrollToSection(item.href)}
                    className="font-body text-left text-base font-medium text-foreground hover:text-luxury-gold transition-colors duration-200 py-2"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="pt-4 border-t border-luxury-gold/20">
                  <div className="bg-luxury-gold text-white px-4 py-3 rounded-lg text-sm font-medium text-center">
                    No Load-Shedding • 100% Solar + 26kWh Storage
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