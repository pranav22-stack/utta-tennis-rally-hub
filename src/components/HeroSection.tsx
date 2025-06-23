
import { Trophy, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onRegisterClick: () => void;
}

export const HeroSection = ({ onRegisterClick }: HeroSectionProps) => {
  return (
    <div className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 border-4 border-purple-400 rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 border-4 border-pink-400 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 border-4 border-orange-400 rounded-full"></div>
        <div className="absolute bottom-32 right-1/3 w-24 h-24 border-4 border-purple-500 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Catchy Tennis Phrase */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
            SERVE. RALLY. CONQUER.
          </h1>
          <div className="flex items-center justify-center space-x-4 text-2xl md:text-3xl text-gray-700 mb-6">
            <Star className="h-8 w-8 text-yellow-500" />
            <span className="font-bold">Where Champions Are Made</span>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
          
          {/* Register Button After Phrase */}
          <div className="mb-8">
            <Button 
              onClick={onRegisterClick}
              className="px-8 py-4 text-lg bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-bold transform hover:scale-105"
            >
              🎾 Register Now
            </Button>
          </div>
        </div>

        {/* Website Description */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-200">
            <div className="flex items-center justify-center mb-6">
              <Trophy className="h-12 w-12 text-pink-500 mr-4" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Tournament Registration Portal</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Experience the ultimate tennis tournament platform where passion meets precision! 
              Join India's most exciting doubles championship featuring cutting-edge registration technology, 
              intelligent partner matching, and seamless tournament coordination. From grassroots players 
              to seasoned champions, discover your competitive edge in our professionally managed tournaments 
              with world-class facilities and unmatched organizational excellence.
            </p>
            <div className="flex items-center justify-center mt-6 space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Zap className="h-4 w-4 text-yellow-500 mr-2" />
                <span>Instant Registration</span>
              </div>
              <div className="flex items-center">
                <Trophy className="h-4 w-4 text-pink-500 mr-2" />
                <span>5 Categories</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-orange-500 mr-2" />
                <span>Professional Management</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
