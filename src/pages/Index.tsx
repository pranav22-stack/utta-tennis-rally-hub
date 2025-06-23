
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AdminLogin } from "@/components/AdminLogin";
import { UserLogin } from "@/components/UserLogin";
import { RegistrationForm } from "@/components/RegistrationForm";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { TournamentInfo } from "@/components/TournamentInfo";

const Index = () => {
  const [activeView, setActiveView] = useState<'home' | 'admin' | 'user' | 'register'>('home');

  const handleNavigation = (section: string) => {
    switch (section) {
      case 'admin':
        setActiveView('admin');
        break;
      case 'home':
        setActiveView('home');
        break;
      default:
        setActiveView('home');
    }
  };

  const handleRegisterClick = () => {
    setActiveView('register');
  };

  if (activeView === 'admin') {
    return <AdminLogin onBack={() => setActiveView('home')} />;
  }

  if (activeView === 'user') {
    return <UserLogin onBack={() => setActiveView('home')} />;
  }

  if (activeView === 'register') {
    return <RegistrationForm onBack={() => setActiveView('home')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <Header onNavigate={handleNavigation} />
      
      <HeroSection onRegisterClick={handleRegisterClick} />
      
      <TournamentInfo />

      {/* Action Buttons Section */}
      <div className="py-16 bg-gradient-to-r from-slate-100 to-slate-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Ready to Join the Tournament?</h2>
            <p className="text-xl text-slate-600">Choose your path to tennis excellence</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-4xl mx-auto">
            <Button 
              onClick={() => setActiveView('admin')}
              variant="outline" 
              className="w-full sm:w-auto px-8 py-6 text-lg border-2 border-slate-600 text-slate-600 hover:bg-slate-600 hover:text-white bg-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            >
              🔐 Admin Portal
            </Button>
            
            <Button 
              onClick={handleRegisterClick}
              className="w-full sm:w-auto px-12 py-6 text-xl bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-bold transform hover:scale-105"
            >
              🎾 Register Now
            </Button>
            
            <Button 
              onClick={() => setActiveView('user')}
              variant="outline"
              className="w-full sm:w-auto px-8 py-6 text-lg border-2 border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white bg-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            >
              👤 Player Login
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
