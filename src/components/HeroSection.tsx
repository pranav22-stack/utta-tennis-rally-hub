
import { Trophy, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onRegisterClick: () => void;
}

export const HeroSection = ({ onRegisterClick }: HeroSectionProps) => {
  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border-4 border-slate-600 rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 border-4 border-amber-600 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 border-4 border-slate-500 rounded-full"></div>
        <div className="absolute bottom-32 right-1/3 w-24 h-24 border-4 border-amber-500 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Catchy Tennis Phrase */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-4">
            SERVE. RALLY. CONQUER.
          </h1>
          <div className="flex items-center justify-center space-x-4 text-2xl md:text-3xl text-slate-700 mb-6">
            <Star className="h-8 w-8 text-amber-500" />
            <span className="font-bold">Where Champions Are Made</span>
            <Star className="h-8 w-8 text-amber-500" />
          </div>
          
          {/* Register Button After Phrase */}
          <div className="mb-8">
            <Button 
              onClick={onRegisterClick}
              className="px-8 py-4 text-lg bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-bold transform hover:scale-105"
            >
              🎾 Register Now
            </Button>
          </div>
        </div>

        {/* Website Description */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
            <div className="flex items-center justify-center mb-6">
              <Trophy className="h-12 w-12 text-amber-600 mr-4" />
              <h2 className="text-3xl font-bold text-slate-800">Tournament Registration Portal</h2>
            </div>
            <p className="text-lg text-slate-700 leading-relaxed">
              Welcome to the official registration platform for the Uttaranchal Tennis Association's 
              premier doubles tournament. Our state-of-the-art system streamlines player registration, 
              partner matching, and tournament management. Whether you're a seasoned pro or an emerging 
              talent, join us in celebrating the spirit of competitive tennis with world-class facilities 
              and exceptional tournament organization.
            </p>
            <div className="flex items-center justify-center mt-6 space-x-8 text-sm text-slate-600">
              <div className="flex items-center">
                <Zap className="h-4 w-4 text-amber-500 mr-2" />
                <span>Instant Registration</span>
              </div>
              <div className="flex items-center">
                <Trophy className="h-4 w-4 text-amber-500 mr-2" />
                <span>5 Categories</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-amber-500 mr-2" />
                <span>Professional Management</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
