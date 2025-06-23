
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-sky-50">
      <Header onNavigate={handleNavigation} />
      
      <HeroSection onRegisterClick={handleRegisterClick} />
      
      <TournamentInfo />

      {/* Action Buttons Section */}
      <div className="py-16 bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">Ready to Join the Tournament?</h2>
            <p className="text-xl text-gray-700">Choose your path to tennis excellence</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-4xl mx-auto">
            <Button 
              onClick={() => setActiveView('admin')}
              variant="outline" 
              className="w-full sm:w-auto px-8 py-6 text-lg border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white bg-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            >
              🔐 Admin Portal
            </Button>
            
            <Button 
              onClick={handleRegisterClick}
              className="w-full sm:w-auto px-12 py-6 text-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-bold transform hover:scale-105"
            >
              🎾 Register Now
            </Button>
            
            <Button 
              onClick={() => setActiveView('user')}
              variant="outline"
              className="w-full sm:w-auto px-8 py-6 text-lg border-2 border-sky-500 text-sky-600 hover:bg-sky-500 hover:text-white bg-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
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
