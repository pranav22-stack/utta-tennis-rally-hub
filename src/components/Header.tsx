
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Trophy, Calendar, HelpCircle, Settings } from "lucide-react";

interface HeaderProps {
  onNavigate: (section: string) => void;
}

export const Header = ({ onNavigate }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Trophy },
    { id: 'tournaments', label: 'Tournaments', icon: Calendar },
    { id: 'help', label: 'Help', icon: HelpCircle },
    { id: 'admin', label: 'Admin', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (id === 'tournaments') {
      const tournamentsSection = document.getElementById('tournaments-section');
      if (tournamentsSection) {
        tournamentsSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (id === 'help') {
      const footerSection = document.getElementById('footer-section');
      if (footerSection) {
        footerSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      onNavigate(id);
    }
  };

  return (
    <header className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Trophy className="h-8 w-8 text-yellow-300" />
            <h1 className="text-xl font-bold">UTA Tennis</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-white/20 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleNavClick(item.id);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-white/20 transition-colors text-left"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
